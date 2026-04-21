package com.example.spiderlink.infra.tcp.handler;

import com.example.spiderlink.domain.demo.dto.DemoPocUserResponse;
import com.example.spiderlink.domain.demo.mapper.DemoMapper;
import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import com.example.spiderlink.infra.tcp.model.JsonCommandResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * DEMO_AUTH_ME 커맨드 핸들러.
 *
 * <p>demo/backend 사용자 프로필 조회 요청을 수신하여 D_SPIDERLINK.POC_USER를 조회한다.</p>
 *
 * <p>payload: { userId }</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoAuthMeCommandHandler implements CommandHandler {

    private static final String TRX_ID = "DEMO_AUTH_ME";

    private final DemoMapper demoMapper;

    @Override
    public boolean supports(String command) {
        return TRX_ID.equals(command);
    }

    @Override
    public Object handle(String command, JsonCommandRequest request) {
        Map<String, Object> payload = request.getPayload();
        String userId = payload != null ? String.valueOf(payload.getOrDefault("userId", "")) : "";

        if (userId.isBlank()) {
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("userId가 누락되었습니다.")
                    .build();
        }

        DemoPocUserResponse user = demoMapper.selectPocUserById(userId);

        if (user == null) {
            log.info("[DemoAuthMeCommandHandler] 사용자 없음: userId={}", userId);
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("사용자를 찾을 수 없습니다.")
                    .build();
        }

        log.info("[DemoAuthMeCommandHandler] 프로필 조회 성공: userId={}", userId);
        return JsonCommandResponse.builder()
                .command(command)
                .success(true)
                .payload(Map.<String, Object>of(
                        "userId",         user.getUserId(),
                        "userName",       user.getUserName(),
                        "userGrade",      user.getUserGrade(),
                        "lastLoginDtime", user.getLastLoginDtime() != null ? user.getLastLoginDtime() : ""
                ))
                .build();
    }
}
