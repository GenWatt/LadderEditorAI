import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useChatMessages } from "../hooks/useChatMessages";
import { useChatStore } from "../store/chatStore";
import { z } from "zod";

export interface ChatOptions {
    showUrlInput?: boolean;
    defaultUrl?: string;
    defaultPrompt?: string;
    endpoint?: string;
    initialMessages?: boolean;
}

function useChat(options: ChatOptions = {}) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const {
        messages, stream, isStreaming, stopStream, setInitialMessages
    } = useChatMessages();

    const {
        setPrompt, setUrl, setShowUrlInput, setEndpoint
    } = useChatStore();

    const showUrlInput = options.showUrlInput ?? true;

    useEffect(() => {
        setShowUrlInput(showUrlInput);

        if (options.endpoint) {
            setEndpoint(options.endpoint);
        }

        if (options.initialMessages === false) {
            setInitialMessages([]);
        }
    }, [showUrlInput, options.endpoint, options.initialMessages]);


    const getSchema = () => {
        const baseSchema = {
            prompt: z.string().min(1, { message: "Prompt cannot be empty" })
        };

        if (showUrlInput) {
            return z.object({
                ...baseSchema,
                url: z.string().url({ message: "Please enter a valid URL" }).min(1, "URL is required"),
            });
        }

        return z.object({
            ...baseSchema,
            url: z.string().optional(),
        });
    };

    type ChatFormValues = z.infer<ReturnType<typeof getSchema>>;

    const form = useForm<ChatFormValues>({
        resolver: zodResolver(getSchema()),
        defaultValues: {
            url: options.defaultUrl || 'https://ti.pl/#top',
            prompt: options.defaultPrompt || 'How many articles wikipedia has?'
        }
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (values: ChatFormValues) => {
        await stream(values.prompt, values.url || '');
        form.setValue('prompt', '');
    };

    const sendMessage = async (prompt: string, url: string = '') => {
        form.setValue('prompt', prompt);
        if (showUrlInput && url) {
            form.setValue('url', url);
        }
        return stream(prompt, url);
    };

    useEffect(() => {
        setUrl(form.getValues('url') || '');
        setPrompt(form.getValues('prompt'));
    }, [form.watch('url'), form.watch('prompt')]);

    return {
        form,
        messages,
        bottomRef,
        isStreaming,
        showUrlInput,

        handleSendMessage,
        sendMessage,
        stopStream,
    };
}

export default useChat;