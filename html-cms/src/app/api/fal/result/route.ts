// src/app/api/fal/result/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { fal } from '@fal-ai/client';
import axios from 'axios';
import path from 'path';
import fs from 'fs/promises';

import { getErrorMessage } from '@/lib/api-response';
import { ASSET_UPLOAD_DIR, ASSET_BASE_URL } from '@/lib/env';

const FAL_API_KEY = process.env.FAL_API_KEY;
const LOCAL_SAVE = true;

interface CustomData {
    folderPath?: string;
    [key: string]: unknown; // allow additional fields
}

type OutputType = { entries: { url: string; fileUrl: string }[] } | string | unknown;

interface PostRequestBody {
    request_id: string;
    model: string;
    customData?: CustomData;
}

export async function POST(req: NextRequest) {
    const falApiKey = FAL_API_KEY;
    if (!falApiKey) return NextResponse.json({ error: 'FAL API 키를 찾을 수 없습니다.' }, { status: 403 });

    // FAL 클라이언트 초기화
    fal.config({
        credentials: falApiKey,
    });

    const { request_id, model, customData }: PostRequestBody = await req.json();

    const folderPath = customData?.folderPath ?? '';

    try {
        const result = await fal.queue.result(model, {
            requestId: request_id,
            // logs: true
        });

        let output: OutputType;

        if (result.data.images) {
            const entries: { url: string; fileUrl: string }[] = [];

            for (const item of result.data.images) {
                const fileUrl = item.url;
                let extension: string;
                let filename: string;
                let newFileUrl: string;

                if (fileUrl.includes('base64')) {
                    extension = item.content_type === 'image/jpeg' ? 'jpg' : 'png';
                    filename = `${generateRandomFileName()}.${extension}`;

                    const imageData = fileUrl.split(',')[1];

                    if (LOCAL_SAVE) {
                        const filePath = path.resolve(ASSET_UPLOAD_DIR, folderPath, filename);
                        await fs.writeFile(filePath, imageData);
                        newFileUrl = `${ASSET_BASE_URL.replace(/\/$/, '')}/${path.posix.join(folderPath, filename)}`;
                    } else {
                        // S3 저장 시 아래 주석 해제
                        // newFileUrl = await saveFileToS3(folderPath, filename, imageData);
                        newFileUrl = '';
                    }
                } else {
                    extension = getFileExtension(fileUrl);
                    filename = `${generateRandomFileName()}.${extension}`;

                    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

                    if (LOCAL_SAVE) {
                        const fileData = Buffer.from(response.data);
                        const filePath = path.resolve(ASSET_UPLOAD_DIR, folderPath, filename);
                        await fs.writeFile(filePath, fileData);
                        newFileUrl = `${ASSET_BASE_URL.replace(/\/$/, '')}/${path.posix.join(folderPath, filename)}`;
                    } else {
                        // S3 저장 시 아래 주석 해제
                        // newFileUrl = await saveFileToS3(folderPath, filename, response.data);
                        newFileUrl = '';
                    }
                }

                entries.push({
                    url: newFileUrl,
                    fileUrl,
                });
            }

            output = { entries };
        } else if (result.data.image || result.data.audio || result.data.audio_file || result.data.video) {
            let fileUrl = '';
            if (result.data.image) fileUrl = result.data.image.url;
            if (result.data.audio) {
                if (Array.isArray(result.data.audio)) {
                    fileUrl = result.data.audio[0].url; // 첫 번째 항목 사용
                } else {
                    fileUrl = result.data.audio.url;
                }
            }
            if (result.data.audio_file) fileUrl = result.data.audio_file.url;
            if (result.data.video) fileUrl = result.data.video.url;

            let filename = fileUrl.split('/').pop() || 'file';
            filename = shortName(filename);

            const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

            let newFileUrl: string;

            if (LOCAL_SAVE) {
                const fileData = Buffer.from(response.data);
                const filePath = path.resolve(ASSET_UPLOAD_DIR, folderPath, filename);
                await fs.writeFile(filePath, fileData);
                newFileUrl = `${ASSET_BASE_URL.replace(/\/$/, '')}/${path.posix.join(folderPath, filename)}`;
            } else {
                // S3 저장 시 아래 주석 해제
                // newFileUrl = await saveFileToS3(folderPath, filename, response.data);
                newFileUrl = '';
            }

            const entries = [
                {
                    url: newFileUrl,
                    fileUrl,
                },
            ];
            output = { entries };
        } else if (result.data.output) {
            output = result.data.output;
        } else {
            output = Object.values(result.data)[0] || '';
        }

        return NextResponse.json({ ok: true, data: output, result }, { status: 200 });
    } catch (err: unknown) {
        return NextResponse.json({ ok: false, error: getErrorMessage(err) }, { status: 500 });
    }
}

function shortName(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase() || 'dat';
    const randomName = generateRandomFileName();
    return `${randomName}.${extension}`;
}

function getFileExtension(url: string): string {
    const pathname = new URL(url).pathname;
    return pathname.split('.').pop()?.toLowerCase() || 'dat';
}

function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function generateRandomFileName(s?: string): string {
    return s ? `${s}-${generateRandomString(5)}` : `ai-${generateRandomString(5)}`;
}
