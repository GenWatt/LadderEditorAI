import * as React from "react"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "@/lib/utils"

interface UrlInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string
    isPending?: boolean
}

const UrlInput = React.forwardRef<HTMLInputElement, UrlInputProps>(
    ({ className, label = "URL", isPending = false, id = "url", value, onChange, placeholder = "Enter URL here...", required = false, ...props }, ref) => {
        return (
            <div className={cn("mb-2", className)}>
                <Label htmlFor={id} className="mb-1">
                    {label}
                </Label>
                <Input
                    id={id}
                    ref={ref}
                    required={required}
                    type="url"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={isPending || props.disabled}
                    {...props}
                />
            </div>
        )
    }
)
UrlInput.displayName = "UrlInput"

export { UrlInput }