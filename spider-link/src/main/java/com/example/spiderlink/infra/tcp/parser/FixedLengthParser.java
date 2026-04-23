package com.example.spiderlink.infra.tcp.parser;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * 고정길이(Fixed Length) 전문 파서.
 *
 * <p>MessageStructure(FWK_MESSAGE_FIELD 메타데이터)를 기반으로 byte[] 를
 * {@code Map<String, Object>}로 파싱한다.</p>
 *
 * <p>IBKFixedLengthMessageParserBiz(spiderlink_Admin 원본 소스) 로직을
 * Spring Boot 스타일로 재구현하였다.</p>
 *
 * <h4>지원 데이터 타입</h4>
 * <pre>
 * C (문자)   → String (trim 없이 원본 유지)
 * N (숫자)   → String (scale > 0 이면 소수점 포함)
 * H (헥사)   → String (hex 문자열)
 * B (바이너리)→ Integer (4byte) / Short (2byte)
 * K (한글)   → String (EUC-KR 디코딩)
 * </pre>
 */
@Slf4j
@Component
public class FixedLengthParser {

    /**
     * byte[] 를 MessageStructure 기반으로 파싱하여 Map으로 반환한다.
     *
     * @param structure 전문 구조 (필드 메타데이터 포함)
     * @param bytes     수신 raw bytes
     * @return 필드명 → 값 Map (반복 구조는 List<Map> 로 담김)
     */
    public Map<String, Object> parse(MessageStructure structure, byte[] bytes) {
        Map<String, Object> result = new LinkedHashMap<>();
        int[] offset = {0}; // 배열로 감싸서 람다 내 변경 허용

        for (MessageField field : structure.getFields()) {
            if (offset[0] >= bytes.length) {
                log.debug("[FixedLengthParser] 전문 끝 도달, 남은 필드 생략: field={}", field.getName());
                break;
            }

            if (field instanceof LoopField loop) {
                Object loopResult = parseLoopField(loop, bytes, offset, result);
                result.put(loop.getName(), loopResult);
            } else {
                Object value = parseField(field, bytes, offset);
                result.put(field.getName(), value);
            }
        }

        return result;
    }

    /** 반복 구조 파싱 — 반복 횟수만큼 하위 필드를 List<Map>으로 반환 */
    private List<Map<String, Object>> parseLoopField(
            LoopField loop, byte[] bytes, int[] offset, Map<String, Object> context) {

        int count = resolveLoopCount(loop, bytes, offset, context);
        List<Map<String, Object>> rows = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {
            if (offset[0] >= bytes.length) {
                log.debug("[FixedLengthParser] 반복 {} 중 전문 끝 도달 ({}/{})", loop.getName(), i, count);
                break;
            }

            Map<String, Object> row = new LinkedHashMap<>();
            for (MessageField child : loop.getChildren()) {
                if (child instanceof LoopField nestedLoop) {
                    // 중첩 반복 구조 지원
                    row.put(nestedLoop.getName(), parseLoopField(nestedLoop, bytes, offset, context));
                } else {
                    row.put(child.getName(), parseField(child, bytes, offset));
                }
            }
            rows.add(row);
        }
        return rows;
    }

    /**
     * 반복 횟수 결정.
     *
     * <ul>
     *   <li>loop.length > 0: 해당 바이트 읽어 숫자로 파싱</li>
     *   <li>loop.length == 0 && defaultValue 있음: context Map에서 값 조회</li>
     *   <li>loop.length == 0 && maxOccurs > 0: maxOccurs 고정</li>
     * </ul>
     */
    private int resolveLoopCount(LoopField loop, byte[] bytes, int[] offset, Map<String, Object> context) {
        if (loop.getLength() > 0) {
            // 전문에 반복 횟수가 직접 기술된 경우
            String raw = readString(bytes, offset[0], loop.getLength());
            offset[0] += loop.getLength();
            try {
                return Integer.parseInt(raw.trim());
            } catch (NumberFormatException e) {
                log.warn("[FixedLengthParser] 반복 횟수 파싱 실패: loop={}, raw='{}', 0으로 처리", loop.getName(), raw);
                return 0;
            }
        }

        if (loop.getDefaultValue() != null && !loop.getDefaultValue().isBlank()) {
            // 이미 파싱된 다른 필드에서 반복 횟수 참조
            Object refValue = context.get(loop.getDefaultValue());
            if (refValue != null) {
                try {
                    return Integer.parseInt(refValue.toString().trim());
                } catch (NumberFormatException e) {
                    log.warn("[FixedLengthParser] 참조 필드 반복 횟수 변환 실패: ref={}, val={}", loop.getDefaultValue(), refValue);
                }
            }
        }

        return loop.getMaxOccurs();
    }

