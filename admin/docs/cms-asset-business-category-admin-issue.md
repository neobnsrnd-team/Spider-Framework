## 📌 개요 (Overview)

> 이번 작업의 핵심 내용을 요약해 주세요.

- 이미지 카테고리화
- Admin 자산 관리 화면에서 카테고리 기반 조회/검색이 가능하도록 적용
- CMS 와 동일한 기준으로 `SPW_CMS_ASSET.BUSINESS_CATEGORY` 를 코드 기반 카테고리 컬럼으로 사용
- 신규 테이블을 추가하지 않고 기존 컬럼과 코드그룹을 활용

## 🎯 목표 (Objective)

> 어떤 문제를 해결하려고 하나요? 이 작업이 완료된 후의 모습은 무엇인가요?

- Admin 에서 CMS 자산을 부서 카테고리 기준으로 검색하고 관리할 수 있다.
- 업로드 요청 목록과 승인 관리 목록에서 카테고리 필터가 동작한다.
- Admin 화면에는 코드값 대신 코드명이 표시된다.
- CMS 와 Admin 이 동일한 카테고리 코드 체계를 사용한다.

## 🛠 상세 구현 내용 (Description)

> 어떻게 구현할 예정인지 기술적인 내용을 단계별로 적어주세요.

- [ ] Admin 에서 사용할 이미지 카테고리 코드그룹 조회 방식 확정
- [ ] 업로드 요청 목록 검색조건에 카테고리 드롭다운 연결
- [ ] 승인 관리 목록 검색조건에 카테고리 드롭다운 연결
- [ ] 목록/상세 화면에서 `BUSINESS_CATEGORY` 코드값을 코드명으로 변환해 표시
- [ ] 자유입력 카테고리 사용이 남아있다면 제거
- [ ] CMS 와 동일한 코드그룹 기준으로 검색조건/표시값 정합성 확인
- [ ] 필요 시 controller/service/mapper 테스트 보강

## ✅ 인수 기준 (Acceptance Criteria)

> '완료'되었다고 판단하기 위한 최소한의 조건입니다.

- [ ] Admin 내 업로드 요청 목록에서 카테고리 필터 검색이 가능하다.
- [ ] Admin 승인 관리 목록에서 카테고리 필터 검색이 가능하다.
- [ ] Admin 화면에는 카테고리 코드명이 표시된다.
- [ ] CMS 에서 저장한 `BUSINESS_CATEGORY` 값이 Admin 조회 조건과 동일하게 동작한다.
- [ ] 신규 테이블 없이 기존 `BUSINESS_CATEGORY` 컬럼 기준으로 동작한다.

## 💡 고려 사항 및 대안 (선택)

> 고민했던 부분이나 향후 영향도를 적어주세요.

- 이번 범위에서는 Admin 이 카테고리 정책을 별도로 만들지 않고 CMS 의 코드그룹 기준을 그대로 사용한다.
- 코드명 변환을 서버에서 할지 화면에서 할지는 추가 결정이 필요하다.
- 카테고리 미지정 데이터가 이미 존재하면 표시 방식 또는 정리 방식이 필요할 수 있다.
- 향후 다중 카테고리 요구가 생기면 CMS/Admin 모두 별도 매핑 구조 검토가 필요하다.

## 🔗 참고 사항 (선택)

> 참고 자료 혹은 추가로 전달할 사항을 적어주세요.

- 관련 파일
- `src/main/resources/mapper/oracle/cmsasset/CmsAssetMapper.xml`
- `src/main/java/com/example/admin_demo/domain/cmsasset/dto/CmsAssetRequestListRequest.java`
- `src/main/java/com/example/admin_demo/domain/cmsasset/dto/CmsAssetApprovalListRequest.java`
- `src/main/java/com/example/admin_demo/domain/cmsasset/service/CmsAssetService.java`
