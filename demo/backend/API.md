# Demo Backend API 명세

Base URL: `http://localhost:{PORT}/api`

---

## 인증

| 방식 | 설명 |
|------|------|
| JWT Bearer | `Authorization: Bearer <accessToken>` 헤더 |
| Admin Secret | `X-Admin-Secret: <ADMIN_SECRET>` 헤더 |

**공통 에러 응답 (JWT Bearer 보호 라우트)**

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | Authorization 헤더 없음 | `"인증이 필요합니다."` |
| 401 | 토큰 만료 또는 유효하지 않음 | `"토큰이 만료되었거나 유효하지 않습니다."` |

---

## 목차

1. [GET /auth/me](#1-get-authme)
2. [POST /auth/login](#2-post-authlogin)
3. [POST /auth/refresh](#3-post-authrefresh)
4. [POST /auth/logout](#4-post-authlogout)
5. [GET /cards](#5-get-cards)
6. [GET /transactions](#6-get-transactions)
7. [GET /payment-statement](#7-get-payment-statement)
8. [GET /cards/:cardId/payable-amount](#8-get-cardscardidpayable-amount)
9. [POST /cards/:cardId/immediate-pay](#9-post-cardscardidimmediate-pay)
10. [DELETE /cards/:cardId/pin-attempts](#10-delete-cardscardidpin-attempts)
11. [GET /notices/sse](#11-get-noticessse)
12. [POST /notices/sync](#12-post-noticessync)
13. [POST /notices/end](#13-post-noticesend)
14. [GET /notices/preview](#14-get-noticespreview)

---

## 1. GET /auth/me

로그인한 사용자의 프로필과 최근 접속 일시를 반환한다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |

### Response `200`

```json
{
  "userId":    "string",
  "userName":  "string",
  "userGrade": "string",
  "lastLogin": "YYYY.MM.DD HH:MM:SS"
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 404 | 사용자 조회 불가 | `"사용자를 찾을 수 없습니다."` |
| 500 | DB 오류 | `"서버 오류가 발생했습니다."` |

---

## 2. POST /auth/login

아이디·비밀번호로 로그인한다. 성공 시 Access Token을 반환하고, Refresh Token을 httpOnly 쿠키에 설정한다.

**인증:** 없음

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Body | userId | string | ✓ | 사용자 아이디 |
| Body | password | string | ✓ | 비밀번호 |

### Response `200`

```json
{
  "success":   true,
  "token":     "string (accessToken)",
  "userId":    "string",
  "userName":  "string",
  "userGrade": "string",
  "lastLogin": "YYYY.MM.DD HH:MM:SS"
}
```

> 쿠키: `refreshToken` (httpOnly, sameSite=lax, path=/api/auth, maxAge=7일)

### 에러 응답

| 상태코드 | 조건 | `message` |
|----------|------|-----------|
| 400 | userId 또는 password 미입력 | `"아이디와 비밀번호를 입력하세요."` |
| 401 | 아이디 또는 비밀번호 불일치 | `"아이디 또는 비밀번호가 틀렸습니다."` |
| 403 | 비활성 계정 (LOG_YN ≠ 'Y') | `"사용이 정지된 계정입니다. 관리자에게 문의하세요."` |
| 500 | DB 오류 | `"서버 오류가 발생했습니다."` |

> 에러 응답 Body: `{ "success": false, "message": "..." }`

---

## 3. POST /auth/refresh

Refresh Token 쿠키를 검증하고 새 Access Token을 발급한다.

**인증:** 없음 (Refresh Token은 쿠키로 자동 전송)

### Request

| 구분 | 항목 | 설명 |
|------|------|------|
| Cookie | refreshToken | 로그인 시 발급된 httpOnly 쿠키 |

### Response `200`

```json
{
  "accessToken": "string",
  "lastLogin":   "YYYY.MM.DD HH:MM:SS"
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | Refresh Token 쿠키 없음 | `"Refresh Token이 없습니다."` |
| 401 | 저장된 토큰과 불일치 (탈취 감지) | `"유효하지 않은 Refresh Token입니다."` |
| 401 | 만료 또는 서명 불일치 | `"Refresh Token이 만료되었거나 유효하지 않습니다."` |

---

## 4. POST /auth/logout

Refresh Token을 무효화하고 쿠키를 삭제한다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |

### Response `200`

```json
{
  "success": true
}
```

> 쿠키: `refreshToken` 만료 처리 (maxAge=0)

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |

---

## 5. GET /cards

로그인 사용자의 카드 목록을 반환한다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |

### Response `200`

```json
{
  "cards": [
    {
      "id":             "string (카드번호)",
      "name":           "string (카드구분)",
      "brand":          "VISA | Mastercard | AMEX | JCB | UnionPay | Unknown",
      "maskedNumber":   "string (마스킹된 카드번호)",
      "balance":        "number (한도금액 - 사용금액)",
      "expiry":         "string (유효기간)",
      "paymentBank":    "string (결제은행명)",
      "paymentAccount": "string (결제계좌)",
      "paymentDay":     "string (결제일)",
      "limitAmount":    "number (한도금액)",
      "usedAmount":     "number (사용금액)"
    }
  ]
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 500 | DB 오류 | `"DB 조회 중 오류가 발생했습니다."` |

---

## 6. GET /transactions

카드 이용내역을 조회한다. 기간·카드·이용구분으로 필터링할 수 있다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |
| Query | cardId | string | | 카드번호. 생략 또는 `"all"` 이면 전체 |
| Query | period | string | | `"thisMonth"` \| `"1month"` \| `"3months"` \| `"custom"` |
| Query | customMonth | string | | `"YYYY-MM"`. `period=custom` 일 때 사용 |
| Query | usageType | string | | `"lump"` \| `"installment"` \| `"cancel"`. 생략 또는 `"all"` 이면 전체 |
| Query | fromDate | string | | `YYYYMMDD`. 직접 날짜 범위 지정 시 |
| Query | toDate | string | | `YYYYMMDD`. 직접 날짜 범위 지정 시 |

### Response `200`

```json
{
  "transactions": [
    {
      "id":             "string",
      "merchant":       "string (이용가맹점)",
      "amount":         "number (결제금액, 취소는 음수)",
      "date":           "YYYY.MM.DD HH:MM",
      "type":           "string (\"일시불\" | \"할부(N개월)\" | \"취소\")",
      "approvalNumber": "string (승인번호)",
      "status":         "\"승인\" | \"취소\"",
      "cardName":       "string (카드명)"
    }
  ],
  "totalCount": "number",
  "paymentSummary": {
    "date":        "string (\"M월 D일\")",
    "totalAmount": "number"
  }
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 500 | DB 오류 | `"DB 조회 중 오류가 발생했습니다."` |

---

## 7. GET /payment-statement

결제 예정금액 또는 이용대금명세서를 조회한다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |
| Query | yearMonth | string | | `"YYYY-MM"`. 지정 시 해당 월 청구 대금 조회 |
| Query | paymentDay | number | | 1~31. 공여기간 계산 기준 결제일 |

### Response `200`

```json
{
  "dueDate":     "string (YYMMDD, 대표 결제예정일)",
  "totalAmount": "number",
  "items": [
    {
      "cardNo":   "string (카드번호)",
      "cardName": "string (카드명)",
      "amount":   "number (결제예정금액)",
      "dueDate":  "string (YYMMDD, 결제예정일)"
    }
  ],
  "cardInfo": {
    "paymentBank":    "string (결제은행명)",
    "paymentAccount": "string (결제계좌)",
    "paymentDay":     "string (결제일)"
  },
  "billingPeriod": {
    "usageStart": "YYYY.MM.DD",
    "usageEnd":   "YYYY.MM.DD",
    "dueDate":    "YYYY.MM.DD"
  }
}
```

> `cardInfo`, `billingPeriod` 는 조회 조건에 따라 `null` 일 수 있다.

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 500 | DB 오류 또는 공여기간 계산 실패 | `"DB 조회 중 오류가 발생했습니다."` |

---

## 8. GET /cards/:cardId/payable-amount

즉시결제 가능금액과 카드 한도금액을 반환한다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |
| Path | cardId | string | ✓ | 카드번호 |

### Response `200`

```json
{
  "payableAmount": "number (미결제 잔액 합산)",
  "creditLimit":   "number (카드 한도금액)"
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 500 | DB 오류 | `"DB 조회 중 오류가 발생했습니다."` |

---

## 9. POST /cards/:cardId/immediate-pay

PIN 인증 후 즉시결제를 처리한다. 단일 트랜잭션으로 아래 순서로 실행된다.

1. `POC_뱅킹계좌정보` UPDATE — 계좌 잔액 차감
2. `POC_뱅킹거래내역` INSERT — 거래내역 기록
3. `POC_카드사용내역` UPDATE — 결제잔액 차감 (이용일자 오래된 순)
4. `POC_카드리스트` UPDATE — 사용금액 복원

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |
| Path | cardId | string | ✓ | 결제 대상 카드번호 |
| Body | pin | string | ✓ | PIN 번호 (오늘 날짜 MMDD. 예: `"0415"`) |
| Body | amount | number | ✓ | 결제요청금액 |
| Body | accountNumber | string | ✓ | 출금 계좌번호 (원본, 비마스킹) |

### Response `200`

```json
{
  "paidAmount":     "number (실제 차감된 총합계)",
  "processedCount": "number (업데이트된 내역 건수)",
  "completedAt":    "YYYY.MM.DD HH:MI"
}
```

### 에러 응답

| 상태코드 | 조건 | Body |
|----------|------|------|
| 400 | 결제요청금액이 0 이하 | `{ "error": "결제요청금액이 유효하지 않습니다." }` |
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |
| 403 | PIN 오류 (시도 횟수 남음) | `{ "error": "PIN 번호가 올바르지 않습니다.", "attemptsLeft": number }` |
| 403 | PIN 시도 횟수 초과 | `{ "error": "PIN 입력 횟수를 초과하였습니다.", "attemptsLeft": 0 }` |
| 422 | 계좌 잔액 부족 | `{ "error": "잔액이 부족합니다." }` |
| 422 | 출금 계좌 미존재 | `{ "error": "출금 계좌를 찾을 수 없습니다." }` |
| 500 | 시스템 오류 | `{ "error": "즉시결제 처리 중 오류가 발생했습니다." }` |

> PIN 검증은 403으로 응답한다. 401을 사용하면 Axios 인터셉터가 토큰 갱신을 재시도하면서 PIN 실패 횟수가 중복 증가하는 문제가 발생하기 때문이다.

---

## 10. DELETE /cards/:cardId/pin-attempts

PIN 실패 횟수를 초기화한다. 횟수 초과로 잠긴 사용자가 초기화 버튼을 클릭할 때 호출된다.

**인증:** JWT Bearer

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | Authorization | string | ✓ | `Bearer <accessToken>` |
| Path | cardId | string | ✓ | 카드번호 |

### Response `200`

```json
{
  "ok": true
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 401 | 토큰 없음 / 유효하지 않음 | 공통 참고 |

---

## 11. GET /notices/sse

긴급공지 SSE(Server-Sent Events) 스트림을 구독한다. 연결 즉시 현재 공지 상태를 전송하고, 이후 변경 시마다 이벤트를 수신한다.

**인증:** 없음

### Request

없음

### Response `200`

```
Content-Type: text/event-stream

event: notice
data: <JSON>
```

**data 형식 (공지 배포 중)**

```json
{
  "notices": [
    {
      "lang":    "string (예: \"EMERGENCY_KO\")",
      "title":   "string",
      "content": "string"
    }
  ],
  "displayType": "A | B | C | N",
  "closeableYn": "Y | N",
  "hideTodayYn": "Y | N"
}
```

**data 형식 (배포 중인 공지 없음)**

```json
null
```

---

## 12. POST /notices/sync

긴급공지를 배포한다. 인메모리 상태를 업데이트하고 연결된 모든 SSE 클라이언트에 브로드캐스트한다.

**인증:** Admin Secret

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | X-Admin-Secret | string | ✓ | 관리자 시크릿 키 |
| Body | notices | Array | ✓ | `[{ lang, title, content }]` |
| Body | displayType | string | ✓ | `"A"` \| `"B"` \| `"C"` \| `"N"` |
| Body | closeableYn | string | | `"Y"` \| `"N"`. 기본값: `"Y"` |
| Body | hideTodayYn | string | | `"Y"` \| `"N"`. 기본값: `"Y"` |

### Response `200`

```json
{
  "success": true
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 400 | notices 또는 displayType 미입력 | `"notices 배열과 displayType이 필요합니다."` |
| 403 | Admin Secret 불일치 | `"관리자 인증이 필요합니다."` |

---

## 13. POST /notices/end

긴급공지 배포를 종료한다. 인메모리 상태를 null로 초기화하고 모든 SSE 클라이언트에 브로드캐스트한다.

**인증:** Admin Secret

### Request

| 구분 | 항목 | 타입 | 필수 | 설명 |
|------|------|------|------|------|
| Header | X-Admin-Secret | string | ✓ | 관리자 시크릿 키 |

### Response `200`

```json
{
  "success": true
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 403 | Admin Secret 불일치 | `"관리자 인증이 필요합니다."` |

---

## 14. GET /notices/preview

DB에 저장된 최신 공지 내용을 반환한다. 배포 여부와 관계없이 미리보기 용도로 사용된다.

**인증:** 없음

### Request

없음

### Response `200`

```json
{
  "notices": [
    {
      "lang":    "string",
      "title":   "string",
      "content": "string"
    }
  ],
  "displayType": "string"
}
```

### 에러 응답

| 상태코드 | 조건 | `error` |
|----------|------|---------|
| 500 | DB 조회 실패 | `"공지 데이터를 불러오지 못했습니다."` |
