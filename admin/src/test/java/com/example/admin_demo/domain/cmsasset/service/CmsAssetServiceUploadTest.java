package com.example.admin_demo.domain.cmsasset.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.BDDMockito.willThrow;
import static org.mockito.Mockito.never;

import com.example.admin_demo.domain.cmsasset.client.CmsBuilderClient;
import com.example.admin_demo.domain.cmsasset.client.dto.CmsBuilderUploadApiResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetUploadResponse;
import com.example.admin_demo.domain.cmsasset.mapper.CmsAssetMapper;
import com.example.admin_demo.domain.cmsasset.validator.AssetUploadValidator;
import com.example.admin_demo.global.exception.InvalidInputException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

@ExtendWith(MockitoExtension.class)
@DisplayName("CmsAssetService.uploadAsset 테스트 (#65)")
class CmsAssetServiceUploadTest {

    @Mock
    private CmsAssetMapper cmsAssetMapper;

    @Mock
    private CmsBuilderClient cmsBuilderClient;

    @Mock
    private AssetUploadValidator assetUploadValidator;

    @InjectMocks
    private CmsAssetService cmsAssetService;

    private static final String USER_ID = "cmsUser01";
    private static final String USER_NAME = "CMS 현업01";

    @Test
    @DisplayName("[업로드] 정상 흐름 — validator → CMS 호출 → CmsAssetUploadResponse 반환")
    void uploadAsset_happyPath_returnsResponse() {
        MockMultipartFile file = new MockMultipartFile("file", "a.png", "image/png", new byte[] {1, 2, 3});
        given(cmsBuilderClient.upload(eq(file), eq(USER_ID), eq(USER_NAME), eq("카테고리A"), eq("설명")))
                .willReturn(buildCmsResponse("uuid-1", "/static/a.png"));

        CmsAssetUploadResponse result = cmsAssetService.uploadAsset(file, "카테고리A", "설명", USER_ID, USER_NAME);

        assertThat(result.getAssetId()).isEqualTo("uuid-1");
        assertThat(result.getUrl()).isEqualTo("/static/a.png");
        then(assetUploadValidator).should().validate(file);
        then(cmsBuilderClient).should().upload(file, USER_ID, USER_NAME, "카테고리A", "설명");
    }

    @Test
    @DisplayName("[업로드] Validator 가 실패하면 CMS 호출하지 않고 예외 전파")
    void uploadAsset_validatorFails_noCmsCall() {
        MockMultipartFile file = new MockMultipartFile("file", "a.exe", "application/x-msdownload", new byte[] {1});
        willThrow(new InvalidInputException("허용하지 않는 형식"))
                .given(assetUploadValidator)
                .validate(any(MultipartFile.class));

        assertThatThrownBy(() -> cmsAssetService.uploadAsset(file, null, null, USER_ID, USER_NAME))
                .isInstanceOf(InvalidInputException.class);
        then(cmsBuilderClient).should(never()).upload(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("[업로드] 빈/공백 메타데이터는 null 로 유지된 채 CMS 호출에 그대로 전달")
    void uploadAsset_blankMetadata_passedAsIs() {
        MockMultipartFile file = new MockMultipartFile("file", "a.png", "image/png", new byte[] {1});
        given(cmsBuilderClient.upload(any(), any(), any(), any(), any()))
                .willReturn(buildCmsResponse("uuid-2", "/static/b.png"));

        cmsAssetService.uploadAsset(file, "   ", "", USER_ID, USER_NAME);

        // Controller 가 @RequestParam 으로 받은 원시값을 그대로 전달하므로 Service 는 정규화하지 않는다.
        then(cmsBuilderClient).should().upload(file, USER_ID, USER_NAME, "   ", "");
    }

    private CmsBuilderUploadApiResponse buildCmsResponse(String assetId, String url) {
        CmsBuilderUploadApiResponse r = new CmsBuilderUploadApiResponse();
        r.setAssetId(assetId);
        r.setUrl(url);
        return r;
    }
}
