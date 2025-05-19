import useParser from "@/shared/app/hooks/useParser";
import type { Message } from "@/shared/types";
import { useMemo } from "react";

export interface MessageItemHookProps {
    message: Message;
}

function useMessageItem({ message }: MessageItemHookProps) {
    const { parseMessageContent } = useParser();

    const isStreaming = message.streaming || false;
    const parsedMessage = useMemo(() => {
        return parseMessageContent(message.content);
    }, [message.content, parseMessageContent]);

    return {
        parsedMessage,
        isStreaming,
    };
}

export default useMessageItem