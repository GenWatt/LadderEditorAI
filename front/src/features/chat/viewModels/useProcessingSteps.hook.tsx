import type { StatusMessage } from "@/features/shared/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { IStep } from "../types";

export interface ProcessingStepsPropsHook {
    content: string;
}

function useProcessingSteps({ content }: ProcessingStepsPropsHook) {

    const handleLine = (line: string) => {
        let cleanLine = line.trim();

        cleanLine = cleanLine.substring('data: '.length).trim();

        try {
            const message = JSON.parse(cleanLine) as StatusMessage;

            if (message.type !== 'status' || !message.status || !message.step || !message.message) {
                return null;
            }

            let uiStatus: 'loading' | 'complete' | 'error' | 'info';
            switch (message.status) {
                case 'start':
                    uiStatus = 'loading';
                    break;
                case 'success':
                    uiStatus = 'complete';
                    break;
                case 'error':
                    uiStatus = 'error';
                    break;
                case 'info':
                    uiStatus = 'info';
                    break;
                default:
                    uiStatus = 'loading';
            }

            return {
                step: message.step,
                message: message.message,
                status: uiStatus,
                data: message.data
            };
        } catch (e) {
            console.error("Error parsing line:", line, e);
            return null;
        }
    };

    const getStepsFromContent = (content: string) => {
        if (!content) return [];

        const lines = content.split(/\n\n|\n/);
        const statusMessages: IStep[] = [];
        const stepTracker: Record<string, IStep> = {};

        for (const line of lines) {
            const result = handleLine(line);

            if (result) {
                stepTracker[result.step] = result;
            }
        }

        Object.values(stepTracker).forEach(step => {
            statusMessages.push(step);
        });

        console.log("Parsed steps:", statusMessages);

        return statusMessages;
    };

    const steps = useMemo(() => getStepsFromContent(content), [content]);

    const latestStep = steps[steps.length - 1];

    const stepClassName = cn(
        "flex items-center justify-between",
        latestStep.status === 'loading' ? 'text-blue-500' :
            latestStep.status === 'error' ? 'text-red-500' :
                latestStep.status === 'info' ? 'text-yellow-500' : 'text-green-500'
    );

    const stepTitle = latestStep.status.charAt(0).toUpperCase() + latestStep.status.slice(1);

    return {
        stepClassName,
        stepTitle,
        latestStep,
        steps
    };
}

export default useProcessingSteps