import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { UrlInput } from '@/components/ui/url-input';
import { FormField, FormItem, FormControl, FormMessage, Form } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import useChat, { type ChatOptions } from '../viewModels/useChat.hook';

interface ChatProps extends ChatOptions {
    className?: string;
}

function Chat({ className, ...options }: ChatProps) {
    const {
        bottomRef,
        form,
        handleSendMessage,
        isStreaming,
        messages,
        stopStream,
        showUrlInput
    } = useChat(options);

    return (
        <div className={`flex flex-col h-full ${className || ''}`}>
            <ScrollArea className="px-4 h-full overflow-hidden ">
                <MessageList messages={messages} isStreaming={isStreaming} />
                <div ref={bottomRef} />
            </ScrollArea>

            <div className='bg-secondary/30 p-2 rounded-lg mt-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSendMessage)}>
                        {showUrlInput && (
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <UrlInput
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="prompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <ChatInput
                                            {...field}
                                            isStreaming={isStreaming}
                                            disabled={isStreaming}
                                            stopStreaming={stopStream}
                                            placeholder="Type your message here..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default Chat;