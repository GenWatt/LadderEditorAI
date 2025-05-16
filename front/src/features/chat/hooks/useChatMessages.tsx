import { useState, useEffect } from "react";
import type { Message } from "@/features/shared/types";
import { useStream } from "@/features/shared/hooks/useStream";
import { useChatStore } from "../store/chatStore";

const DEFAULT_MESSAGES: Message[] = [
    {
        role: "assistant",
        content: "Hello! How can I assist you today?",
    }
];

export function useChatMessages() {
    const [localMessages, setLocalMessages] = useState<Message[]>(DEFAULT_MESSAGES);
    const {
        messages: storeMessages,
        addMessage,
        updateLastMessage,
        setMessages
    } = useChatStore();
    const { startStream, stopStream, streaming } = useStream();

    useEffect(() => {
        if (storeMessages.length === 0) {
            setMessages(localMessages);
        }
    }, []);

    const setInitialMessages = (initialMessages: Message[]) => {
        setLocalMessages(initialMessages);
        setMessages(initialMessages);
    };

    async function streamMessage(prompt: string, url: string) {
        addMessage({
            role: 'user',
            content: prompt
        });

        addMessage({
            role: 'assistant',
            content: ''
        });

        let result = '';
        try {
            await startStream(prompt, url, {
                onChunk: (chunk) => {
                    result += chunk;
                    updateLastMessage(result);
                }
            });
        } catch (error: any) {
            console.error("Error in stream:", error);
            if (error.name !== 'AbortError') {
                updateLastMessage('Error: ' + error?.message);
            }
        }
    }

    return {
        messages: storeMessages.length > 0 ? storeMessages : localMessages,
        isStreaming: streaming,
        stream: streamMessage,
        stopStream,
        setInitialMessages
    };
}