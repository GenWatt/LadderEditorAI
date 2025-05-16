import { memo } from "react";
import type { IStep } from "../../types";
import StepStatusIcon from "./StepStatusIcon";
import useStep from "../../viewModels/steps/useStep.hook";

export interface StepProps {
    step: IStep;
}

function Step({ step }: StepProps) {
    const { isDataContextLength, isDataCount, stepClass, stepTitle } = useStep({ step });

    return (
        <div className="flex items-center gap-2">
            <StepStatusIcon status={step.status} />

            <div className="flex flex-col">
                <span className={`text-sm font-medium ${stepClass}`}>
                    {stepTitle}
                </span>

                <span className="text-xs text-muted-foreground">{step.message}</span>

                {step.data && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {isDataCount && (
                            <span className="mr-2">Count: {step.data.count}</span>
                        )}

                        {isDataContextLength && (
                            <span>Context: {step.data.context_length} chars</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(Step);