// src/app/api/openai/stream/route.ts
import { NextRequest } from 'next/server';

import { errorResponse, getErrorMessage } from '@/lib/api-response';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
    try {
        const url = 'https://api.openai.com/v1/chat/completions';
        const DEFAULT_MODEL = 'gpt-4o-mini';

        const body = await req.json();
        const { question, context, system, functs, model } = body;

        const messages = [
            { role: 'system', content: system },
            { role: 'assistant', content: context || '' },
            { role: 'user', content: question },
        ];

        const openAiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: model || DEFAULT_MODEL,
                messages,
                stream: true,
                stream_options: { include_usage: true },
                functions: functs && functs.length === 0 ? undefined : functs,
            }),
        });

        if (!openAiResponse.ok) {
            return errorResponse('OpenAI API 오류가 발생했습니다.', openAiResponse.status);
        }

        // Create a ReadableStream to forward the OpenAI stream to the client
        const stream = new ReadableStream({
            async start(controller) {
                const reader = openAiResponse.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const { done, value } = await reader.read();

                        if (done) {
                            // Signal end of stream
                            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                            controller.close();
                            break;
                        }

                        const chunkStr = decoder.decode(value, { stream: true });

                        // Split the chunk into lines (streamed data is line-delimited)
                        const lines = chunkStr.split('\n');
                        lines.forEach((line) => {
                            if (line.trim().startsWith('data:')) {
                                controller.enqueue(new TextEncoder().encode(`${line}\n`));
                            }
                        });
                    }
                } catch (err: unknown) {
                    console.error('스트리밍 응답 실패:', err);
                    controller.error(err);
                }
            },
        });

        // Return the stream with appropriate headers
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    } catch (err: unknown) {
        console.error('OpenAI 데이터 요청 오류:', err);
        return errorResponse(getErrorMessage(err), 500);
    }
}
