/**
 * @file ContainerScaffoldGeneratorTest.java
 * @description ContainerScaffoldGenerator 단위 테스트.
 *     export default function 패턴 추출, fallback 이름 적용,
 *     생성된 scaffold 구조(import 경로, TODO 주석, 파일명)를 검증한다.
 * @see ContainerScaffoldGenerator
 */
package com.example.reactplatform.domain.reactgenerate.deploy;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

class ContainerScaffoldGeneratorTest {

    private final ContainerScaffoldGenerator generator = new ContainerScaffoldGenerator();

    private static final String TSX_LOGIN_PAGE =
            "export default function LoginPage() { return <div/>; }";
    private static final String TSX_ARROW_FUNC =
            "const App = () => <div/>; export default App;";
    private static final String TSX_NO_EXPORT =
            "const App = () => <div/>;";

    // ========== generate() ==========

    @Nested
    @DisplayName("generate()")
    class Generate {

        @Test
        @DisplayName("export default function이 있으면 컴포넌트명을 추출하여 Container 이름을 생성한다")
        void generate_withExportDefaultFunction_extractsComponentName() {
            String scaffold = generator.generate(TSX_LOGIN_PAGE, "../generated");

            assertThat(scaffold).contains("LoginPageContainer");
            assertThat(scaffold).contains("LoginPage");
        }

        @Test
        @DisplayName("생성된 scaffold에 importPrefix와 componentName을 조합한 import 경로가 포함된다")
        void generate_importPath_containsPrefixAndComponentName() {
            String scaffold = generator.generate(TSX_LOGIN_PAGE, "../generated");

            // import LoginPage from '../generated/LoginPage'
            assertThat(scaffold).contains("'../generated/LoginPage'");
        }

        @Test
        @DisplayName("생성된 scaffold에 개발자 작업을 위한 TODO 주석이 포함된다")
        void generate_containsTodoComments() {
            String scaffold = generator.generate(TSX_LOGIN_PAGE, "../generated");

            assertThat(scaffold).contains("TODO");
        }

        @Test
        @DisplayName("생성된 scaffold에 JSDoc 파일 주석(@file, @description)이 포함된다")
        void generate_containsJsDocFileComment() {
            String scaffold = generator.generate(TSX_LOGIN_PAGE, "../generated");

            assertThat(scaffold).contains("@file");
            assertThat(scaffold).contains("@description");
        }

        @Test
        @DisplayName("export default function이 없으면 fallback 이름(GeneratedComponent)을 사용한다")
        void generate_withoutExportDefaultFunction_usesFallbackName() {
            String scaffold = generator.generate(TSX_NO_EXPORT, "../generated");

            assertThat(scaffold).contains("GeneratedComponentContainer");
            assertThat(scaffold).contains("GeneratedComponent");
        }

        @Test
        @DisplayName("null 코드가 입력되면 fallback 이름을 사용한다")
        void generate_nullCode_usesFallbackName() {
            String scaffold = generator.generate(null, "../generated");

            assertThat(scaffold).contains("GeneratedComponentContainer");
        }

        @Test
        @DisplayName("빈 문자열 코드가 입력되면 fallback 이름을 사용한다")
        void generate_blankCode_usesFallbackName() {
            String scaffold = generator.generate("  ", "../generated");

            assertThat(scaffold).contains("GeneratedComponentContainer");
        }

        @Test
        @DisplayName("./ 시작 importPrefix도 import 경로에 올바르게 반영된다")
        void generate_dotSlashImportPrefix_includedInImportPath() {
            String scaffold = generator.generate(TSX_LOGIN_PAGE, "./generated");

            assertThat(scaffold).contains("'./generated/LoginPage'");
        }
    }

    // ========== resolveFileName() ==========

    @Nested
    @DisplayName("resolveFileName()")
    class ResolveFileName {

        @Test
        @DisplayName("export default function이 있으면 {ComponentName}Container.tsx를 반환한다")
        void resolveFileName_withComponentName_returnsContainerFileName() {
            assertThat(generator.resolveFileName(TSX_LOGIN_PAGE)).isEqualTo("LoginPageContainer.tsx");
        }

        @Test
        @DisplayName("export default function이 없으면 GeneratedComponentContainer.tsx를 반환한다")
        void resolveFileName_withoutComponentName_returnsFallback() {
            assertThat(generator.resolveFileName(TSX_NO_EXPORT))
                    .isEqualTo("GeneratedComponentContainer.tsx");
        }

        @Test
        @DisplayName("null 입력 시 GeneratedComponentContainer.tsx를 반환한다")
        void resolveFileName_nullInput_returnsFallback() {
            assertThat(generator.resolveFileName(null)).isEqualTo("GeneratedComponentContainer.tsx");
        }

        @Test
        @DisplayName("다양한 컴포넌트명을 올바르게 파싱한다")
        void resolveFileName_variousComponentNames_parsedCorrectly() {
            assertThat(generator.resolveFileName(
                            "export default function DashboardPage() {}"))
                    .isEqualTo("DashboardPageContainer.tsx");
            assertThat(generator.resolveFileName(
                            "export default function MyComponent() {}"))
                    .isEqualTo("MyComponentContainer.tsx");
        }
    }

    // ========== extractComponentName() ==========

    @Nested
    @DisplayName("extractComponentName()")
    class ExtractComponentName {

        @Test
        @DisplayName("export default function이 있으면 함수명을 반환한다")
        void extractComponentName_withExportDefault_returnsName() {
            assertThat(generator.extractComponentName(TSX_LOGIN_PAGE)).isEqualTo("LoginPage");
        }

        @Test
        @DisplayName("패턴이 없으면 GeneratedComponent를 반환한다")
        void extractComponentName_withoutPattern_returnsFallback() {
            assertThat(generator.extractComponentName(TSX_NO_EXPORT)).isEqualTo("GeneratedComponent");
        }

        @Test
        @DisplayName("null 입력 시 GeneratedComponent를 반환한다")
        void extractComponentName_nullInput_returnsFallback() {
            assertThat(generator.extractComponentName(null)).isEqualTo("GeneratedComponent");
        }
    }
}
