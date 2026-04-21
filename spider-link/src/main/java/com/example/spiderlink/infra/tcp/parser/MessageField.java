package com.example.spiderlink.infra.tcp.parser;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 고정길이 전문의 단일 필드 모델.
 *
 * <p>FWK_MESSAGE_FIELD 한 행에 대응하며, FixedLengthParser가
 * byte[] 파싱 시 오프셋·길이·타입 정보로 사용한다.</p>
 */
@Getter
@AllArgsConstructor
public class MessageField {

    /** DATA_TYPE: 문자 */
    public static final String CHR = "C";
    /** DATA_TYPE: 숫자 */
    public static final String NUM = "N";
    /** DATA_TYPE: 헥사 */
    public static final String HEXA = "H";
    /** DATA_TYPE: 바이너리 (4byte=int, 2byte=short) */
    public static final String BINARY = "B";
    /** DATA_TYPE: 한글 (DBCS) */
    public static final String KOREAN = "K";

    /** ALIGN: 왼쪽 정렬 (문자형 기본) */
    public static final String LEFT = "L";
    /** ALIGN: 오른쪽 정렬 (숫자형 기본) */
    public static final String RIGHT = "R";

    /** MESSAGE_FIELD_ID — DataMap 키로 사용 */
    private final String name;

    /** DATA_TYPE */
    private final String dataType;

    /** DATA_LENGTH (byte 단위) */
    private final int length;

    /** SCALE (소수점 자릿수, 0이면 정수) */
    private final int scale;

    /** ALIGN */
    private final String align;

    /**
     * FILLER 문자.
     * 숫자형은 보통 '0', 문자형은 ' '(공백).
     */
    private final char filler;

    /**
     * REMARK — 로그 마스킹 시 이 문자로 해당 필드를 덮어 씀.
     * null 이면 마스킹 없음.
     */
    private final String remark;

    /** LOG_YN — false 면 파싱 결과를 디버그 로그에 출력하지 않음 */
    private final boolean logMode;
}
