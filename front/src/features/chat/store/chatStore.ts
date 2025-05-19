import { create } from 'zustand';
import type { Message } from "@/shared/types";

interface ChatState {
    url: string;
    prompt: string;
    showUrlInput: boolean;
    endpoint: string;
    messages: Message[];
    setUrl: (url: string) => void;
    setPrompt: (prompt: string) => void;
    setShowUrlInput: (show: boolean) => void;
    setEndpoint: (endpoint: string) => void;
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateLastMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    url: '',
    prompt: '',
    showUrlInput: true,
    endpoint: 'http://localhost:5000/api/stream-scraper',
    messages: [],

    setUrl: (url) => set({ url }),
    setPrompt: (prompt) => set({ prompt }),
    setShowUrlInput: (show) => set({ showUrlInput: show }),
    setEndpoint: (endpoint) => set({ endpoint }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
    updateLastMessage: (content) => set((state) => {
        const updatedMessages = [...state.messages];
        if (updatedMessages.length > 0) {
            updatedMessages[updatedMessages.length - 1] = {
                ...updatedMessages[updatedMessages.length - 1],
                content
            };
        }
        return { messages: updatedMessages };
    })
}));