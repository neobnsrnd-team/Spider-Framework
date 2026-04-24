// src/app/api/health/route.ts
// 헬스체크 API — 앱 서버 생존 확인 (DB 실패해도 200 반환)

import { successResponse, getErrorMessage } from '@/lib/api-response';
import { getConnection } from '@/db/connection';

export async function GET() {
    let dbStatus = false;
    let dbMessage = '';

    let conn;
    try {
        conn = await getConnection();
        await conn.execute('SELECT 1 FROM DUAL');
        dbStatus = true;
        dbMessage = '연결 성공';
    } catch (err: unknown) {
        dbMessage = getErrorMessage(err);
    } finally {
        if (conn) await conn.close();
    }

    // 앱 서버는 살아있으므로 항상 200 반환
    // DB 상태는 응답 본문에 포함
    return successResponse({ db: dbStatus, dbMessage });
}
