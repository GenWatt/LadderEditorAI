import { cn } from "@/lib/utils";
import { useMemo } from "react";
import type { IStep } from "../../types";

export interface StepPropsHook {
    step: IStep
}

function useStep({ step }: StepPropsHook) {
    const stepClass = useMemo(() => {
        return cn(
            "flex items-center gap-2",
            step.status === 'loading' ? 'text-blue-500' :
                step.status === 'error' ? 'text-red-500' :
                    step.status === 'info' ? 'text-yellow-500' : ''
        );
    }, [step.status]);

    const stepTitle = useMemo(() => {
        return step.step.charAt(0).toUpperCase() + step.step.slice(1);
    }, [step.step]);

    const isDataCount = useMemo(() => {
        return step.data && step.data.count !== undefined;
    }, [step.data]);

    const isDataContextLength = useMemo(() => {
        return step.data && step.data.context_length !== undefined;
    }, [step.data]);

    return {
        stepClass,
        stepTitle,
        isDataCount,
        isDataContextLength,
    }
}

export default useStep