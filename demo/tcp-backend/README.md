# tcp-backend

HNC POC Demo 백엔드 서버 — Netty 기반 TCP/IP 서버 (4바이트 길이 헤더 + JSON)

---

## 개요

기존 HTTP REST API를 대체하는 TCP/IP 통신 기반 백엔드 POC 프로젝트입니다.  
웹 브라우저 호환성을 위한 HTTP REST API도 선택적으로 제공합니다.

| 항목 | 내용 |
|---|---|
| Java | 17 |
| Spring Boot | 3.2.5 |
| TCP 서버 | Netty |
| DB | Oracle (ojdbc11) |
| 빌드 | Maven |

---

## 포트

| 포트 | 프로토콜 | 용도 |
|---|---|---|
| `19998` | TCP | Netty TCP 서버 (메인) |
| `9998` | HTTP | Spring MVC REST API (보조, 웹 브라우저용) |

---

## 실행 방법

### 사전 요구사항

- Java 17+
- Oracle DB 접근 가능 환경

### 빌드 및 실행

```bash
./mvnw clean package -DskipTests
java -jar target/tcp-backend-0.0.1-SNAPSHOT.jar
```

### 주요 설정 (application.yml)

```yaml
server:
  port: 9998            # HTTP REST API 포트

tcp:
  port: 19998           # Netty TCP 포트
  boss-threads: 1       # 연결 수락 스레드 수
  worker-threads: 4     # I/O 처리 스레드 수
  max-frame-length: 1048576  # 최대 메시지 크기 (1MB)

auth:
  pin-max-attempts: 3   # PIN 최대 오류 횟수
  admin-secret: ...     # 관리자 명령 인증 시크릿
```

---

## TCP 프로토콜

### 프레임 구조

```
[ 4 bytes: 본문 길이 (big-endian) ] [ N bytes: UTF-8 JSON 본문 ]
```

- 길이 헤더는 헤더 자신(4바이트)을 포함하지 않음
- 최대 프레임 크기: 1MB (설정 변경 가능)

### 요청 형식 (Client → Server)

```json
{
  "cmd": "LOGIN",
  "sessionId": "uuid 또는 null",
  "adminSecret": "관리자 시크릿 또는 null",
  "payload": { }
}
```

### 응답 형식 (Server → Client)

```json
{
  "cmd": "LOGIN",
  "success": true,
  "sessionId": "uuid (로그인 응답에만 포함)",
  "data": { },
  "error": null
}
```

---

## TCP 명령어 목록

### 인증 (Auth)

| 명령 | 인증 필요 | 설명 |
|---|---|---|
| `LOGIN` | X | 로그인. `payload: { userId, password }` |
| `LOGOUT` | O | 로그아웃. 세션 무효화 |
| `GET_PROFILE` | O | 사용자 프로필 조회 |

**LOGIN 응답 예시:**
```json
{
  "cmd": "LOGIN",
  "success": true,
  "sessionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "data": {
    "userId": "user01",
    "userName": "홍길동",
    "userGrade": "A",
    "lastLogin": "20240101120000"
  }
}
```

---

### 카드 (Card)

| 명령 | 설명 |
|---|---|
| `GET_CARDS` | 보유 카드 목록 조회 |
| `GET_PAYABLE_AMOUNT` | 결제 가능 금액 조회. `payload: { cardId }` |
| `IMMEDIATE_PAY` | 즉시 결제 실행. `payload: { cardId, pin, amount, accountNumber }` |
| `RESET_PIN_ATTEMPTS` | PIN 오류 횟수 초기화. `payload: { cardId }` |

**즉시 결제 참고사항:**
- PIN은 오늘 날짜의 `MMDD` 형식 (예: 4월 21일 → `"0421"`)
- PIN 오류 3회 시 잠금 처리 (`attemptsLeft` 포함하여 오류 반환)
- 결제는 이용일자 순으로 순차 처리 (DB `FOR UPDATE` 락 사용)

---

### 거래내역 (Transaction)

| 명령 | 설명 |
|---|---|
| `GET_TRANSACTIONS` | 카드 이용 내역 조회 |
| `GET_PAYMENT_STATEMENT` | 청구서 조회 |

**GET_TRANSACTIONS payload:**
```json
{
  "cardId": "카드번호 또는 null (전체)",
  "period": "thisMonth | 1month | 3months | custom",
  "customMonth": "YYYYMM (period=custom일 때)",
  "fromDate": "YYYYMMDD (period=custom일 때)",
  "toDate": "YYYYMMDD (period=custom일 때)",
  "usageType": "lump | installment | cancel (선택)"
}
```

