package com.example.admin_demo.global.security.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuPermission {

    private String menuId;
    private String authCode;
}
