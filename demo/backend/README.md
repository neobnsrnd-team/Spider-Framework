# HNC Demo Backend

하나카드 데모 앱의 Express 기반 백엔드 서버입니다.  
Oracle DB(`D_SPIDERLINK`)의 POC 테이블을 REST API로 노출하며, JWT 인증으로 보호합니다.

---

## 기술 스택

| 항목 | 버전 |
|------|------|
| Node.js | 18+ 권장 |
| Express | 4.x |
| oracledb | 6.x (Thick Mode) |
| jsonwebtoken | 9.x |
| dotenv | 16.x |
| nodemon | 3.x (개발용) |

---

## 디렉토리 구조

```
demo/backend/
├── server.js          # 서버 진입점 + 모든 API 엔드포인트
├── db.js              # Oracle 커넥션 풀 관리 (initPool / withConnection / closePool)
├── utils/
│   ├── cardBrand.js   # 카드번호 BIN 기반 브랜드 식별 + 번호 마스킹
│   └── logger.js      # 메서드·상태코드 컬러 API 로거 미들웨어
├── .env               # 실제 환경 변수 (Git 제외 — 절대 커밋 금지)
├── .env.example       # 환경 변수 예시 (이 파일을 복사해서 .env 생성)
├── .gitignore
└── package.json
```

---

## 환경 설정

### 1. Oracle Instant Client 설치

`oracledb` Thick Mode는 Oracle Instant Client가 필요합니다.  
접속 대상 Oracle 서버가 **11g(XE)** 이므로 Thin Mode를 지원하지 않습니다.

