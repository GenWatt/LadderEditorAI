import { VariableType } from "../../types/variableTypes"
import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface VariablesSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    onValueChange?: (value: VariableType) => void;
    defaultValue?: VariableType;
    value?: VariableType;
    placeholder?: string;
    disabled?: boolean;
    triggerClassName?: string;
    contentClassName?: string;
    itemClassName?: string;
}

export const VariablesSelect: React.FC<VariablesSelectProps> = ({
    onValueChange,
    defaultValue,
    value,
    placeholder = "Select variable type",
    disabled,
    className,
    triggerClassName,
    contentClassName,
    itemClassName,
    ...props
}) => {
    return (
        <div className={cn("variable-select-container", className)} {...props}>
            <Select
                onValueChange={(value) => onValueChange?.(value as VariableType)}
                defaultValue={defaultValue}
                value={value}
                disabled={disabled}
            >
                <SelectTrigger className={triggerClassName}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className={contentClassName}>
                    {Object.values(VariableType).map((type) => (
                        <SelectItem key={type} value={type} className={itemClassName}>
                            {type}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};