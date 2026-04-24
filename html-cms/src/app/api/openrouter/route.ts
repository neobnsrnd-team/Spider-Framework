// src/app/api/openrouter/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { contentBuilderErrorResponse, getErrorMessage } from '@/lib/api-response';

import { OPENROUTER_API_KEY } from '@/lib/env';

export async function POST(req: NextRequest) {
    try {
        const url = 'https://openrouter.ai/api/v1/chat/completions';
        const DEFAULT_MODEL = 'openai/gpt-4o-mini';
        const DEFAULT_TEMPERATURE = 0.6;
        const DEFAULT_TOP_P = 0.9;
        const DEFAULT_NUM = 1;

        const body = await req.json();
        const { question, context, system, functs = [], temperature, topP, num, model } = body;

        const messages = [
            { role: 'system', content: system },
            { role: 'assistant', content: context || '' },
            { role: 'user', content: question },
        ];

        try {
            if (functs.length > 0) {
                // --- Function Calling 처리 ---

                const tools = [
                    {
                        type: 'function',
                        function: {
                            ...functs[0],
                        },
                    },
                ];

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: 'anthropic/claude-3.5-sonnet',
                        // Function Calling 지원 모델:
                        // - anthropic/claude-3.5-sonnet
                        // - qwen/qwen-2.5-72b-instruct
                        messages,
                        temperature: parseFloat(temperature) || DEFAULT_TEMPERATURE,
                        top_p: parseFloat(topP) || DEFAULT_TOP_P,
                        n: parseInt(num) || DEFAULT_NUM,
                        tools,
                    }),
                });

                const data = await response.json();

                if (data && data.error && data.error.message) {
                    return contentBuilderErrorResponse(data.error.message);
                }

                const answer =
                    functs.length === 0
                        ? data
                        : data.choices[0].message.tool_calls
                          ? data.choices[0].message.tool_calls[0].function.arguments
                          : data.choices[0].message;
                const usage = data.usage;

                return NextResponse.json({ answer, usage });
            } else {
                // --- 콘텐츠 생성 처리 ---

                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    },
                    body: JSON.stringify({
                        model: model || DEFAULT_MODEL,
                        messages,
                        temperature: parseFloat(temperature) || DEFAULT_TEMPERATURE,
                        top_p: parseFloat(topP) || DEFAULT_TOP_P,
                        n: parseInt(num) || DEFAULT_NUM,
                    }),
                });

                const data = await response.json();
                const answer = data;
                const usage = data.usage;

                return NextResponse.json({ answer, usage });
            }
        } catch (err: unknown) {
            return contentBuilderErrorResponse(getErrorMessage(err));
        }
    } catch (err: unknown) {
        console.error('OpenRouter 요청 실패:', err);
        return contentBuilderErrorResponse(getErrorMessage(err));
    }
}
