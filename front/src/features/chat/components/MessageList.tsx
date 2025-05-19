import { useEffect, useRef } from "react";

import type { Message } from "@/shared/types";
import MessageItem from "./MessageItem";

interface MessageListProps {
    messages: Message[];
    isStreaming?: boolean;
}

function MessageList({ messages }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="space-y-4 overflow-y-auto py-2 flex-1">
            {messages.length ? messages.map((message, index) => {
                return (
                    <MessageItem key={index} message={message} />
                )
            }) : <p className="text-muted-foreground text-sm">Start the conversation!</p>}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;