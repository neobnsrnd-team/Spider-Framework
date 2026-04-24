// src/app/api/openai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { contentBuilderErrorResponse, getErrorMessage } from '@/lib/api-response';

import { OPENAI_API_KEY } from '@/lib/env';

export async function POST(req: NextRequest) {
    try {
        const DEFAULT_MODEL = 'gpt-4o-mini';

        const body = await req.json();
        const { question, context, system, functs = [], model } = body;

        const RESPONSE_ENDPOINT_MODELS = ['gpt-5.1-codex-mini', 'gpt-5.1-codex'];
        const useResponsesEndpoint = RESPONSE_ENDPOINT_MODELS.includes(model);

        const url = useResponsesEndpoint
            ? 'https://api.openai.com/v1/responses'
            : 'https://api.openai.com/v1/chat/completions';

        const messages = [
            { role: 'system', content: system },
            { role: 'assistant', content: context || '' },
            { role: 'user', content: question },
        ];

        const requestBody = useResponsesEndpoint
            ? {
                  model,
                  input: messages,
              }
            : {
                  model: model || DEFAULT_MODEL,
                  messages,
                  functions: functs.length === 0 ? undefined : functs,
              };

        const openAiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!openAiResponse.ok) {
            const errorData = await openAiResponse.json();
            return NextResponse.json({ error: errorData }, { status: openAiResponse.status });
        }

        const data = await openAiResponse.json();

        let answer, usage;

        if (useResponsesEndpoint) {
            // Normalize v1/responses format to match v1/chat/completions
            type ResponseOutputItem = { type: string; role: string; content: { text: string }[] };
            const messageOutput = (data.output as ResponseOutputItem[]).find((item) => item.type === 'message');
            answer = {
                choices: [
                    {
                        message: {
                            role: messageOutput?.role,
                            content: messageOutput?.content[0]?.text,
                        },
                    },
                ],
            };
            usage = data.usage;
        } else {
            const choices = data.choices;
            answer =
                functs.length === 0
                    ? data
                    : choices[0]?.message?.function_call
                      ? choices[0].message.function_call.arguments
                      : choices[0]?.message;
            usage = data.usage;
        }

        return NextResponse.json({ answer, usage });
    } catch (err: unknown) {
        return contentBuilderErrorResponse(getErrorMessage(err));
    }
}
