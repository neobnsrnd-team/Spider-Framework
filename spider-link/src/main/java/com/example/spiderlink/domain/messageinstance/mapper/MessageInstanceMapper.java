package com.example.spiderlink.domain.messageinstance.mapper;

import com.example.spiderlink.domain.messageinstance.dto.MessageInstanceInsertRequest;
import org.apache.ibatis.annotations.Mapper;

/**
 * FWK_MESSAGE_INSTANCE 테이블 INSERT 전용 Mapper.
 *
 * <p>Demo TCP 전문 거래 로그를 적재한다. 조회는 Admin에서 담당한다.</p>
 */
@Mapper
public interface MessageInstanceMapper {

    /**
     * 전문 거래 로그 1건을 INSERT한다.
     *
     * @param request INSERT 요청 DTO
     */
    void insert(MessageInstanceInsertRequest request);
}
