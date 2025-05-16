import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null)

  React.useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement)

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = 'auto'

    const newHeight = textarea.scrollHeight

    textarea.style.height = `${newHeight}px`
  }, [])

  React.useEffect(() => {
    adjustHeight()
  }, [adjustHeight, props.value])

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    adjustHeight()
    props.onInput?.(e)
  }

  return (
    <textarea
      className={cn(
        "flex text-primary min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-hidden resize-none",
        className
      )}
      ref={textareaRef}
      onInput={handleInput}
      rows={1}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }