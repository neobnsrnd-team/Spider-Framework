// src/app/api/fal/status/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import { getErrorMessage } from '@/lib/api-response';

const FAL_API_KEY = process.env.FAL_API_KEY;

interface PostRequestBody {
    request_id: string;
    model: string;
    customData?: unknown;
}

export async function POST(req: NextRequest) {
    const falApiKey = FAL_API_KEY;
    if (!falApiKey) return NextResponse.json({ error: 'FAL API 키를 찾을 수 없습니다.' }, { status: 403 });

    // FAL 클라이언트 초기화
    fal.config({
        credentials: falApiKey,
    });

    const { request_id, model }: PostRequestBody = await req.json();

    try {
        const result = await fal.queue.status(model, {
            requestId: request_id,
            logs: true,
        });

        return NextResponse.json({ ok: true, result, status: result.status });
    } catch (err: unknown) {
        let message = getErrorMessage(err);

        // FAL AI 구조화 에러 처리 (`body.detail`)
        if (typeof err === 'object' && err !== null && 'body' in err) {
            const body = (err as { body?: { detail?: string } }).body;
            if (body?.detail) {
                message = body.detail;
            }
        }

        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}
