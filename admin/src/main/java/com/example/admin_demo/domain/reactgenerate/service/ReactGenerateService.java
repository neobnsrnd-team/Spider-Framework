package com.example.admin_demo.domain.reactgenerate.service;

import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.enums.ReactGenerateStatus;
import com.example.admin_demo.global.exception.NotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReactGenerateService {

    // TODO: DB 테이블 생성 후 Mapper로 교체
    private final Map<String, ReactGenerateResponse> store = new ConcurrentHashMap<>();

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ReactGenerateResponse generate(ReactGenerateRequest request) {
        log.info("React 코드 생성 요청 - figmaUrl: {}", request.getFigmaUrl());

        String id = UUID.randomUUID().toString();
        String now = LocalDateTime.now().format(FORMATTER);

        // TODO: Figma API 연동 및 Claude API를 통한 실제 코드 생성 구현
        String reactCode = buildPlaceholderCode(request.getFigmaUrl());
        String previewHtml = buildPreviewHtml(request.getFigmaUrl());

        ReactGenerateResponse response = ReactGenerateResponse.builder()
                .id(id)
                .figmaUrl(request.getFigmaUrl())
                .reactCode(reactCode)
                .previewHtml(previewHtml)
                .status(ReactGenerateStatus.GENERATED.name())
                .createdAt(now)
                .build();

        store.put(id, response);
        return response;
    }

    public ReactGenerateApprovalResponse requestApproval(String id) {
        ReactGenerateResponse item = findById(id);
        item.setStatus(ReactGenerateStatus.PENDING_APPROVAL.name());
        store.put(id, item);

        log.info("승인 요청 - id: {}", id);
        return ReactGenerateApprovalResponse.builder()
                .id(id)
                .status(ReactGenerateStatus.PENDING_APPROVAL.name())
                .build();
    }

    public ReactGenerateApprovalResponse approve(String id, String approvedBy) {
        ReactGenerateResponse item = findById(id);
        item.setStatus(ReactGenerateStatus.APPROVED.name());
        store.put(id, item);

        String now = LocalDateTime.now().format(FORMATTER);
        log.info("승인 완료 - id: {}, approvedBy: {}", id, approvedBy);

        return ReactGenerateApprovalResponse.builder()
                .id(id)
                .status(ReactGenerateStatus.APPROVED.name())
                .approvedBy(approvedBy)
                .approvedAt(now)
                .build();
    }

    private ReactGenerateResponse findById(String id) {
        ReactGenerateResponse item = store.get(id);
        if (item == null) {
            throw new NotFoundException("생성 결과를 찾을 수 없습니다. id=" + id);
        }
        return item;
    }

    private String buildPlaceholderCode(String figmaUrl) {
        return """
                import React from 'react';

                // TODO: Figma URL에서 생성된 컴포넌트
                // Source: %s
                const GeneratedComponent = () => {
                  return (
                    <div className="generated-component">
                      <h2>Generated Component</h2>
                      <p>Figma 디자인 기반으로 생성된 컴포넌트입니다.</p>
                    </div>
                  );
                };

                export default GeneratedComponent;
                """
                .formatted(figmaUrl);
    }

    private String buildPreviewHtml(String figmaUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { font-family: sans-serif; padding: 20px; }
                    .generated-component { border: 1px dashed #ccc; padding: 20px; border-radius: 8px; }
                  </style>
                </head>
                <body>
                  <div class="generated-component">
                    <h2>Generated Component</h2>
                    <p>Figma 디자인 기반으로 생성된 컴포넌트입니다.</p>
                    <small style="color:#999">Source: %s</small>
                  </div>
                </body>
                </html>
                """
                .formatted(figmaUrl);
    }
}
