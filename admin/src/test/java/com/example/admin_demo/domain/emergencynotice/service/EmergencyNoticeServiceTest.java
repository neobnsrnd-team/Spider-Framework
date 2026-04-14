package com.example.admin_demo.domain.emergencynotice.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;

import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeBulkSaveRequest;
import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeResponse;
import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeSaveRequest;
import com.example.admin_demo.domain.emergencynotice.mapper.EmergencyNoticeMapper;
import com.example.admin_demo.global.exception.NotFoundException;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmergencyNoticeService 테스트")
class EmergencyNoticeServiceTest {

    @Mock
    private EmergencyNoticeMapper emergencyNoticeMapper;

    @InjectMocks
    private EmergencyNoticeService emergencyNoticeService;

    // ─── getAll ───────────────────────────────────────────────────────

    @Test
    @DisplayName("[조회] 긴급공지 목록이 존재하면 List를 반환해야 한다")
    void getAll_exists_returnsList() {
        List<EmergencyNoticeResponse> data =
                List.of(buildResponse("EMERGENCY_KO"), buildResponse("EMERGENCY_EN"));
        given(emergencyNoticeMapper.selectAll()).willReturn(data);

        List<EmergencyNoticeResponse> result = emergencyNoticeService.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getPropertyId()).isEqualTo("EMERGENCY_KO");
        assertThat(result.get(1).getPropertyId()).isEqualTo("EMERGENCY_EN");
    }

    @Test
    @DisplayName("[조회] 초기 데이터가 없으면 NotFoundException을 발생시켜야 한다")
    void getAll_empty_throwsNotFoundException() {
        given(emergencyNoticeMapper.selectAll()).willReturn(List.of());

        assertThatThrownBy(() -> emergencyNoticeService.getAll())
                .isInstanceOf(NotFoundException.class);
    }

    // ─── getDisplayType ───────────────────────────────────────────────

    @Test
    @DisplayName("[조회] 노출 타입이 존재하면 String을 반환해야 한다")
    void getDisplayType_exists_returnsString() {
        given(emergencyNoticeMapper.selectDisplayType()).willReturn("N");

        String result = emergencyNoticeService.getDisplayType();

        assertThat(result).isEqualTo("N");
    }

    @Test
    @DisplayName("[조회] 노출 타입 데이터가 없으면 NotFoundException을 발생시켜야 한다")
    void getDisplayType_null_throwsNotFoundException() {
        given(emergencyNoticeMapper.selectDisplayType()).willReturn(null);

        assertThatThrownBy(() -> emergencyNoticeService.getDisplayType())
                .isInstanceOf(NotFoundException.class);
    }

    // ─── saveAll ──────────────────────────────────────────────────────

    @Test
    @DisplayName("[저장] 유효한 요청으로 저장 시 updateNotice와 updateDisplayType이 호출되어야 한다")
    void saveAll_valid_callsUpdateMethods() {
        EmergencyNoticeBulkSaveRequest request = buildBulkSaveRequest();
        given(emergencyNoticeMapper.countByPropertyId(anyString())).willReturn(1);

        emergencyNoticeService.saveAll(request);

        then(emergencyNoticeMapper).should().updateNotice(any(), anyString(), anyString());
        then(emergencyNoticeMapper).should().updateDisplayType(eq("N"), anyString(), anyString());
    }

    @Test
    @DisplayName("[저장] 복수 공지 저장 시 언어 수만큼 updateNotice가 호출되어야 한다")
    void saveAll_multipleNotices_callsUpdateNoticeForEach() {
        EmergencyNoticeBulkSaveRequest request = EmergencyNoticeBulkSaveRequest.builder()
                .notices(List.of(
                        buildSaveRequest("EMERGENCY_KO"),
                        buildSaveRequest("EMERGENCY_EN")))
                .displayType("A")
                .build();
        given(emergencyNoticeMapper.countByPropertyId(anyString())).willReturn(1);

        emergencyNoticeService.saveAll(request);

        then(emergencyNoticeMapper).should(org.mockito.Mockito.times(2))
                .updateNotice(any(), anyString(), anyString());
        then(emergencyNoticeMapper).should().updateDisplayType(eq("A"), anyString(), anyString());
    }

    @Test
    @DisplayName("[저장] 초기 데이터가 없으면 NotFoundException을 발생시켜야 한다")
    void saveAll_missingInitialData_throwsNotFoundException() {
        EmergencyNoticeBulkSaveRequest request = buildBulkSaveRequest();
        given(emergencyNoticeMapper.countByPropertyId(anyString())).willReturn(0);

        assertThatThrownBy(() -> emergencyNoticeService.saveAll(request))
                .isInstanceOf(NotFoundException.class);
    }

    // ─── 헬퍼 ─────────────────────────────────────────────────────────

    private EmergencyNoticeResponse buildResponse(String propertyId) {
        return EmergencyNoticeResponse.builder()
                .propertyId(propertyId)
                .title("긴급공지 제목")
                .content("긴급공지 내용")
                .lastUpdateDtime("20260413120000")
                .lastUpdateUserId("admin")
                .build();
    }

    private EmergencyNoticeSaveRequest buildSaveRequest(String propertyId) {
        return EmergencyNoticeSaveRequest.builder()
                .propertyId(propertyId)
                .title("긴급공지 제목")
                .content("긴급공지 내용")
                .build();
    }

    private EmergencyNoticeBulkSaveRequest buildBulkSaveRequest() {
        return EmergencyNoticeBulkSaveRequest.builder()
                .notices(List.of(buildSaveRequest("EMERGENCY_KO")))
                .displayType("N")
                .build();
    }
}
