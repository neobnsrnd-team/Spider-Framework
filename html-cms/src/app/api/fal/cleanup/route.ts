// src/app/api/fal/cleanup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/api-response';
import { ASSET_UPLOAD_DIR } from '@/lib/env';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function POST(request: NextRequest) {
    try {
        const input: Record<string, string> = await request.json();

        await cleanup(input);

        return NextResponse.json({ ok: true });
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

async function cleanup(input: Record<string, unknown>): Promise<void> {
    for (const name in input) {
        const value = input[name];

        if (typeof value === 'string' && value.includes('amazonaws.com')) {
            // S3 URL은 삭제하지 않음
        } else if (typeof value === 'string') {
            const filename = path.basename(value);
            const inputFilePath = path.resolve(ASSET_UPLOAD_DIR, filename);
            if (!inputFilePath.startsWith(path.resolve(ASSET_UPLOAD_DIR) + path.sep)) continue;

            await fs.access(inputFilePath);
            await fs.unlink(inputFilePath);
        }
    }
}
