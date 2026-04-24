// src/app/api/exchange/route.ts
import { NextResponse } from 'next/server';

/**
 * GET /api/exchange
 * 환율 데이터 플레이스홀더 API
 *
 * 실제 운영 시 아래 데이터 소스 중 하나로 교체하세요:
 * - 한국수출입은행 환율 API: https://www.koreaexim.go.kr/site/program/financial/exchangeJSON
 * - 한국은행 경제통계시스템: https://ecos.bok.or.kr/api/
 * - 서울외국환중개: https://www.smbs.biz
 *
 * 응답 형식: { [currency: string]: { buy: number, sell: number, change: number } }
 */
export async function GET() {
    // TODO: 실제 환율 API로 교체
    const rates = {
        USD: { buy: 1325.5, sell: 1296.5, change: 3.5 },
        EUR: { buy: 1445.2, sell: 1408.3, change: -5.2 },
        JPY: { buy: 944.85, sell: 923.25, change: 1.15 },
        CNY: { buy: 184.6, sell: 179.8, change: -0.8 },
        GBP: { buy: 1685.4, sell: 1642.3, change: 8.9 },
        HKD: { buy: 170.5, sell: 166.2, change: 0.3 },
    };

    return NextResponse.json(rates, {
        headers: {
            'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        },
    });
}
