import type { ParsedMessage } from "../types";


function useParser() {

    const createParsedMessage = (hasStatusMessages: boolean, statusContent: string, contentTokens: string[]): ParsedMessage => {
        return {
            hasStatusMessages,
            statusContent,
            contentTokens
        };
    }

    const parseMessageContent = (content: string): ParsedMessage => {
        if (!content) {
            return createParsedMessage(false, '', []);
        }

        const lines = content.split('\n\n');
        const statusMessages: string[] = [];
        const contentTokens: string[] = [];

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonContent = line.substring('data: '.length);
                const parsed = JSON.parse(jsonContent);

                if (parsed.type === 'status') {
                    statusMessages.push(line);
                } else if (parsed.type === 'content') {
                    contentTokens.push(parsed.token);
                }

            } else if (line.trim() !== '') {
                contentTokens.push(line);
            }
        }

        return createParsedMessage(statusMessages.length > 0, statusMessages.join('\n'), contentTokens);
    };

    return {
        parseMessageContent
    }
}

export default useParser