import type { Message } from "@/shared/types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ProcessingSteps } from "./ProcessingSteps";
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useMessageItem from "../viewModels/useMessageItem.hook";

export interface MessageItemProps {
    message: Message;
}

function MessageItem({ message }: MessageItemProps) {
    const { isStreaming, parsedMessage } = useMessageItem({ message });

    return (
        <div
            className={`p-3 rounded-lg ${message.role === 'user'
                ? 'bg-secondary ml-10'
                : 'bg-background mr-10 border'
                } ${isStreaming ? 'border border-blue-300 shadow-sm' : ''}`}
        >
            <p className="text-muted-foreground mb-1">{message.role}</p>

            {parsedMessage.hasStatusMessages && (
                <ProcessingSteps content={parsedMessage.statusContent} />
            )}

            {parsedMessage.contentTokens.length > 0 && (
                <div className={`markdown-content ${isStreaming ? 'streaming-content' : ''}`}>
                    <ReactMarkdown
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <SyntaxHighlighter
                                        // @ts-ignore - Known type issue with react-syntax-highlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {parsedMessage.contentTokens.join('')}
                    </ReactMarkdown>
                </div>
            )}

            {isStreaming && (
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                    <span>Generating response...</span>
                </div>
            )}
        </div>
    )
}

export default MessageItem