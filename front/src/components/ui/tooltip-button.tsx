import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
} from "@/components/ui/tooltip";

export interface TooltipButtonProps extends ButtonProps {
    tooltipText: string;
    tooltipSide?: "top" | "right" | "bottom" | "left";
    tooltipAlign?: "center" | "start" | "end";
    tooltipClassName?: string;
    tooltipDelayDuration?: number;
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
    ({
        children,
        tooltipText,
        tooltipSide = "top",
        tooltipAlign = "center",
        tooltipClassName,
        tooltipDelayDuration = 200,
        ...props
    }, ref) => {
        return (
            <TooltipProvider delayDuration={tooltipDelayDuration}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button ref={ref} {...props}>
                            {children}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side={tooltipSide}
                        align={tooltipAlign}
                        className={tooltipClassName}
                    >
                        {tooltipText}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
);

TooltipButton.displayName = "TooltipButton";

export { TooltipButton };