package com.example.admin_demo.domain.article.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleUserResponse {
    private String userId;
    private String boardId;
    private Long articleSeq;
    private String lastUpdateDtime;
}