**GET_PAYMENT_STATEMENT payload:**
```json
{
  "yearMonth": "YYYYMM",
  "paymentDay": 15
}
```

---

### 긴급공지 (Notice)

| 명령 | 관리자 필요 | 설명 |
|---|---|---|
| `NOTICE_SUBSCRIBE` | X | 공지 수신 채널 등록 (연결 유지) |
| `NOTICE_SYNC` | O | 긴급공지 배포 (전체 구독자에게 브로드캐스트) |
| `NOTICE_END` | O | 긴급공지 종료 |
| `NOTICE_PREVIEW` | O | 현재 저장된 공지 내용 조회 |

- 관리자 명령은 요청에 `adminSecret` 필드 필요
- 브로드캐스트 대상: TCP 구독 채널 + HTTP SSE 구독자

**NOTICE_SYNC payload:**
```json
{
  "notices": [
    { "lang": "ko", "title": "제목", "content": "내용" }
  ],
  "displayType": "A",
  "closeableYn": "Y",
  "hideTodayYn": "N"
}
```

---

## 세션 관리

- 로그인 성공 시 서버에서 `sessionId` (UUID) 발급
- 이후 모든 인증 필요 명령에 `sessionId` 포함하여 요청
- TCP 연결 종료 시 세션 자동 무효화
- 중복 로그인 방지: 동일 userId로 새로 로그인 시 기존 세션 무효화

---

## HTTP REST API (보조)

웹 브라우저에서 직접 접근이 필요한 기능만 REST로 제공합니다.

| 메서드 | 경로 | 설명 |
|---|---|---|
| `POST` | `/api/auth/login` | 로그인 |
| `POST` | `/api/auth/refresh` | 액세스 토큰 갱신 (httpOnly 쿠키 사용) |
| `POST` | `/api/auth/logout` | 로그아웃 |
| `GET` | `/api/auth/me` | 현재 사용자 정보 |
| `GET` | `/api/notices/sse` | 긴급공지 SSE 스트림 구독 |

CORS 허용 출처: `http://localhost:5173`

---

## 프로젝트 구조

```
src/main/java/com/example/tcpbackend/
├── TcpBackendApplication.java       # 애플리케이션 진입점
├── config/
│   ├── AppProperties.java           # 설정값 바인딩 (tcp.*, auth.*)
│   ├── JacksonConfig.java           # ObjectMapper 전역 설정
│   ├── NettyTcpServerConfig.java    # Netty 서버 생명주기 관리
│   └── WebConfig.java               # CORS, 인터셉터 설정
├── domain/
│   ├── auth/                        # 인증 도메인
│   ├── card/                        # 카드 도메인
│   ├── transaction/                 # 거래내역 도메인
│   └── notice/                      # 긴급공지 도메인
├── handler/
│   ├── AuthHandler.java             # 인증 명령 처리
│   ├── CardHandler.java             # 카드 명령 처리
│   ├── TransactionHandler.java      # 거래내역 명령 처리
│   └── NoticeHandler.java           # 공지 명령 처리
├── tcp/
│   ├── TcpMessageHandler.java       # TCP 명령 라우터
│   ├── TcpRequest.java              # 요청 DTO
│   ├── TcpResponse.java             # 응답 DTO
│   ├── TcpServerInitializer.java    # Netty 파이프라인 구성
│   ├── codec/
│   │   ├── LengthPrefixDecoder.java # 4바이트 길이 헤더 디코더
│   │   └── LengthPrefixEncoder.java # 4바이트 길이 헤더 인코더
│   └── session/
│       ├── TcpSessionManager.java   # 세션 + 공지 구독자 관리
│       └── SessionInfo.java         # 세션 데이터
└── web/
    ├── controller/                  # REST 컨트롤러
    ├── filter/                      # 요청 로깅 필터
    └── interceptor/                 # 세션 인증 인터셉터
```

---

## 주요 DB 테이블

| 테이블 | 설명 |
|---|---|
| `POC_USER` | 사용자 계정 및 프로필 |
| `POC_카드리스트` | 카드 정보 |
| `POC_카드사용내역` | 카드 이용 내역 |
| `POC_뱅킹계좌정보` | 뱅킹 계좌 정보 |
| `POC_뱅킹거래내역` | 뱅킹 거래 이력 |
| `FWK_PROPERTY` | 시스템 설정 (긴급공지 상태 포함) |
