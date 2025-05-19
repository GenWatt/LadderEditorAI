import type { Message } from "@/shared/types";

export interface ChatError {
    message: string;
}

export interface Model {
    id: string;
    max_tokens: number;
    is_default: boolean;
    name: string;
    description?: string;
}

export interface ChatState {
    messages: Message[];
    error: ChatError | null;
    isLoading: boolean;
    isStreaming: boolean;
    selectedModel?: string;
    availableModels: Model[];
}

export interface AvaliableModels {
    models: Model[];
    defaultModel: string;
}

export interface IStep {
    step: string;
    message: string;
    status: 'loading' | 'complete' | 'error' | 'info';
    data?: Record<string, any>;
}