package com.example.admin_demo.global.page.controller;

import com.example.admin_demo.domain.board.dto.BoardResponse;
import com.example.admin_demo.domain.board.service.BoardService;
import com.example.admin_demo.global.security.CustomUserDetails;
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
import org.springframework.web.bind.annotation.PathVariable;

@Slf4j
@Controller
@RequiredArgsConstructor
public class PageController {

    private static final String TAB_REQUEST_HEADER = "X-Tab-Request";
    private static final String TAB_REQUEST_VALUE = "true";

    @Value("${app.title:Neo Spider Admin}")
    private String appTitle;

    @Value("${demo.frontend.url:http://localhost:5173}")
    private String demoFrontendUrl;

    private final BoardService boardService;

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

    // ── Special pages ──

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/.well-known/**")
    public String wellKnownRedirect() {
        return "redirect:/home";
    }

    @GetMapping("/home")
    public String home() {
        return "home";
    }

    @GetMapping("/debug")
    public String debug() {
        return "debug";
    }

    // ── 인증 ── my_info_manage

    @GetMapping("/users/profile")
    public String usersProfile(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/my-info-manage/my-info-manage :: content", model);
    }

    // ── 시스템 관리 ── user_manage, menu_manage, role_manage, neb_code_group_manage, code_manage

    @GetMapping("/users")
    public String users(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/user-manage/user-manage :: content", model);
    }

    @GetMapping("/menus")
    public String menus(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/menu-manage/menu-manage :: content", model);
    }

    @GetMapping("/roles")
    public String roles(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/role-manage/role-manage :: content", model);
    }

    @GetMapping("/code-groups")
    public String codeGroups(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/neb-code-group-manage/neb-code-group-manage :: content", model);
    }

    @GetMapping("/codes")
    public String codes(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/code-manage/code-manage :: content", model);
    }

    // ── 인프라 관리 ── system_oper_manage, property_db_manage, xml_property_manage, was_group_manage, was_instance,
    // emergency_notice_manage, emergency_notice_deploy_manage

    @GetMapping("/emergency-notices")
    public String emergencyNotices(HttpServletRequest request, Model model) {
        // iframe 미리보기 URL 주입 — Demo Frontend 미리보기 경로로 사용
        model.addAttribute("demoFrontendUrl", demoFrontendUrl);
        return resolveView(request, "pages/emergency-notice-manage/emergency-notice-manage :: content", model);
    }

    @GetMapping("/emergency-notice-deploys")
    public String emergencyNoticeDeploys(HttpServletRequest request, Model model) {
        return resolveView(
                request, "pages/emergency-notice-deploy-manage/emergency-notice-deploy-manage :: content", model);
    }

    @GetMapping("/reload")
    public String reload(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/system-oper-manage/system-oper-manage :: content", model);
    }

    @GetMapping("/properties")
    public String properties(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/property-db-manage/property-db-manage :: content", model);
    }

    @GetMapping("/xml-properties")
    public String xmlProperties(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/xml-property-manage/xml-property-manage :: content", model);
    }

    @GetMapping("/was-groups")
    public String wasGroups(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/was-group-manage/was-group-manage :: content", model);
    }

    @GetMapping("/was-instances")
    public String wasInstances(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/was-instance/was-instance :: content", model);
    }

    // ── 연계 관리 ── connect_org_manage, gw_manage, org_trans_manage, msg_handle_manage,
    //                  listener_connector_manage, app_mapping_manage, code_mapping_manage

    @GetMapping("/orgs")
    public String orgs(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/connect-org-manage/connect-org-manage :: content", model);
    }

    @GetMapping("/gateways")
    public String gateways(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/gw-manage/gw-manage :: content", model);
    }

    @GetMapping("/gw-systems")
    public String gwSystems(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/org-trans-manage/org-trans-manage :: content", model);
    }

    @GetMapping("/message-handlers")
    public String messageHandlers(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/msg-handle-manage/msg-handle-manage :: content", model);
    }

    @GetMapping("/listener-trxs")
    public String listenerTrxs(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/listener-connector-manage/listener-connector-manage :: content", model);
    }

    @GetMapping("/transports")
    public String transports(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/app-mapping-manage/app-mapping-manage :: content", model);
    }

    @GetMapping("/codes/org-codes")
    public String orgCodes(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/code-mapping-manage/code-mapping-manage :: content", model);
    }

    // ── 거래/전문 관리 ── msg_trx_manage, message_manage, trx_validator, trx, req_message_test,
    //                       proxy_testdata, db_log

    @GetMapping("/transactions")
    public String transactions(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/msg-trx-manage/msg-trx-manage :: content", model);
    }

    @GetMapping("/messages")
    public String messages(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/message-manage/message-manage :: content", model);
    }

    @GetMapping("/validators")
    public String validators(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trx-validator/trx-validator :: content", model);
    }

    @GetMapping("/transactions/trx-stop")
    public String trxStop(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trx/trx :: content", model);
    }

    @GetMapping("/message-tests")
    public String messageTests(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/req-message-test/req-message-test :: content", model);
    }

    @GetMapping("/proxy-responses")
    public String proxyResponses(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/proxy-testdata/proxy-testdata :: content", model);
    }

    @GetMapping("/message-instances")
    public String messageInstances(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/db-log/db-log :: content", model);
    }

    // ── 배치 관리 ── batch_app_manage, batch_his_list

    @GetMapping("/batches/apps")
    public String batchApps(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/batch-app-manage/batch-app-manage :: content", model);
    }

    @GetMapping("/batches/history")
    public String batchHistory(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/batch-his-list/batch-his-list :: content", model);
    }

    // ── 오류 관리 ── error_cause_his, error_code

    @GetMapping("/error-histories")
    public String errorHistories(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/error-cause-his/error-cause-his :: content", model);
    }

    @GetMapping("/error-codes")
    public String errorCodes(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/error-code/error-code :: content", model);
    }

    // ── 모니터링 ── system_biz_reg, was_status, was_status_monitor

    @GetMapping("/monitors")
    public String monitors(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/system-biz-reg/system-biz-reg :: content", model);
    }

    @GetMapping("/was-gateway-statuses")
    public String wasGatewayStatuses(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/was-status/was-status :: content", model);
    }

    @GetMapping("/was-status-monitors")
    public String wasStatusMonitors(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/was-status-monitor/was-status-monitor :: content", model);
    }

    // ── 이력/감사 ── access_user_id, user_page_log, trx_stop_his

    @GetMapping("/stop-transaction-accessors")
    public String stopTransactionAccessors(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/access-user-id/access-user-id :: content", model);
    }

    @GetMapping("/admin-histories")
    public String adminHistories(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/user-page-log/user-page-log :: content", model);
    }

    @GetMapping("/admin-histories/trx-stop-history")
    public String trxStopHistory(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trx-stop-his/trx-stop-his :: content", model);
    }

    // ── 게시판 ── board_manage, BOARD_AUTH, board-content (articles 공유 템플릿)

    @GetMapping("/boards")
    public String boards(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/board-manage/board-manage :: content", model);
    }

    @GetMapping("/boards/auth")
    public String boardAuth(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/board-auth/board-auth :: content", model);
    }

    @GetMapping("/articles/{boardId}")
    public String articles(@PathVariable String boardId, HttpServletRequest request, Model model) {
        BoardResponse board = boardService.getBoardById(boardId);
        model.addAttribute("boardId", boardId);
        model.addAttribute("pageTitle", board.getBoardName());
        model.addAttribute("pageIcon", "fa-clipboard-list");
        return resolveView(request, "pages/board-content/board-content :: boardContent", model);
    }

    // ── 이행 데이터 ── trans_data_popup, trans_data_exec, trans_data_list

    @GetMapping("/trans-data/generation")
    public String transDataGeneration(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trans-data-popup/trans-data-popup :: content", model);
    }

    @GetMapping("/trans-data")
    public String transData(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trans-data-exec/trans-data-exec :: content", model);
    }

    @GetMapping("/trans-data/files")
    public String transDataFiles(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/trans-data-list/trans-data-list :: content", model);
    }

    // ── 개발 관리 ── message_parsing_test, message_parsing_json

    @GetMapping("/message-parsing")
    public String messageParsing(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/message-parsing-test/message-parsing-test :: content", model);
    }

    @GetMapping("/message-parsing/json")
    public String messageParsingJson(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/message-parsing-json/message-parsing-json :: content", model);
    }

    // ── React 플랫폼 ── react_generate

    @GetMapping("/react-generate")
    public String reactGenerate(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/react-generate/react-generate :: content", model);
    }

    // ── 서비스 관리 ── v3_neb_service_base_info, v3_neb_biz_component, v3_validator_component,
    //                    v3_biz_app, v3_sql_query_manage, v3_sql_dataSource_manage

    @GetMapping("/fwk-services")
    public String fwkServices(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/service-manage/service-manage :: content", model);
    }

    @GetMapping("/components")
    public String components(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/component-manage/component-manage :: content", model);
    }

    @GetMapping("/validation")
    public String validation(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/validation-manage/validation-manage :: content", model);
    }

    @GetMapping("/biz-apps")
    public String bizApps(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/bizapp-manage/bizapp-manage :: content", model);
    }

    @GetMapping("/sql-queries")
    public String sqlQueries(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/sqlquery-manage/sqlquery-manage :: content", model);
    }

    @GetMapping("/datasources")
    public String datasources(HttpServletRequest request, Model model) {
        return resolveView(request, "pages/datasource-manage/datasource-manage :: content", model);
    }
}
