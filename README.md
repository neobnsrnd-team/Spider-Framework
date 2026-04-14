# POC HNC

하나카드 POC(Proof of Concept) 프로젝트 모노레포.

## 디렉터리 구조

```
POC_HNC/
├── admin/               # 관리자 서버
├── demo/                # 하나카드 POC 시연용 데모 앱
│   ├── backend/         #   백엔드
│   └── front/           #   프론트엔드
└── reactive-springware/ # 리액트 코드 생성 플랫폼
```

## 각 모듈 개요

### admin
`reactive-springware` 및 `demo`의 관리자 서버. Spring Boot 3.4 + Thymeleaf 기반 미들웨어 관리 콘솔로, 메뉴·권한·사용자·긴급공지 등 플랫폼 운영에 필요한 기능을 제공한다.

→ 상세 가이드: [admin/README.md](admin/README.md)

### demo
하나카드 POC 시연을 위한 데모 애플리케이션. `backend`와 `front`로 구성된다.

### reactive-springware
리액트 컴포넌트 코드를 생성해주는 플랫폼.