- [Oracle Instant Client 다운로드](https://www.oracle.com/database/technologies/instant-client/downloads.html)
- Windows 기준 예시 경로: `C:\instantclient_21_13`

### 2. .env 파일 생성

```bash
cp .env.example .env
```

`.env` 파일을 열어 실제 값으로 채웁니다.

```dotenv
# Oracle Instant Client 경로 (미설정 시 시스템 PATH 자동 탐색)
ORACLE_CLIENT_PATH=C:\instantclient_21_13

# Oracle 계정
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Easy Connect 형식: host:port/service_name
DB_CONNECT_STRING=localhost:1521/XE

# 커넥션 풀 크기 (선택 — 기본값 사용 가능)
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_INCREMENT=1

# JWT 서명 비밀키 (충분히 길고 무작위한 값 사용)
JWT_SECRET=ENTER_YOUR_SECRET_KEY_HERE
# JWT 만료 시간 (예: 30m, 8h, 1d)
JWT_EXPIRES_IN=30m

# Express 서버 포트 (기본 3001)
PORT=3001

# 프론트엔드 주소 (CORS 허용 Origin)
CLIENT_ORIGIN=http://localhost:5173
```

> **주의:** `.env`에는 DB 비밀번호와 JWT 시크릿이 포함됩니다. 절대 Git에 커밋하지 마세요.

### 3. 패키지 설치

```bash
npm install
```

---

## 실행

```bash
# 개발 모드 (nodemon — 파일 변경 시 자동 재시작)
npm run dev

# 운영 모드
npm start
```

서버가 정상 기동되면 콘솔에 아래 메시지가 출력됩니다.

```
[DB] Thick Mode 초기화 완료 (Oracle Client 경로: C:\instantclient_21_13)
[DB] Oracle 커넥션 풀 생성 완료
[Server] http://localhost:3001 에서 실행 중
```

---

## API 목록

모든 보호 라우트는 `Authorization: Bearer <token>` 헤더가 필요합니다.

### 인증

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| POST | `/api/auth/login` | 불필요 | 로그인 — JWT 발급 |

**요청 Body**
```json
{ "userId": "string", "password": "string" }
```

**응답 (성공 200)**
```json
{
  "success": true,
  "token": "eyJ...",
  "userId": "user01",
  "userName": "홍길동",
  "userGrade": "A"
}
```

---

### 카드

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/api/cards` | 필요 | 로그인 사용자의 카드 목록 |

**응답 (성공 200)**
```json
{
  "cards": [
    {
      "id": "카드번호",
      "name": "카드구분",
      "brand": "VISA",
      "maskedNumber": "4111-11**-****-1111",
      "balance": 500000,
      "expiry": "2612",
      "paymentBank": "하나은행",
      "paymentAccount": "123-456-789012",
      "paymentDay": "15",
      "limitAmount": 3000000,
      "usedAmount": 2500000
    }
  ]
}
```

---

### 이용내역

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/api/transactions` | 필요 | 로그인 사용자의 이용내역 조회 |

**Query Parameters (모두 선택)**

| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `cardId` | string | 카드번호 필터. 없거나 `all`이면 전체 |
| `period` | string | `thisMonth` \| `1month` \| `3months` \| `custom` |
| `customMonth` | string | `YYYY-MM` (`period=custom`일 때 사용) |
| `usageType` | string | `lump`(일시불) \| `installment`(할부) \| `cancel`(취소) |

**응답 (성공 200)**
```json
{
  "transactions": [
    {
      "id": "카드번호-이용일자-승인시각-0",
      "merchant": "스타벅스 강남점",
      "amount": 6500,
      "date": "2026.04.14 10:30",
      "type": "일시불",
      "approvalNumber": "12345678",
      "status": "승인",
      "cardName": "하나 VIVA 카드"
    }
  ],
  "totalCount": 42,
  "paymentSummary": { "date": "4월 15일", "totalAmount": 350000 }
}
```

---

### 결제예정금액

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/api/payment-statement` | 필요 | 결제예정금액 및 명세서 데이터 |

**응답 (성공 200)**
```json
{
  "dueDate": "260415",
  "totalAmount": 350000,
  "items": [
    {
      "cardNo": "4111111111111111",
      "cardName": "하나 VIVA 카드",
      "amount": 350000,
      "dueDate": "260415"
    }
  ],
  "cardInfo": {
    "paymentBank": "하나은행",
    "paymentAccount": "123-456-789012",
    "paymentDay": "15"
  }
}
```

---

### 카드별 이용내역 (페이징)

| 메서드 | 경로 | 인증 | 설명 |
|--------|------|------|------|
| GET | `/api/cards/:cardId/transactions` | 필요 | 특정 카드의 이용내역 페이징 조회 |

**Query Parameters**

| 파라미터 | 기본값 | 설명 |
|----------|--------|------|
| `page` | 1 | 페이지 번호 (1-based) |
| `pageSize` | 20 | 페이지당 건수 (최대 100) |
| `fromDate` | - | 조회 시작일 `YYYYMMDD` |
| `toDate` | - | 조회 종료일 `YYYYMMDD` |

---

### 개발용 (운영 배포 전 제거 필요)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/dev/tables` | `D_SPIDERLINK`의 POC 테이블 목록 |
| GET | `/api/dev/columns/:tbl` | 특정 테이블의 컬럼 목록 |
| GET | `/api/dev/raw` | `POC_카드사용내역` 샘플 5건 조회 |

---

## DB 테이블 구조

서버가 참조하는 `D_SPIDERLINK` 스키마의 POC 테이블입니다.

| 테이블 | 설명 |
|--------|------|
| `POC_USER` | 사용자 계정 (`USER_ID`, `PASSWORD`, `LOG_YN` 등) |
| `POC_카드리스트` | 카드 목록 (`카드번호`, `카드구분`, `한도금액`, `사용금액` 등) |
| `POC_카드사용내역` | 이용내역 (`이용자`, `이용일자`, `이용가맹점`, `이용금액` 등) |

---

## 주요 모듈 설명

### `db.js` — Oracle 커넥션 풀

```js
const { initPool, withConnection, closePool } = require('./db');

// 앱 기동 시 한 번만 호출
await initPool();

// 쿼리 실행 — 커넥션 획득·반납 자동 처리
const result = await withConnection((conn) =>
  conn.execute('SELECT * FROM MY_TABLE WHERE ID = :id', { id: 1 })
);

// 앱 종료 시 호출
await closePool();
```

### `utils/cardBrand.js` — 브랜드 식별 + 마스킹

```js
const { detectBrand, maskCardNumber } = require('./utils/cardBrand');

detectBrand('4111111111111111')   // → 'VISA'
detectBrand('5500000000000004')   // → 'Mastercard'
maskCardNumber('4111111111111111') // → '4111-11**-****-1111'
```

---

## 에러 응답 형식

모든 API 에러는 아래 형식으로 반환됩니다.

| 상태 코드 | 상황 |
|-----------|------|
| 400 | 요청 파라미터 누락 |
| 401 | 토큰 없음 또는 만료 |
| 403 | 비활성 계정 |
| 500 | DB 오류 등 서버 내부 오류 |

```json
{ "error": "에러 메시지" }
```
