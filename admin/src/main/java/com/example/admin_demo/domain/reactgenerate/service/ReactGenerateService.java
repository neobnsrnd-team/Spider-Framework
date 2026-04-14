package com.example.admin_demo.domain.reactgenerate.service;

import com.example.admin_demo.domain.reactgenerate.ai.ClaudeApiClient;
import com.example.admin_demo.domain.reactgenerate.ai.prompt.PromptBuilder;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.enums.ReactGenerateStatus;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaApiClient;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaDesignContext;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaDesignExtractor;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaNodeResponse;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaUrlParser;
import com.example.admin_demo.domain.reactgenerate.mapper.ReactGenerateMapper;
import com.example.admin_demo.global.exception.NotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(designContext, request.getRequirements());

        // 5. Claude API 호출하여 React 코드 생성
        // TODO : 현재 Claude API 는 코드만 구현한 상태 (Claude API 확정 후, 위의 주석 제거 후 테스트 필요)
//        String reactCode = claudeApiClient.generate(systemPrompt, userPrompt);
        String reactCode = """
                import React from "react";
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
                import type { LoginPageProps } from "./types";
                
                export type { LoginPageProps } from "./types";
                
                export function LoginPage({
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

                // 6. 코드 기반 preview HTML 생성
        String previewHtml = buildPreviewHtml(reactCode, request.getFigmaUrl());

        // 7. DB 저장 (초기 상태: GENERATED)
        String id = UUID.randomUUID().toString();
        String now = LocalDateTime.now().format(FORMATTER);

        // TODO : 현재 DB 설계 확정 전이므로, 수정 필요
//        reactGenerateMapper.insert(
//                id,
//                request.getFigmaUrl(),
//                request.getRequirements(),
//                systemPrompt,
//                userPrompt,
//                reactCode,
//                previewHtml,
//                createdBy,
//                now);

        log.info("React 코드 생성 완료 — id: {}", id);

        return ReactGenerateResponse.builder()
                .id(id)
                .figmaUrl(request.getFigmaUrl())
                .reactCode(reactCode)
                .previewHtml(previewHtml)
                .status(ReactGenerateStatus.GENERATED.name())
                .createdAt(now)
                .build();
    }

    /**
     * 생성된 코드를 관리자 승인 요청 상태로 변경한다.
     */
    public ReactGenerateApprovalResponse requestApproval(String id) {
        requireExists(id);

        reactGenerateMapper.updateStatus(id, ReactGenerateStatus.PENDING_APPROVAL.name(), null, null);
        log.info("승인 요청 — id: {}", id);

        return ReactGenerateApprovalResponse.builder()
                .id(id)
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
        log.info("승인 완료 — id: {}, approvedBy: {}", id, approvedBy);

        return ReactGenerateApprovalResponse.builder()
                .id(id)
                .status(ReactGenerateStatus.APPROVED.name())
                .approvedBy(approvedBy)
                .approvedAt(now)
                .build();
    }

    /** ID로 이력을 조회하고, 없으면 NotFoundException을 던진다. */
    private void requireExists(String id) {
        if (reactGenerateMapper.selectById(id) == null) {
            throw new NotFoundException("생성 결과를 찾을 수 없습니다. id=" + id);
        }
    }

    /**
     * 생성된 React 코드를 iframe에서 미리볼 수 있는 HTML을 생성한다.
     * React 코드는 직접 실행이 불가하므로 코드를 code 태그로 감싸 표시한다.
     */
    private String buildPreviewHtml(String reactCode, String figmaUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: monospace; padding: 16px; background: #1e1e1e; color: #d4d4d4; }
                    pre { white-space: pre-wrap; word-break: break-all; font-size: 13px; }
                    .source { font-size: 11px; color: #666; margin-bottom: 8px; }
                  </style>
                </head>
                <body>
                  <div class="source">Source: %s</div>
                  <pre>%s</pre>
                </body>
                </html>
                """
                .formatted(figmaUrl, reactCode.replace("<", "&lt;").replace(">", "&gt;"));
    }
}
