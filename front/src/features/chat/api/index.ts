import axios from 'axios';
import type { AvaliableModels } from '../types';

export const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:5000';

export const chatAxiosInstance = axios.create({
    baseURL: CHAT_API_URL,
    timeout: 60000,
});

export const sendPromptPOST = async (prompt: string, url?: string, model?: string) => {
    const response = await chatAxiosInstance.post('/api/chat', {
        prompt,
        url,
        model
    });
    return response.data;
};

export const getAvailableModels = async (): Promise<AvaliableModels> => {
    const response = await chatAxiosInstance.get('/api/available-models');
    return response.data;
};