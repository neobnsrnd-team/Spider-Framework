package com.example.reactplatform.global.page.controller;

import com.example.reactplatform.global.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * @file PageController.java
 * @description Thymeleaf 페이지 라우팅 컨트롤러.
 *     탭 요청(X-Tab-Request: true) 시 fragment만 반환하고, 일반 요청 시 home 레이아웃을 반환한다.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class PageController {

    private static final String TAB_REQUEST_HEADER = "X-Tab-Request";
    private static final String TAB_REQUEST_VALUE = "true";

    @Value("${app.title:React Gen}")
    private String appTitle;

    @ModelAttribute
    public void addCommonAttributes(@AuthenticationPrincipal CustomUserDetails userDetails, Model model) {
        model.addAttribute("appTitle", appTitle);
        if (userDetails == null) {
            return;
        }
        model.addAttribute("userName", userDetails.getDisplayName());
        model.addAttribute("currentUserId", userDetails.getUserId());
        model.addAttribute("currentUserRoleId", userDetails.getRoleId());
        Set<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        model.addAttribute("userAuthorities", authorities);
    }

    private String resolveView(HttpServletRequest request, String fragment, Model model) {
        if (TAB_REQUEST_VALUE.equals(request.getHeader(TAB_REQUEST_HEADER))) {
            return fragment;
        }
        model.addAttribute("initialPage", request.getRequestURI());
        return "home";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    // ── 내 정보 ──

    @GetMapping("/users/profile")
    public String usersProfile(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/my-info-manage/my-info-manage :: content", model);
    }

    // ── 시스템 관리 ──

    @GetMapping("/users")
    public String users(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/user-manage/user-manage :: content", model);
    }

    @GetMapping("/roles")
    public String roles(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/role-manage/role-manage :: content", model);
    }

    @GetMapping("/menus")
    public String menus(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/menu-manage/menu-manage :: content", model);
    }

    // ── React 코드 생성 / 결재 ──

    @GetMapping("/react-generate")
    public String reactGenerate(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/react-generate/react-generate :: content", model);
    }

    @GetMapping("/react-generate-his")
    public String reactGenerateHis(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/react-generate-his/react-generate-his :: content", model);
    }

    @GetMapping("/react-approval")
    public String reactApproval(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/react-approval/react-approval :: content", model);
    }
}
