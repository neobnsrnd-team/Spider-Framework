package com.example.admin_demo.domain.reactgenerate.service;

import com.example.admin_demo.domain.reactgenerate.ai.ClaudeApiClient;
import com.example.admin_demo.domain.reactgenerate.ai.prompt.PromptBuilder;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.enums.ReactGenerateStatus;
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

        // 1. system / user prompt 조립
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(request.getFigmaUrl(), request.getRequirements());

        // 2. Claude API 호출하여 React 코드 생성
        String reactCode = claudeApiClient.generate(systemPrompt, userPrompt);

        // 3. 코드 기반 preview HTML 생성
        String previewHtml = buildPreviewHtml(reactCode, request.getFigmaUrl());

        // 4. DB 저장 (초기 상태: GENERATED)
        String id = UUID.randomUUID().toString();
        String now = LocalDateTime.now().format(FORMATTER);

        reactGenerateMapper.insert(
                id,
                request.getFigmaUrl(),
                request.getRequirements(),
                systemPrompt,
                userPrompt,
                reactCode,
                previewHtml,
                createdBy,
                now);

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