    /** 단일 필드 파싱 — offset 을 field.length 만큼 전진시킴 */
    private Object parseField(MessageField field, byte[] bytes, int[] offset) {
        // 실제 남은 길이가 정의 길이보다 짧으면 남은 길이만큼만 읽음
        int actualLen = Math.min(field.getLength(), bytes.length - offset[0]);
        Object value  = parseByteField(field, bytes, offset[0], actualLen);

        if (log.isDebugEnabled() && field.isLogMode()) {
            String display = field.getRemark() != null
                    ? "*".repeat(actualLen)   // 마스킹 필드는 별표로 표시
                    : String.valueOf(value);
            log.debug("[FixedLengthParser] offset={}, field={}, value={}", offset[0], field.getName(), display);
        }

        offset[0] += field.getLength(); // 정의 길이만큼 전진 (짧아도 동일)
        return value;
    }

    /** 바이트 배열을 데이터 타입에 맞게 파싱 */
    private Object parseByteField(MessageField field, byte[] bytes, int offset, int len) {
        return switch (field.getDataType()) {
            case MessageField.CHR    -> readString(bytes, offset, len);
            case MessageField.NUM    -> readNumeric(field, bytes, offset, len);
            case MessageField.HEXA   -> toHex(bytes, offset, len);
            case MessageField.BINARY -> readBinary(bytes, offset, len);
            case MessageField.KOREAN -> readKorean(bytes, offset, len);
            default -> {
                log.warn("[FixedLengthParser] 알 수 없는 데이터 타입: {}, 문자열로 처리", field.getDataType());
                yield readString(bytes, offset, len);
            }
        };
    }

    /** C 타입: trim 없이 원본 문자열 반환 */
    private String readString(byte[] bytes, int offset, int len) {
        return new String(bytes, offset, len);
    }

    /**
     * N 타입: scale 처리 포함.
     * scale > 0 이면 소수점 자릿수 만큼 뒤에서 분리하여 정수부.소수부 형식으로 반환.
     */
    private String readNumeric(MessageField field, byte[] bytes, int offset, int len) {
        if (field.getScale() == 0) {
            return new String(bytes, offset, len).trim();
        }
        // 끝에서 scale 자리만큼이 소수부
        String intPart  = new String(bytes, offset, len - field.getScale());
        String fracPart = new String(bytes, offset + len - field.getScale(), field.getScale());
        return (intPart + fracPart).trim(); // 소수점 삽입 없이 원본 보존 (원본 SpiderLink와 동일)
    }

    /** H 타입: 각 바이트를 2자리 16진수 문자열로 변환 */
    private String toHex(byte[] bytes, int offset, int len) {
        StringBuilder sb = new StringBuilder(len * 2);
        for (int i = 0; i < len; i++) {
            sb.append(String.format("%02X", bytes[offset + i]));
        }
        return sb.toString();
    }

    /**
     * B 타입: big-endian 바이너리.
     * 4바이트 → int, 2바이트 → short, 그 외 → hex 문자열
     */
    private Object readBinary(byte[] bytes, int offset, int len) {
        if (len == 4) {
            return ((bytes[offset] & 0xFF) << 24)
                 | ((bytes[offset + 1] & 0xFF) << 16)
                 | ((bytes[offset + 2] & 0xFF) << 8)
                 |  (bytes[offset + 3] & 0xFF);
        }
        if (len == 2) {
            return (short) (((bytes[offset] & 0xFF) << 8) | (bytes[offset + 1] & 0xFF));
        }
        // 그 외 길이는 hex로 fallback
        return toHex(bytes, offset, len);
    }

    /**
     * K 타입: 한글(EUC-KR) 바이트 배열을 문자열로 디코딩.
     * 실제 운영 환경에 따라 charset 이 다를 수 있으므로 필요 시 수정.
     */
    private String readKorean(byte[] bytes, int offset, int len) {
        byte[] buf = new byte[len];
        System.arraycopy(bytes, offset, buf, 0, len);
        return new String(buf, Charset.forName("EUC-KR"));
    }
}
