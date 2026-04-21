package com.example.spiderlink.infra.tcp.parser;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 고정길이 전문의 반복 구조 필드 (_BeginLoop_xxx).
 *
 * <p>FWK_MESSAGE_FIELD에서 MESSAGE_FIELD_ID가 "_BeginLoop_xxx"인 행에 대응한다.
 * "_EndLoop_" 까지의 하위 필드를 children으로 보유한다.</p>
 *
 * <h4>반복 횟수 결정 규칙</h4>
 * <pre>
 * length > 0  → 해당 길이만큼 바이트를 읽어 반복 횟수로 파싱
 * length == 0 AND defaultValue 있음 → dataMap에서 defaultValue 키로 횟수 조회
 * length == 0 AND maxOccurs > 0     → maxOccurs 고정 사용
 * </pre>
 */
public class LoopField extends MessageField {

    /**
     * 최대 반복 횟수 (FIELD_REPEAT_CNT).
     * length == 0 이고 defaultValue 가 없을 때 고정 반복 횟수로 사용.
     */
    private final int maxOccurs;

    /**
     * 반복 횟수를 담고 있는 다른 필드명 (DEFAULT_VALUE).
     * length == 0 일 때 이 이름으로 이미 파싱된 dataMap에서 횟수를 가져온다.
     */
    private final String defaultValue;

    /** 반복 구조 내 하위 필드 목록 */
    private final List<MessageField> children = new ArrayList<>();

    public LoopField(String name, int loopCountLength, int maxOccurs, String defaultValue) {
        // LoopField 자체의 dataType·align·filler는 파싱에 쓰이지 않고 count 읽기에만 사용
        super(name, MessageField.NUM, loopCountLength, 0, MessageField.RIGHT, '0', null, true);
        this.maxOccurs    = maxOccurs;
        this.defaultValue = defaultValue;
    }

    public int getMaxOccurs() {
        return maxOccurs;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void addChild(MessageField field) {
        children.add(field);
    }

    public List<MessageField> getChildren() {
        return Collections.unmodifiableList(children);
    }
}
