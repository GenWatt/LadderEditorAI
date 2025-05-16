export type MessageRole = 'user' | 'assistant';

export interface Message {
    role: MessageRole;
    content: string;
    streaming?: boolean;
}

export interface ParsedMessage {
    hasStatusMessages: boolean;
    statusContent: string;
    contentTokens: string[];
}

export interface StatusMessage {
    type: 'status';
    status: 'start' | 'success' | 'error' | 'info';
    step: string;
    message: string;
    data?: Record<string, any>;
}