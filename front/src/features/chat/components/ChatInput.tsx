import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CirclePause, Send } from 'lucide-react';

import type { ChangeEvent, KeyboardEvent } from 'react';
import ModelList from './ModelList';

interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    stopStreaming?: () => void;
    disabled?: boolean;
    isStreaming?: boolean;
}

function ChatInput({ value, onChange, disabled, isStreaming, stopStreaming, ...props }: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
        }
    };

    const isDisabled: boolean = Boolean(
        disabled ||
        !value.trim()
    );

    return (
        <div>
            <div className='flex flex-col space-y-2'>
                <Label htmlFor="prompt">
                    Prompt
                </Label>

                <div className='flex space-x-2 relative'>
                    <Textarea
                        className="resize-none flex-1 pb-12"
                        value={value}
                        onChange={onChange}
                        onKeyDown={handleKeyDown}
                        disabled={disabled || isStreaming}
                        {...props}
                    />

                    <div className='absolute right-0 bottom-0 flex gap-1'>
                        <ModelList />
                        {!isStreaming && <Button
                            disabled={isDisabled}
                        >
                            <Send />
                        </Button>}

                        {isStreaming && <Button
                            variant={'secondary'}
                            onClick={stopStreaming}
                        >
                            <CirclePause />
                        </Button>}
                    </div>
                </div>
            </div>

            <div className="text-xs text-gray-500 mt-1">
                Press Enter to send. Shift+Enter for new line.
            </div>
        </div>
    );
}

export default ChatInput;