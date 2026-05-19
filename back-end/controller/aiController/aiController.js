const normalizeApiKey = (rawKey = '') => {
    return String(rawKey).trim().replace(/^['\"]|['\"]$/g, '');
};

const getHuggingFaceApiKey = () => {
    return normalizeApiKey(
        process.env.HUGGINGFACE_API_KEY
        || process.env.HF_API_KEY
    );
};

const getHuggingFaceModel = () => {
    return String(
        process.env.HUGGINGFACE_MODEL
        || process.env.HF_MODEL
        || 'Qwen/Qwen2.5-7B-Instruct'
    ).trim();
};

const getHuggingFaceProvider = () => {
    return String(
        process.env.HUGGINGFACE_PROVIDER
        || process.env.HF_PROVIDER
        || 'hf-inference'
    ).trim();
};

const getRouterUrls = () => {
    const provider = getHuggingFaceProvider();
    const explicit = String(process.env.HUGGINGFACE_ROUTER_URL || '').trim();
    const providerUrl = `https://router.huggingface.co/${provider}/v1/chat/completions`;
    const legacyUrl = 'https://router.huggingface.co/v1/chat/completions';
    return Array.from(new Set([explicit, providerUrl, legacyUrl].filter(Boolean)));
};

const getCandidateModels = () => {
    const configured = getHuggingFaceModel();
    const defaults = [
        'Qwen/Qwen2.5-7B-Instruct',
        'meta-llama/Llama-3.1-8B-Instruct',
        'mistralai/Mistral-7B-Instruct-v0.3',
        'HuggingFaceTB/SmolLM3-3B',
    ];

    return Array.from(new Set([configured, ...defaults].filter(Boolean)));
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const answerCache = new Map();
const ANSWER_TTL_MS = 10 * 60 * 1000;

const getCachedAnswer = (question) => {
    const key = question.trim().toLowerCase();
    const cached = answerCache.get(key);
    if (!cached) return null;
    if (cached.expiresAt < Date.now()) {
        answerCache.delete(key);
        return null;
    }
    return cached.answer;
};

const setCachedAnswer = (question, answer) => {
    const key = question.trim().toLowerCase();
    answerCache.set(key, {
        answer,
        expiresAt: Date.now() + ANSWER_TTL_MS,
    });
};

const getRateLimitFallbackAnswer = (question) => {
    const q = String(question || '').toLowerCase();

    if (q.includes('brake')) {
        return 'Quick check: avoid high-speed driving, inspect brake fluid level, and listen for grinding/squealing. If pedal feels soft or car pulls to one side, get immediate workshop inspection.';
    }
    if (q.includes('engine') || q.includes('knock') || q.includes('noise')) {
        return 'Start with basics: check engine oil level/quality, coolant level, and dashboard warning lights. Avoid hard acceleration until diagnosed. If knocking persists, schedule inspection soon to prevent engine damage.';
    }
    if (q.includes('battery') || q.includes('start')) {
        return 'Check battery terminals for corrosion, ensure headlights are not dim, and try jump-start if needed. If issue repeats, battery/alternator test is recommended.';
    }
    if (q.includes('ac') || q.includes('cooling')) {
        return 'For AC/cooling issues, verify coolant level, inspect for leaks, and confirm radiator fan operation. If temperature rises in traffic, stop and let engine cool before driving further.';
    }

    return 'Temporary AI limit reached. Basic advice: check dashboard warning lights, fluid levels (engine oil, coolant, brake fluid), tyre pressure, and unusual sounds/smells. Avoid long/high-speed trips until inspected by a mechanic.';
};

const extractHfAnswer = (payload) => {
    if (Array.isArray(payload) && payload.length > 0) {
        const first = payload[0];
        if (typeof first?.generated_text === 'string') return first.generated_text.trim();
        if (typeof first?.summary_text === 'string') return first.summary_text.trim();
    }

    if (typeof payload?.generated_text === 'string') return payload.generated_text.trim();
    if (typeof payload?.summary_text === 'string') return payload.summary_text.trim();

    return '';
};

const toReadableErrorMessage = (value, fallback = 'Unexpected API error') => {
    if (typeof value === 'string' && value.trim()) return value;
    if (!value) return fallback;
    if (typeof value === 'object') {
        if (typeof value.message === 'string' && value.message.trim()) return value.message;
        if (typeof value.error === 'string' && value.error.trim()) return value.error;
        try {
            return JSON.stringify(value);
        } catch {
            return fallback;
        }
    }
    return String(value);
};

const isProviderPermissionError = (status, message) => {
    const text = String(message || '').toLowerCase();
    if (status !== 401 && status !== 403) return false;
    return text.includes('insufficient permissions')
        || text.includes('inference providers')
        || text.includes('on behalf of user');
};

const isModelProviderMismatch = (status, message) => {
    const text = String(message || '').toLowerCase();
    if (status !== 400) return false;
    return text.includes('model not supported by provider')
        || text.includes('not supported by provider');
};

const isNotChatModelError = (status, message) => {
    const text = String(message || '').toLowerCase();
    if (status !== 400) return false;
    return text.includes('not a chat model')
        || text.includes('is not a chat model');
};

const requestViaClassicInference = async (prompt, model, apiKey) => {
    const url = `https://api-inference.huggingface.co/models/${model}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true },
            parameters: {
                return_full_text: false,
                max_new_tokens: 220,
                temperature: 0.4,
            },
        }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const err = new Error(toReadableErrorMessage(payload?.error ?? payload, `Hugging Face request failed: ${response.status}`));
        err.status = response.status;
        err.code = payload?.error_type || payload?.code;
        throw err;
    }

    const answer = extractHfAnswer(payload);
    if (!answer) {
        const err = new Error('Empty response returned by Hugging Face model');
        err.status = 502;
        throw err;
    }

    return answer;
};

const requestAiWithRetry = async (prompt, model, apiKey, attempts = 2) => {
    let lastError;
    const cleanModel = String(model || '').trim();
    const routerUrls = getRouterUrls();

    for (let i = 0; i < attempts; i += 1) {
        try {
            let lastRouterError = null;
            for (const url of routerUrls) {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: cleanModel,
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant for a car repair service. Keep answers concise and practical.' },
                            { role: 'user', content: prompt },
                        ],
                        max_tokens: 220,
                        temperature: 0.4,
                    }),
                });

                const payload = await response.json().catch(() => ({}));
                if (!response.ok) {
                    const message = toReadableErrorMessage(payload?.error ?? payload, `Hugging Face request failed: ${response.status}`);
                    if (isProviderPermissionError(response.status, message) || response.status === 404) {
                        return await requestViaClassicInference(prompt, cleanModel, apiKey);
                    }
                    if (isNotChatModelError(response.status, message)) {
                        return await requestViaClassicInference(prompt, cleanModel, apiKey);
                    }
                    if (isModelProviderMismatch(response.status, message)) {
                        lastRouterError = new Error(message);
                        lastRouterError.status = response.status;
                        continue;
                    }
                    const err = new Error(message);
                    err.status = response.status;
                    err.code = payload?.error_type || payload?.code;
                    throw err;
                }

                const answer = String(payload?.choices?.[0]?.message?.content || '').trim() || extractHfAnswer(payload);
                if (!answer) {
                    const err = new Error('Empty response returned by Hugging Face model');
                    err.status = 502;
                    throw err;
                }

                return answer;
            }

            if (lastRouterError) {
                return await requestViaClassicInference(prompt, cleanModel, apiKey);
            }

            const noResponseErr = new Error('No Hugging Face router URL returned a response');
            noResponseErr.status = 502;
            throw noResponseErr;
        } catch (error) {
            lastError = error;
            const status = error?.status || error?.response?.status;
            const isRetryable = status === 408 || status === 429 || status === 500 || status === 502 || status === 503;

            if (!isRetryable || i === attempts - 1) {
                throw error;
            }

            await wait(1200 * (i + 1));
        }
    }

    throw lastError;
};

const requestWithModelFallback = async (prompt, apiKey) => {
    const models = getCandidateModels();
    let lastError;
    const attempted404Models = [];

    for (const model of models) {
        try {
            const answer = await requestAiWithRetry(prompt, model, apiKey);
            return { answer, model };
        } catch (error) {
            lastError = error;
            const status = error?.status || error?.response?.status;
            if (status === 404) {
                attempted404Models.push(model);
                continue;
            }
            throw error;
        }
    }

    if (attempted404Models.length > 0) {
        const err = new Error(`Hugging Face request failed: 404 (models not found: ${attempted404Models.join(', ')})`);
        err.status = 404;
        throw err;
    }

    throw lastError || new Error('No available Hugging Face model responded successfully');
};

export const askFromAI = async (req, res) => {
    try {
        const apiKey = getHuggingFaceApiKey();
        if (!apiKey) {
            return res.status(500).json({ error: 'HUGGINGFACE_API_KEY is not configured' });
        }

        if (!apiKey.startsWith('hf_')) {
            return res.status(500).json({ error: 'HUGGINGFACE_API_KEY appears invalid. Use a valid Hugging Face key.' });
        }

        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const cachedAnswer = getCachedAnswer(question);
        if (cachedAnswer) {
            return res.json({ answer: cachedAnswer });
        }

        const prompt = `User question: ${question}`;
        const { answer, model } = await requestWithModelFallback(prompt, apiKey);

        setCachedAnswer(question, answer);

        res.json({ answer, meta: { model } });
    }
    catch (error) {
        console.error('Error asking AI:', error?.status || error?.response?.status, error?.code, error?.message);

        const status = error?.status || error?.response?.status || 500;
        const apiMessage = toReadableErrorMessage(error?.error ?? error?.message, 'Failed to get response from AI');

        if (status === 401) {
            return res.status(401).json({ error: 'Invalid Hugging Face API key. Please update HUGGINGFACE_API_KEY in back-end/.env' });
        }

        if (status === 403) {
            const text = String(apiMessage || '').toLowerCase();
            if (text.includes('inference providers') || text.includes('insufficient permissions')) {
                return res.status(403).json({
                    error: 'Your Hugging Face token lacks Inference Providers permission. Create/update token with that permission, or use a token allowed for classic Inference API.',
                });
            }
        }

        if (status === 429) {
            const fallback = getRateLimitFallbackAnswer(req?.body?.question);
            return res.json({ answer: fallback, meta: { source: 'fallback', reason: 'rate_limited' } });
        }

        return res.status(status).json({ error: apiMessage });
    }
}

const aiController = {
    askFromAI,
};

export default aiController;
