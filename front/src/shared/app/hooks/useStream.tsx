import { useState, useRef, useCallback } from 'react';
import { useChatStore } from '@/features/chat/store/chatStore';

interface StreamOptions {
    endpoint?: string;
    onChunk?: (chunk: string) => void;
}

const createFetchOptions = (prompt: string, url: string) => {
    const payload = url ? { prompt, url } : { prompt };

    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };
};

export function useStream() {
    const [streaming, setStreaming] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const { endpoint: storeEndpoint } = useChatStore();

    const startStream = useCallback(async (
        prompt: string,
        url: string = '',
        options: StreamOptions = {}
    ) => {
        try {
            setStreaming(true);
            setError(null);

            abortControllerRef.current = new AbortController();
            const { signal } = abortControllerRef.current;

            const endpoint = options.endpoint || storeEndpoint;

            const response = await fetch(endpoint, {
                ...createFetchOptions(prompt, url),
                signal,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error('Response body is not readable');

            const decoder = new TextDecoder('utf-8');
            let result = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                result += chunk;

                if (options.onChunk) {
                    options.onChunk(chunk);
                }
            }

            return result;
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                setError(err);
            }
            throw err;
        } finally {
            setStreaming(false);
            abortControllerRef.current = null;
        }
    }, [storeEndpoint]);

    const stopStream = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setStreaming(false);
        }
    }, []);

    return {
        startStream,
        stopStream,
        streaming,
        error
    };
}