package com.example.admin_demo.domain.board.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCategoryResponse {
    private String boardId;
    private String categorySeq;
    private String categoryName;
}
