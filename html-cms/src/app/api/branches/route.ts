// src/app/api/branches/route.ts

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/branches?lat=37.5665&lng=126.9780&type=all&q=강남
 * 영업점 및 ATM 위치 데이터 플레이스홀더 API
 *
 * 실제 운영 시 아래 데이터 소스로 교체하세요:
 * - IBK 기업은행 오픈뱅킹 API
 * - 자체 DB (PostgreSQL / MongoDB)
 * - 공공데이터포털 금융기관 지점 정보
 *
 * 응답 형식: Array<BranchInfo>
 */

interface BranchInfo {
    id: string;
    type: 'branch' | 'atm';
    name: string;
    address: string;
    hours: string;
    phone: string;
    lat: number;
    lng: number;
    distance?: string;
}

const PLACEHOLDER_BRANCHES: BranchInfo[] = [
    {
        id: 'branch-001',
        type: 'branch',
        name: 'IBK 강남지점',
        address: '서울 강남구 테헤란로 123',
        hours: '평일 09:00~16:00',
        phone: '1566-2566',
        lat: 37.5012,
        lng: 127.0396,
    },
    {
        id: 'atm-001',
        type: 'atm',
        name: 'IBK ATM (강남역 2번출구)',
        address: '서울 강남구 강남대로 396',
        hours: '24시간 운영',
        phone: '1566-2566',
        lat: 37.4979,
        lng: 127.0276,
    },
    {
        id: 'branch-002',
        type: 'branch',
        name: 'IBK 서초지점',
        address: '서울 서초구 서초대로 219',
        hours: '평일 09:00~16:00',
        phone: '1566-2566',
        lat: 37.4887,
        lng: 127.0128,
    },
    {
        id: 'atm-002',
        type: 'atm',
        name: 'IBK ATM (교대역 5번출구)',
        address: '서울 서초구 서초대로 260',
        hours: '평일 07:00~23:00 / 주말 08:00~22:00',
        phone: '1566-2566',
        lat: 37.4932,
        lng: 127.0137,
    },
    {
        id: 'branch-003',
        type: 'branch',
        name: 'IBK 역삼지점',
        address: '서울 강남구 역삼로 180',
        hours: '평일 09:00~16:00',
        phone: '1566-2566',
        lat: 37.5008,
        lng: 127.0367,
    },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const q = searchParams.get('q') || '';

    // TODO: 실제 DB 쿼리 또는 외부 API 호출로 교체
    // const lat = parseFloat(searchParams.get('lat') || '37.5665');
    // const lng = parseFloat(searchParams.get('lng') || '126.9780');

    let result = PLACEHOLDER_BRANCHES;

    if (type !== 'all') {
        result = result.filter((b) => b.type === type);
    }

    if (q) {
        const query = q.toLowerCase();
        result = result.filter((b) => b.name.includes(q) || b.address.includes(q));
    }

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
