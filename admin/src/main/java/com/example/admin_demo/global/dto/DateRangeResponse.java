package com.example.admin_demo.global.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DateRangeResponse {
    private LocalDate startDate;
    private LocalDate endDate;
}
