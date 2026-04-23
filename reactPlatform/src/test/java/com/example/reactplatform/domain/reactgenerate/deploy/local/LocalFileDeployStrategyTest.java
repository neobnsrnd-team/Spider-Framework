/**
 * @file LocalFileDeployStrategyTest.java
 * @description LocalFileDeployStrategy 단위 테스트.
 *     @TempDir로 실제 파일 I/O를 검증하고, 설정 누락·예외 발생 시 비치명적으로 처리되는지 확인한다.
 * @see LocalFileDeployStrategy
 */
package com.example.reactplatform.domain.reactgenerate.deploy.local;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.reactplatform.domain.reactgenerate.deploy.ContainerScaffoldGenerator;
import com.example.reactplatform.domain.reactgenerate.deploy.ReactDeployProperties;
import java.nio.file.Path;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class LocalFileDeployStrategyTest {

    @TempDir
    Path tempDir;

    @Mock
    private ContainerScaffoldGenerator scaffoldGenerator;

    private static final String REACT_CODE =
            "export default function LoginPage() { return <div/>; }";
    private static final String SCAFFOLD_CODE = "// scaffold content";
    private static final String SCAFFOLD_FILE = "LoginPageContainer.tsx";
    private static final String COMPONENT_NAME = "LoginPage";

    // ========== 정상 배포 ==========

    @Test
    @DisplayName("정상 배포 시 UI 컴포넌트({ComponentName}.tsx)와 Container scaffold 파일이 생성된다")
    void deploy_success_writesBothFiles() throws Exception {
        Path compDir = tempDir.resolve("generated");
        Path contDir = tempDir.resolve("containers");
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        when(scaffoldGenerator.generate(anyString(), anyString())).thenReturn(SCAFFOLD_CODE);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn(SCAFFOLD_FILE);

        strategy(compDir.toString(), contDir.toString()).deploy("code-01", REACT_CODE);

        assertThat(compDir.resolve("LoginPage.tsx")).exists().hasContent(REACT_CODE);
        assertThat(contDir.resolve(SCAFFOLD_FILE)).exists().hasContent(SCAFFOLD_CODE);
    }

    @Test
    @DisplayName("존재하지 않는 중첩 디렉토리도 자동으로 생성된다")
    void deploy_deepDirectoryAutoCreated() throws Exception {
        Path compDir = tempDir.resolve("deep/nested/generated");
        Path contDir = tempDir.resolve("deep/nested/containers");
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        when(scaffoldGenerator.generate(anyString(), anyString())).thenReturn(SCAFFOLD_CODE);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn(SCAFFOLD_FILE);

        strategy(compDir.toString(), contDir.toString()).deploy("code-01", REACT_CODE);

        assertThat(compDir.resolve("LoginPage.tsx")).exists();
        assertThat(contDir.resolve(SCAFFOLD_FILE)).exists();
    }

    @Test
    @DisplayName("UI 컴포넌트 파일명은 {ComponentName}.tsx 형식이다")
    void deploy_componentFileName_isComponentNameDotTsx() throws Exception {
        Path compDir = tempDir.resolve("generated");
        Path contDir = tempDir.resolve("containers");
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn("TransferForm");
        when(scaffoldGenerator.generate(anyString(), anyString())).thenReturn(SCAFFOLD_CODE);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn("TransferFormContainer.tsx");

        strategy(compDir.toString(), contDir.toString()).deploy("code-99", REACT_CODE);

        assertThat(compDir.resolve("TransferForm.tsx")).exists();
    }

    // ========== import prefix 계산 ==========

    @Test
    @DisplayName("Container → Component 상대 경로(import prefix)가 올바르게 계산되어 scaffoldGenerator에 전달된다")
    void deploy_importPrefix_relativePathPassedToGenerator() throws Exception {
        // containers → generated : ../generated
        Path compDir = tempDir.resolve("generated");
        Path contDir = tempDir.resolve("containers");
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn(SCAFFOLD_FILE);

        ArgumentCaptor<String> prefixCaptor = ArgumentCaptor.forClass(String.class);
        when(scaffoldGenerator.generate(anyString(), prefixCaptor.capture()))
                .thenReturn(SCAFFOLD_CODE);

        strategy(compDir.toString(), contDir.toString()).deploy("code-01", REACT_CODE);

        // 상대 경로에 "generated" 디렉토리명이 포함되어야 한다
        assertThat(prefixCaptor.getValue()).contains("generated");
    }

    // ========== 빈 코드 처리 ==========

    @Test
    @DisplayName("React 코드가 빈 문자열이면 파일을 생성하지 않고 조용히 종료한다")
    void deploy_emptyCode_skipsFileCreation() {
        assertThatNoException().isThrownBy(() ->
                strategy(tempDir.toString(), tempDir.toString()).deploy("code-01", ""));

        assertThat(tempDir.toFile().listFiles()).isEmpty();
    }

    @Test
    @DisplayName("React 코드가 null이면 파일을 생성하지 않고 조용히 종료한다")
    void deploy_nullCode_skipsFileCreation() {
        assertThatNoException().isThrownBy(() ->
                strategy(tempDir.toString(), tempDir.toString()).deploy("code-01", null));
    }

    // ========== 설정 누락 처리 (비치명적) ==========

    @Test
    @DisplayName("component-dir이 null이어도 예외를 던지지 않는다")
    void deploy_nullComponentDir_nonFatal() {
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        when(scaffoldGenerator.generate(anyString(), anyString())).thenReturn(SCAFFOLD_CODE);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn(SCAFFOLD_FILE);

        assertThatNoException().isThrownBy(() ->
                strategy(null, tempDir.toString()).deploy("code-01", REACT_CODE));
    }

    @Test
    @DisplayName("container-dir이 null이어도 예외를 던지지 않고 UI 컴포넌트는 정상 생성된다")
    void deploy_nullContainerDir_writesComponentOnly() throws Exception {
        Path compDir = tempDir.resolve("generated");
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        // containerDir=null → generate/resolveFileName 미호출

        strategy(compDir.toString(), null).deploy("code-01", REACT_CODE);

        assertThat(compDir.resolve("LoginPage.tsx")).exists();
        assertThat(tempDir.resolve(SCAFFOLD_FILE)).doesNotExist();
    }

    @Test
    @DisplayName("component-dir이 빈 문자열이어도 예외를 던지지 않는다")
    void deploy_blankComponentDir_nonFatal() {
        when(scaffoldGenerator.extractComponentName(anyString())).thenReturn(COMPONENT_NAME);
        when(scaffoldGenerator.generate(anyString(), anyString())).thenReturn(SCAFFOLD_CODE);
        when(scaffoldGenerator.resolveFileName(anyString())).thenReturn(SCAFFOLD_FILE);

        assertThatNoException().isThrownBy(() ->
                strategy("", tempDir.toString()).deploy("code-01", REACT_CODE));
    }

    // ========== helpers ==========

    /** 지정된 component-dir, container-dir으로 전략 인스턴스를 생성한다. */
    private LocalFileDeployStrategy strategy(String componentDir, String containerDir) {
        ReactDeployProperties props = new ReactDeployProperties();
        ReactDeployProperties.Local local = new ReactDeployProperties.Local();
        local.setComponentDir(componentDir);
        local.setContainerDir(containerDir);
        props.setLocal(local);
        return new LocalFileDeployStrategy(props, scaffoldGenerator);
    }
}
