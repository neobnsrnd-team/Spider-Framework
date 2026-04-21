package com.example.spiderlink.domain.demo.mapper;

import com.example.spiderlink.domain.demo.dto.DemoPayableAmtResponse;
import com.example.spiderlink.domain.demo.dto.DemoPocUserResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * Demo 앱 전문통신용 Mapper.
 *
 * <p>demo/backend 전문 수신 시 D_SPIDERLINK 스키마를 조회한다.
 * spider-link DB 사용자에게 D_SPIDERLINK 스키마 접근 권한이 필요하다.</p>
 */
@Mapper
public interface DemoMapper {

    DemoPocUserResponse selectPocUserByIdAndPassword(
            @Param("userId") String userId,
            @Param("password") String password);

    DemoPocUserResponse selectPocUserById(String userId);

    void updateLastLoginDtime(String userId);

    DemoPayableAmtResponse selectPayableAmt(
            @Param("userId") String userId,
            @Param("cardId") String cardId);
}
