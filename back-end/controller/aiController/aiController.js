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
        || 'openai/gpt-oss-20b'
    ).trim();
};

const HUGGING_FACE_CHAT_COMPLETIONS_URL = 'https://router.huggingface.co/v1/chat/completions';

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

const extractHfAnswer = (payload) => {
    return String(payload?.choices?.[0]?.message?.content || '').trim();
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

const requestAiWithRetry = async (prompt, model, apiKey, attempts = 2) => {
    let lastError;
    const cleanModel = String(model || '').trim();
    for (let i = 0; i < attempts; i += 1) {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000);

            let response;
            try {
                response = await fetch(HUGGING_FACE_CHAT_COMPLETIONS_URL, {
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
                    signal: controller.signal,
                });
            } catch (error) {
                if (error?.name === 'AbortError') {
                    const err = new Error('Hugging Face request timed out');
                    err.status = 504;
                    err.code = 'HUGGINGFACE_TIMEOUT';
                    throw err;
                }

                const err = new Error(`Hugging Face network request failed: ${error?.cause?.code || error?.code || error?.message || 'unknown network error'}`);
                err.status = 502;
                err.code = error?.cause?.code || error?.code || 'NETWORK_ERROR';
                throw err;
            } finally {
                clearTimeout(timeout);
            }

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = toReadableErrorMessage(payload?.error ?? payload, `Hugging Face request failed: ${response.status}`);
                const err = new Error(message);
                err.status = response.status;
                err.code = payload?.error_type || payload?.code;
                throw err;
            }

            const answer = extractHfAnswer(payload);
            if (!answer) {
                const err = new Error('Empty response returned by Hugging Face chat model');
                err.status = 502;
                err.code = 'EMPTY_AI_RESPONSE';
                throw err;
            }

            return answer;
        } catch (error) {
            lastError = error;
            const status = error?.status || error?.response?.status;
            const isRetryable = status === 429 || status === 500 || status === 502 || status === 503 || status === 504;

            if (!isRetryable || i === attempts - 1) {
                throw error;
            }

            await wait(1200 * (i + 1));
        }
    }

    throw lastError;
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
        if (typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const normalizedQuestion = question.trim();
        const cachedAnswer = getCachedAnswer(normalizedQuestion);
        if (cachedAnswer) {
            return res.json({ answer: cachedAnswer });
        }

        const model = getHuggingFaceModel();
        const prompt = `User question: ${normalizedQuestion}`;
        const answer = await requestAiWithRetry(prompt, model, apiKey);

        setCachedAnswer(normalizedQuestion, answer);

        res.json({ answer, meta: { model } });
    }
    catch (error) {
        console.error('Error asking AI:', error?.status || error?.response?.status, error?.code, error?.message);

        const status = error?.status || error?.response?.status || 500;
        const apiMessage = toReadableErrorMessage(error?.error ?? error?.message, 'Failed to get response from AI');

        if (status === 401) {
            return res.status(401).json({ error: 'Invalid Hugging Face API key or expired token.' });
        }

        if (status === 403) {
            return res.status(403).json({
                error: 'Hugging Face token lacks permission or access to the selected model/provider.',
            });
        }

        if (status === 402) {
            return res.status(402).json({
                error: 'Hugging Face billing or credits are insufficient for this request.',
            });
        }

        if (status === 404) {
            return res.status(404).json({
                error: 'The selected Hugging Face model or provider is unavailable.',
            });
        }

        if (status === 400) {
            return res.status(400).json({
                error: apiMessage || 'Hugging Face rejected the chat completion request.',
            });
        }

        if (status === 429) {
            return res.status(429).json({
                error: 'Hugging Face rate limit reached. Retry later.',
            });
        }

        if (status === 504) {
            return res.status(504).json({
                error: 'Hugging Face request timed out.',
            });
        }

        if (status === 502) {
            return res.status(502).json({
                error: 'Could not connect to Hugging Face or the response was invalid.',
            });
        }

        return res.status(status).json({ error: apiMessage });
    }
}

const aiController = {
    askFromAI,
};

export default aiController;
