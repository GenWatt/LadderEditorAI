import type React from "react"

export interface WebBrowserProps extends React.IframeHTMLAttributes<HTMLIFrameElement> {
    url: string
}

function WebBrowser({ url, ...props }: WebBrowserProps) {
    return (
        <iframe
            src={url}
            className="flex-1 border-none w-full h-full"
            {...props}
        />
    )
}

export default WebBrowser