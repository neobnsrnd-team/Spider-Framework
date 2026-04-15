package com.example.admin_demo.domain.reactgenerate.service;

import com.example.admin_demo.domain.reactgenerate.ai.client.ClaudeApiClient;
import com.example.admin_demo.domain.reactgenerate.ai.prompt.PromptBuilder;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.enums.ReactGenerateStatus;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaDesignContext;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaDesignExtractor;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaUrlParser;
import com.example.admin_demo.domain.reactgenerate.figma.client.FigmaApiClient;
import com.example.admin_demo.domain.reactgenerate.figma.client.FigmaNodeResponse;
import com.example.admin_demo.domain.reactgenerate.mapper.ReactGenerateMapper;
import com.example.admin_demo.domain.reactgenerate.validator.CodeValidationResult;
import com.example.admin_demo.domain.reactgenerate.validator.CodeValidator;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.exception.base.BaseException;
import com.example.admin_demo.global.log.event.ErrorLogEvent;
import com.example.admin_demo.global.util.TraceIdUtil;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.logging.LogLevel;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReactGenerateService {

    private final ReactGenerateMapper reactGenerateMapper;
    private final PromptBuilder promptBuilder;
    private final ClaudeApiClient claudeApiClient;
    private final FigmaApiClient figmaApiClient;
    private final FigmaDesignExtractor figmaDesignExtractor;
    private final CodeValidator codeValidator;
    private final ApplicationEventPublisher eventPublisher;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /**
     * Figma URL과 요구사항을 받아 Claude API로 React 코드를 생성하고 DB에 저장한다.
     *
     * @param request figmaUrl, requirements
     * @param createdBy 생성 요청자 ID (로그인 사용자)
     * @return 생성된 코드와 메타 정보
     */
    public ReactGenerateResponse generate(ReactGenerateRequest request, String createdBy) {
        log.info("React 코드 생성 요청 — figmaUrl: {}, userId: {}", request.getFigmaUrl(), createdBy);

        // 실패 이력 저장에 필요하므로 try 바깥에서 미리 생성
        String id = UUID.randomUUID().toString();
        String now = LocalDateTime.now().format(FORMATTER);

        // 어느 단계에서 실패해도 그 시점까지 수집된 값을 실패 이력에 기록하기 위해 바깥에 선언
        String systemPrompt = null;
        String userPrompt = null;
        String reactCode = null;

        try {
            // 1. Figma URL에서 fileKey, nodeId 파싱
            FigmaUrlParser.ParsedFigmaUrl parsed = FigmaUrlParser.parse(request.getFigmaUrl());
            log.info("Figma URL 파싱 완료 — fileKey: {}, nodeId: {}", parsed.getFileKey(), parsed.getNodeId());

            // 2. Figma API 호출로 디자인 노드 데이터 수신
            FigmaNodeResponse figmaNodeResponse = figmaApiClient.getNode(parsed.getFileKey(), parsed.getNodeId());

            // 3. 원시 Figma 응답에서 Claude 프롬프트용 디자인 컨텍스트 추출
            FigmaDesignContext designContext =
                    figmaDesignExtractor.extract(figmaNodeResponse, parsed.getNodeId(), request.getFigmaUrl());
            log.info(
                    "Figma 디자인 추출 완료 — component: {} ({}), size: {}×{}",
                    designContext.getComponentName(),
                    designContext.getComponentType(),
                    designContext.getWidth(),
                    designContext.getHeight());

            // 4. system / user prompt 조립 (Figma 디자인 컨텍스트 포함)
            systemPrompt = promptBuilder.buildSystemPrompt();
            userPrompt = promptBuilder.buildUserPrompt(designContext, request.getRequirements());

            // 5. Claude API 호출하여 React 코드 생성
            // TODO : 현재 Claude API 는 코드만 구현한 상태 (Claude API 확정 후, 위의 주석 제거 후 테스트 필요)
            //        reactCode = claudeApiClient.generate(systemPrompt, userPrompt);
            reactCode =
                    """
                import { Eye, EyeOff, KeyRound, Fingerprint, QrCode } from "lucide-react";
                import { BlankPageLayout } from "@cl/layout/BlankPageLayout";
                import { AppBrandHeader } from "@cl/layout/AppBrandHeader";
                import { Stack } from "@cl/layout/Stack";
                import { Inline } from "@cl/layout/Inline";
                import { Typography } from "@cl/core/Typography";
                import { Input } from "@cl/core/Input";
                import { Button } from "@cl/core/Button";
                import { DividerWithLabel } from "@cl/modules/common/DividerWithLabel";
                import { QuickMenuGrid } from "@cl/biz/common/QuickMenuGrid";

                interface LoginPageProps {
                  hasError?: boolean;
                  showPassword?: boolean;
                  onTogglePassword?: () => void;
                  onLogin?: () => void;
                }

                export default function LoginPage({
                  hasError = false,
                  showPassword = false,
                  onTogglePassword,
                  onLogin,
                }: LoginPageProps) {
                  const ALT_LOGIN_ITEMS = [
                    {
                      id: "pin",
                      icon: <KeyRound size={20} />,
                      label: "간편 비밀번호",
                      onClick: () => {},
                    },
                    {
                      id: "bio",
                      icon: <Fingerprint size={20} />,
                      label: "생체인증",
                      onClick: () => {},
                    },
                    {
                      id: "qr",
                      icon: <QrCode size={20} />,
                      label: "QR 로그인",
                      onClick: () => {},
                    },
                  ];

                  return (
                    <BlankPageLayout>
                      <AppBrandHeader brandInitial="H" brandName="하나카드" />

                      <Stack gap="md" className="px-standard pt-xl pb-md">
                        <Stack gap="xs" className="pb-md">
                          <Typography
                            as="h1"
                            variant="heading"
                            color="heading"
                            className="text-3xl"
                          >
                            로그인
                          </Typography>
                          <Typography variant="body" color="muted">
                            하나카드에 오신 것을 환영합니다
                          </Typography>
                        </Stack>

                        <Stack gap="lg">
                          <Input
                            label="아이디"
                            type="text"
                            placeholder="아이디를 입력하세요"
                            defaultValue="hanabank_user"
                            fullWidth
                          />
                          <Input
                            label="비밀번호"
                            type={showPassword ? "text" : "password"}
                            placeholder="비밀번호를 입력하세요"
                            defaultValue="password123"
                            fullWidth
                            validationState={hasError ? "error" : "default"}
                            helperText={
                              hasError ? "아이디 또는 비밀번호가 틀렸습니다" : undefined
                            }
                            rightElement={
                              <button
                                type="button"
                                onClick={onTogglePassword}
                                aria-label={showPassword ? "비밀번호 숨김" : "비밀번호 표시"}
                                className="text-text-muted"
                              >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                              </button>
                            }
                          />
                        </Stack>

                        <Inline justify="center" gap="sm" className="py-sm">
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            아이디 찾기
                          </Button>
                          <div
                            className="w-px h-3 bg-border-subtle self-center"
                            aria-hidden="true"
                          />
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            비밀번호 변경
                          </Button>
                          <div
                            className="w-px h-3 bg-border-subtle self-center"
                            aria-hidden="true"
                          />
                          <Button variant="ghost" size="sm" onClick={() => {}}>
                            회원가입
                          </Button>
                        </Inline>

                        <div className="pt-md">
                          <Button variant="primary" size="lg" fullWidth onClick={onLogin}>
                            로그인
                          </Button>
                        </div>
                      </Stack>

                      <Stack gap="xl" className="px-standard pb-2xl">
                        <DividerWithLabel label="다른 로그인 방식" />
                        <QuickMenuGrid cols={3} items={ALT_LOGIN_ITEMS} />
                      </Stack>
                    </BlankPageLayout>
                  );
                }
                """;

            // 6. 보안 패턴 검증 (Java 정규표현식 기반, Node.js/ESLint 불필요)
            CodeValidationResult validation = codeValidator.validate(reactCode);
            if (!validation.isPassed()) {
                // ERROR 위반 → catch 블록에서 실패 이력 저장 후 예외 재전파
                log.warn("React 코드 보안 검증 실패 — errors: {}", String.join(" | ", validation.getErrors()));
                throw new InvalidInputException("보안 검증 실패: " + String.join(", ", validation.getErrors()));
            }
            if (!validation.getWarnings().isEmpty()) {
                log.warn("React 코드 보안 경고 — warnings: {}", String.join(" | ", validation.getWarnings()));
            }

            // 7. DB 저장 (초기 상태: GENERATED)
            reactGenerateMapper.insert(
                    id,
                    request.getFigmaUrl(),
                    request.getRequirements(),
                    systemPrompt,
                    userPrompt,
                    reactCode,
                    null, // failReason: 성공이므로 null
                    ReactGenerateStatus.GENERATED.name(),
                    createdBy,
                    now);

            log.info("React 코드 생성 완료 — codeId: {}", id);

            return ReactGenerateResponse.builder()
                    .codeId(id)
                    .figmaUrl(request.getFigmaUrl())
                    .reactCode(reactCode)
                    .status(ReactGenerateStatus.GENERATED.name())
                    .createDtime(now)
                    // WARN 경고가 없으면 null을 반환해 프론트엔드에서 불필요한 렌더링 방지
                    .validationWarnings(validation.getWarnings().isEmpty() ? null : validation.getWarnings())
                    .build();

        } catch (Exception e) {
            // 생성 파이프라인 어느 단계에서든 실패 시 이력 저장 후 예외 재전파
            // null 필드는 해당 단계에 도달하기 전에 실패했음을 의미

            // BaseException은 getMessage()가 ErrorType 고정 문구를 반환하므로
            // detailMessage(실제 상세 오류)가 있으면 우선 사용한다
            String failReason = (e instanceof BaseException be && be.getDetailMessage() != null)
                    ? be.getDetailMessage()
                    : e.getMessage();

            log.error("React 코드 생성 실패 — codeId: {}, error: {}", id, failReason);
            reactGenerateMapper.insert(
                    id,
                    request.getFigmaUrl(),
                    request.getRequirements(),
                    systemPrompt,
                    userPrompt,
                    reactCode,
                    failReason,
                    ReactGenerateStatus.FAILED.name(),
                    createdBy,
                    now);
            throw e; // 원래 예외를 그대로 재전파 → GlobalExceptionHandler에서 처리
        }
    }

    /**
     * 생성된 코드를 관리자 승인 요청 상태로 변경한다.
     */
    public ReactGenerateApprovalResponse requestApproval(String id) {
        requireExists(id);

        reactGenerateMapper.updateStatus(id, ReactGenerateStatus.PENDING_APPROVAL.name(), null, null);
        log.info("승인 요청 — codeId: {}", id);

        return ReactGenerateApprovalResponse.builder()
                .codeId(id)
                .status(ReactGenerateStatus.PENDING_APPROVAL.name())
                .build();
    }

    /**
     * 관리자가 생성 코드를 승인한다.
     */
    public ReactGenerateApprovalResponse approve(String id, String approvedBy) {
        requireExists(id);

        String now = LocalDateTime.now().format(FORMATTER);
        reactGenerateMapper.updateStatus(id, ReactGenerateStatus.APPROVED.name(), approvedBy, now);
        log.info("승인 완료 — codeId: {}, approvalUserId: {}", id, approvedBy);

        return ReactGenerateApprovalResponse.builder()
                .codeId(id)
                .status(ReactGenerateStatus.APPROVED.name())
                .approvalUserId(approvedBy)
                .approvalDtime(now)
                .build();
    }

    /**
     * Preview App에서 발생한 렌더링 오류를 기록한다.
     *
     * <p>브라우저 side에서 catch된 오류는 서버까지 전달되지 않으므로,
     * 클라이언트가 명시적으로 이 메서드를 호출해야 한다.
     *
     * <ul>
     *   <li>FWK_ERROR_HIS: ErrorLogEvent 발행으로 시스템 공통 오류 이력 저장</li>
     *   <li>FWK_RPS_CODE_HIS: codeId가 있으면 해당 코드 레코드를 FAILED 처리</li>
     * </ul>
     *
     * @param codeId       렌더링 실패한 코드의 CODE_ID (없으면 null)
     * @param errorMessage 브라우저에서 전달한 오류 메시지
     * @param userId       요청자 ID
     * @param requestUri   요청 URI
     */
    public void logRenderError(String codeId, String errorMessage, String userId, String requestUri) {
        String now = LocalDateTime.now().format(FORMATTER);

        // FWK_ERROR_HIS: 시스템 공통 오류 이력 (기존 유지)
        eventPublisher.publishEvent(new ErrorLogEvent(
                TraceIdUtil.get(),
                "RENDER_ERROR",
                errorMessage,
                null, // 클라이언트 오류이므로 서버 스택 트레이스 없음
                userId,
                requestUri,
                "POST",
                null,
                now,
                LogLevel.WARN)); // 렌더링 실패는 서버 장애가 아니므로 WARN

        // FWK_RPS_CODE_HIS: 해당 코드 레코드를 FAILED로 업데이트
        if (codeId != null && !codeId.isBlank()) {
            log.warn("렌더링 오류로 코드 실패 처리 — codeId: {}, error: {}", codeId, errorMessage);
            reactGenerateMapper.updateToFailed(codeId, errorMessage);
        }
    }

    /** CODE_ID로 이력을 조회하고, 없으면 NotFoundException을 던진다. */
    private void requireExists(String id) {
        if (reactGenerateMapper.selectById(id) == null) {
            throw new NotFoundException("생성 결과를 찾을 수 없습니다. codeId=" + id);
        }
    }
}
