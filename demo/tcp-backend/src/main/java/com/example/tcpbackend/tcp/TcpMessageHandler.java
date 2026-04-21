/**
 * @file TcpMessageHandler.java
 * @description Netty 메인 인바운드 핸들러 — TCP 커맨드 라우팅 및 세션 인증.
 *              LengthPrefixDecoder가 역직렬화한 TcpRequest를 받아
 *              커맨드 타입에 따라 적절한 도메인 Handler로 위임한다.
 *
 * @description 커맨드 목록:
 *   인증 불필요: LOGIN
 *   세션 필요:   LOGOUT, GET_PROFILE, GET_CARDS, GET_TRANSACTIONS,
 *                GET_PAYMENT_STATEMENT, GET_PAYABLE_AMOUNT, IMMEDIATE_PAY,
 *                RESET_PIN_ATTEMPTS, NOTICE_SUBSCRIBE
 *   Admin 전용:  NOTICE_SYNC, NOTICE_END, NOTICE_PREVIEW (adminSecret 검증은 NoticeHandler에서)
 */
package com.example.tcpbackend.tcp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.tcpbackend.handler.AuthHandler;
import com.example.tcpbackend.handler.CardHandler;
import com.example.tcpbackend.handler.NoticeHandler;
import com.example.tcpbackend.handler.TransactionHandler;
import com.example.tcpbackend.tcp.session.SessionInfo;
import com.example.tcpbackend.tcp.session.TcpSessionManager;

import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;

/**
 * TCP 메시지 라우터.
 *
 * <p>{@code @ChannelHandler.Sharable}: 상태를 가지지 않으므로 모든 채널이 단일 인스턴스를 공유한다.
 * 채널별 상태(세션 등)는 {@link TcpSessionManager}에서 관리한다.
 */
@Component
@ChannelHandler.Sharable
public class TcpMessageHandler extends SimpleChannelInboundHandler<TcpRequest> {

    private static final Logger log = LoggerFactory.getLogger(TcpMessageHandler.class);

    private final TcpSessionManager sessionManager;
    private final AuthHandler authHandler;
    private final CardHandler cardHandler;
    private final TransactionHandler transactionHandler;
    private final NoticeHandler noticeHandler;

    public TcpMessageHandler(TcpSessionManager sessionManager,
                              AuthHandler authHandler,
                              CardHandler cardHandler,
                              TransactionHandler transactionHandler,
                              NoticeHandler noticeHandler) {
        this.sessionManager     = sessionManager;
        this.authHandler        = authHandler;
        this.cardHandler        = cardHandler;
        this.transactionHandler = transactionHandler;
        this.noticeHandler      = noticeHandler;
    }

    // ── Netty 생명주기 이벤트 ─────────────────────────────────────────────────

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        log.info("[TCP] 클라이언트 연결 (channel={})", ctx.channel().id());
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) {
        // 채널 종료 시 연결된 세션을 자동으로 정리
        sessionManager.onChannelInactive(ctx.channel());
        log.info("[TCP] 클라이언트 연결 종료 (channel={})", ctx.channel().id());
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        log.error("[TCP] 채널 예외 발생 (channel={}): {}", ctx.channel().id(), cause.getMessage());
        ctx.close();
    }

    // ── 메시지 처리 ────────────────────────────────────────────────────────────

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, TcpRequest request) {
        String cmd = request.getCmd();
        if (cmd == null || cmd.isBlank()) {
            ctx.writeAndFlush(TcpResponse.error("UNKNOWN", "cmd 필드가 필요합니다."));
            return;
        }

        log.debug("[TCP] 수신 (channel={}, cmd={})", ctx.channel().id(), cmd);

        TcpResponse response = route(ctx, request, cmd);
        ctx.writeAndFlush(response);
    }

    /**
     * 커맨드 타입에 따라 적절한 핸들러로 요청을 위임한다.
     *
     * <p>LOGIN은 인증 없이 처리한다.
     * Admin 전용 커맨드(NOTICE_*)는 세션 대신 adminSecret을 사용한다.
     * 나머지 커맨드는 세션 검증 후 처리한다.
     *
     * @param ctx     Netty 채널 컨텍스트
     * @param request 역직렬화된 요청
     * @param cmd     커맨드 문자열
     * @return 응답 메시지
     */
    private TcpResponse route(ChannelHandlerContext ctx, TcpRequest request, String cmd) {
        return switch (cmd) {

            // ── 인증 불필요 ─────────────────────────────────────────────
            case "LOGIN" -> authHandler.handleLogin(request, ctx.channel());

            // ── Admin 전용 (adminSecret 검증은 NoticeHandler 내부에서) ──
            case "NOTICE_SYNC"    -> noticeHandler.handleSync(request);
            case "NOTICE_END"     -> noticeHandler.handleEnd(request);
            case "NOTICE_PREVIEW" -> noticeHandler.handlePreview(request);

            // ── 세션 인증 필요 커맨드 ───────────────────────────────────
            default -> {
                SessionInfo session = sessionManager.getSession(request.getSessionId());
                if (session == null) {
                    // 유효하지 않은 세션 — 클라이언트에게 재로그인 요구
                    yield TcpResponse.error(cmd, "인증이 필요합니다. 다시 로그인하세요.");
                }
                yield routeAuthenticated(ctx, request, cmd, session);
            }
        };
    }

    /**
     * 세션 인증이 완료된 커맨드를 처리한다.
     *
     * @param ctx     Netty 채널 컨텍스트
     * @param request 요청
     * @param cmd     커맨드
     * @param session 검증된 세션 정보
     * @return 응답
     */
    private TcpResponse routeAuthenticated(ChannelHandlerContext ctx, TcpRequest request,
                                            String cmd, SessionInfo session) {
        return switch (cmd) {

            // 인증
            case "LOGOUT"      -> authHandler.handleLogout(request);
            case "GET_PROFILE" -> authHandler.handleGetProfile(request, session);

            // 카드
            case "GET_CARDS"          -> cardHandler.handleGetCards(session);
            case "GET_PAYABLE_AMOUNT" -> cardHandler.handleGetPayableAmount(request, session);
            case "IMMEDIATE_PAY"      -> cardHandler.handleImmediatePay(request, session);
            case "RESET_PIN_ATTEMPTS" -> cardHandler.handleResetPinAttempts(request, session);

            // 이용내역
            case "GET_TRANSACTIONS"      -> transactionHandler.handleGetTransactions(request, session);
            case "GET_PAYMENT_STATEMENT" -> transactionHandler.handleGetPaymentStatement(request, session);

            // 공지 구독 (Frontend가 연결 유지 상태에서 구독)
            case "NOTICE_SUBSCRIBE" -> noticeHandler.handleSubscribe(ctx.channel());

            // 알 수 없는 커맨드
            default -> TcpResponse.error(cmd, "알 수 없는 커맨드입니다: " + cmd);
        };
    }
}
