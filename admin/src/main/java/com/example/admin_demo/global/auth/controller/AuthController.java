package com.example.admin_demo.global.auth.controller;

import com.example.admin_demo.domain.user.dto.UserCreateRequest;
import com.example.admin_demo.domain.user.dto.UserResponse;
import com.example.admin_demo.domain.user.service.UserService;
import com.example.admin_demo.global.auth.dto.LoginRequest;
import com.example.admin_demo.global.auth.dto.LoginResponse;
import com.example.admin_demo.global.auth.service.AuthService;
import com.example.admin_demo.global.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody UserCreateRequest userCreateRequestDTO) {
        UserResponse createdUser = userService.createUser(userCreateRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("회원가입이 완료되었습니다", createdUser));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("로그인 성공", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // TODO: Spring Security 세션 무효화 처리
        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공", null));
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Boolean>> validateCredentials(@Valid @RequestBody LoginRequest loginRequest) {
        boolean isValid = authService.validateCredentials(loginRequest.getUserId(), loginRequest.getPassword());
        return ResponseEntity.ok(ApiResponse.success(isValid));
    }

    @GetMapping("/permission/menu")
    public ResponseEntity<ApiResponse<Boolean>> checkMenuPermission(
            @RequestParam String userId, @RequestParam String menuId) {
        boolean hasPermission = authService.hasMenuPermission(userId, menuId);
        return ResponseEntity.ok(ApiResponse.success(hasPermission));
    }
}
