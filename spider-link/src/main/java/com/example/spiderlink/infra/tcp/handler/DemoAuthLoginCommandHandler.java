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
 * DEMO_AUTH_LOGIN 커맨드 핸들러.
 *
 * <p>demo/backend 로그인 요청을 수신하여 D_SPIDERLINK.POC_USER를 조회한다.
 * JWT 발급은 demo/backend에서 수행한다.</p>
 *
 * <p>payload: { userId, password }</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoAuthLoginCommandHandler implements CommandHandler {

    private static final String TRX_ID = "DEMO_AUTH_LOGIN";

    private final DemoMapper demoMapper;

    @Override
    public boolean supports(String command) {
        return TRX_ID.equals(command);
    }

    @Override
    public Object handle(String command, JsonCommandRequest request) {
        Map<String, Object> payload = request.getPayload();
        String userId   = payload != null ? String.valueOf(payload.getOrDefault("userId", ""))   : "";
        String password = payload != null ? String.valueOf(payload.getOrDefault("password", "")) : "";

        if (userId.isBlank() || password.isBlank()) {
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("userId 또는 password가 누락되었습니다.")
                    .build();
        }

        DemoPocUserResponse user = demoMapper.selectPocUserByIdAndPassword(userId, password);

        if (user == null) {
            log.info("[DemoAuthLoginCommandHandler] 인증 실패: userId={}", userId);
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("아이디 또는 비밀번호가 틀렸습니다.")
                    .build();
        }

        if (!"Y".equals(user.getLogYn())) {
            log.info("[DemoAuthLoginCommandHandler] 비활성 계정: userId={}", userId);
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("사용이 정지된 계정입니다. 관리자에게 문의하세요.")
                    .build();
        }

        try {
            demoMapper.updateLastLoginDtime(userId);
        } catch (Exception e) {
            log.warn("[DemoAuthLoginCommandHandler] LAST_LOGIN_DTIME 업데이트 실패: userId={}, error={}", userId, e.getMessage());
        }

        log.info("[DemoAuthLoginCommandHandler] 인증 성공: userId={}", userId);
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
