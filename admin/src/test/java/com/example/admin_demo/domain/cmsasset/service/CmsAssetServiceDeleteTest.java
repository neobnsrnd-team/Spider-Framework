package com.example.admin_demo.domain.cmsasset.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.never;

import com.example.admin_demo.domain.cmsasset.client.CmsBuilderClient;
import com.example.admin_demo.domain.cmsasset.mapper.CmsAssetMapper;
import com.example.admin_demo.domain.cmsasset.validator.AssetUploadValidator;
import com.example.admin_demo.global.exception.InvalidStateException;
import com.example.admin_demo.global.exception.NotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * CmsAssetService.deleteMyAsset 단위 테스트 — Issue #88.
 *
 * <p>상태 가드(WORK/REJECTED 만 허용) 와 NotFound 분기, CMS 위임 호출 여부를 검증한다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("CmsAssetService.deleteMyAsset 테스트 (#88)")
class CmsAssetServiceDeleteTest {

    @Mock
    private CmsAssetMapper cmsAssetMapper;

    @Mock
    private CmsBuilderClient cmsBuilderClient;

    @Mock
    private AssetUploadValidator assetUploadValidator;

    @InjectMocks
    private CmsAssetService cmsAssetService;

    private static final String ASSET_ID = "uuid-del-1";
    private static final String USER_ID = "cmsUser01";

    @Test
    @DisplayName("[삭제] WORK 상태이면 CMS 삭제 호출 후 정상 반환")
    void delete_work_invokesCmsDelete() {
        given(cmsAssetMapper.findAssetStateById(ASSET_ID)).willReturn("WORK");

        cmsAssetService.deleteMyAsset(ASSET_ID, USER_ID);

        then(cmsBuilderClient).should().delete(ASSET_ID, USER_ID);
    }

    @Test
    @DisplayName("[삭제] REJECTED 상태이면 CMS 삭제 호출 후 정상 반환")
    void delete_rejected_invokesCmsDelete() {
        given(cmsAssetMapper.findAssetStateById(ASSET_ID)).willReturn("REJECTED");

        cmsAssetService.deleteMyAsset(ASSET_ID, USER_ID);

        then(cmsBuilderClient).should().delete(ASSET_ID, USER_ID);
    }

    @Test
    @DisplayName("[삭제] PENDING 상태이면 InvalidStateException, CMS 호출하지 않음")
    void delete_pending_throwsInvalidState() {
        given(cmsAssetMapper.findAssetStateById(ASSET_ID)).willReturn("PENDING");

        assertThatThrownBy(() -> cmsAssetService.deleteMyAsset(ASSET_ID, USER_ID))
                .isInstanceOf(InvalidStateException.class);
        then(cmsBuilderClient).should(never()).delete(any(), any());
    }

    @Test
    @DisplayName("[삭제] APPROVED 상태이면 InvalidStateException, CMS 호출하지 않음")
    void delete_approved_throwsInvalidState() {
        given(cmsAssetMapper.findAssetStateById(ASSET_ID)).willReturn("APPROVED");

        assertThatThrownBy(() -> cmsAssetService.deleteMyAsset(ASSET_ID, USER_ID))
                .isInstanceOf(InvalidStateException.class);
        then(cmsBuilderClient).should(never()).delete(any(), any());
    }

    @Test
    @DisplayName("[삭제] 존재하지 않는 assetId 이면 NotFoundException, CMS 호출하지 않음")
    void delete_notFound_throwsNotFound() {
        given(cmsAssetMapper.findAssetStateById(ASSET_ID)).willReturn(null);

        assertThatThrownBy(() -> cmsAssetService.deleteMyAsset(ASSET_ID, USER_ID))
                .isInstanceOf(NotFoundException.class);
        then(cmsBuilderClient).should(never()).delete(any(), any());
    }
}
