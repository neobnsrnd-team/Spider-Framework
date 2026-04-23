/**
 * @file LocalFileDeployStrategy.java
 * @description {@code react.deploy.mode: local} 일 때 사용하는 배포 전략.
 *     승인된 React UI 컴포넌트와 Container scaffold를 서버 로컬 파일시스템에 기록한다.
 *
 * <p>저장 경로:
 * <ul>
 *   <li>UI 컴포넌트: {@code {local.component-dir}/{ComponentName}.tsx}</li>
 *   <li>Container scaffold: {@code {local.container-dir}/{ComponentName}Container.tsx}</li>
 * </ul>
 *
 * <p>파일 쓰기 실패는 비치명적으로 처리한다 — DB 승인은 이미 커밋되었으므로
 * 예외를 던지지 않고 로그만 남긴다.
 */
package com.example.reactplatform.domain.reactgenerate.deploy.local;

import com.example.reactplatform.domain.reactgenerate.deploy.ContainerScaffoldGenerator;
import com.example.reactplatform.domain.reactgenerate.deploy.ReactDeployProperties;
import com.example.reactplatform.domain.reactgenerate.deploy.ReactDeployStrategy;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class LocalFileDeployStrategy implements ReactDeployStrategy {

    private final ReactDeployProperties properties;
    private final ContainerScaffoldGenerator scaffoldGenerator;

    @Override
    public void deploy(String codeId, String reactCode) {
        if (reactCode == null || reactCode.isBlank()) {
            log.warn("[local] React 코드가 비어 있어 파일 생성을 건너뜁니다. codeId={}", codeId);
            return;
        }

        ReactDeployProperties.Local local = properties.getLocal();

        // 컴포넌트명을 한 번만 추출하여 UI 컴포넌트 파일명·Container import 경로에 공통 사용
        String componentName = scaffoldGenerator.extractComponentName(reactCode);
        writeComponent(codeId, componentName, reactCode, local.getComponentDir());
        writeContainerScaffold(codeId, reactCode, local.getComponentDir(), local.getContainerDir());
    }

    /** UI 컴포넌트 파일({ComponentName}.tsx)을 component-dir에 기록한다. */
    private void writeComponent(String codeId, String componentName, String reactCode, String componentDir) {
        if (isBlank(componentDir)) {
            log.error("[local] component-dir이 설정되지 않았습니다. codeId={}", codeId);
            return;
        }
        writeFile(Path.of(componentDir).resolve(componentName + ".tsx"), reactCode, "UI 컴포넌트", codeId);
    }

    /** Container scaffold 파일을 container-dir에 기록한다. */
    private void writeContainerScaffold(
            String codeId, String reactCode, String componentDir, String containerDir) {
        if (isBlank(containerDir)) {
            log.warn("[local] container-dir이 설정되지 않아 Container scaffold 생성을 건너뜁니다. codeId={}", codeId);
            return;
        }

        // Container에서 UI 컴포넌트를 import할 때 사용하는 상대 경로 계산
        // 두 디렉토리가 같은 부모를 공유한다고 가정하고 "../{componentDirName}" 형태로 설정
        String importPrefix = resolveImportPrefix(componentDir, containerDir);
        String scaffoldCode = scaffoldGenerator.generate(reactCode, importPrefix);
        String fileName = scaffoldGenerator.resolveFileName(reactCode);

        writeFile(Path.of(containerDir).resolve(fileName), scaffoldCode, "Container scaffold", codeId);
    }

    /** 파일을 생성하고 내용을 UTF-8로 기록한다. 실패 시 예외 대신 로그를 남긴다. */
    private void writeFile(Path target, String content, String label, String codeId) {
        try {
            Files.createDirectories(target.getParent());
            Files.writeString(target, content, StandardCharsets.UTF_8);
            log.info("[local] {} 파일 생성 완료 — path={}, codeId={}", label, target.toAbsolutePath(), codeId);
        } catch (IOException e) {
            // 파일 쓰기 실패는 비치명적 — DB 승인은 이미 커밋됨
            log.error("[local] {} 파일 생성 실패 — path={}, codeId={}", label, target.toAbsolutePath(), codeId, e);
        }
    }

    /**
     * Container에서 UI 컴포넌트를 import할 때 사용하는 상대 경로를 계산한다.
     *
     * <p>예: componentDir={@code ../demo/front/src/generated},
     *      containerDir={@code ../demo/front/src/containers}
     *     → {@code ../generated}
     *
     * <p>두 경로가 같은 부모 디렉토리를 공유하지 않는 복잡한 경우에는 절대 경로를 반환한다.
     */
    private String resolveImportPrefix(String componentDir, String containerDir) {
        try {
            Path compPath = Path.of(componentDir).toAbsolutePath().normalize();
            Path contPath = Path.of(containerDir).toAbsolutePath().normalize();
            // container → component 로의 상대 경로 계산
            Path relative = contPath.relativize(compPath);
            String prefix = relative.toString().replace("\\", "/");
            // 상대 경로가 ".."로 시작하지 않으면 "./" 접두사 추가
            return prefix.startsWith(".") ? prefix : "./" + prefix;
        } catch (Exception e) {
            // 경로 계산 실패 시 fallback — 런타임에 개발자가 직접 수정 가능
            log.warn("[local] import 경로 계산 실패 — fallback '../generated' 사용. componentDir={}, containerDir={}",
                    componentDir, containerDir);
            return "../generated";
        }
    }

    private static boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
