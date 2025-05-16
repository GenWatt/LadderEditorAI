import type { IElement } from "../../types"

export interface ContactProps extends React.HTMLProps<HTMLDivElement> {
    element?: IElement
}

function Contact({ element, ...props }: ContactProps) {
    return (
        element ?
            <div {...props}>
                <p className=' text-center text-white'>{element.variableId}</p>
                <span className={`w-10 h-10 border-2 rounded-full flex ${element.mode === "NC" ? "bg-gray-200" : "bg-white"
                    }`}>

                </span>
            </div> : <div className='w-10 h-10 border-2 rounded-full opacity-40 bg-foreground'></div>
    )
}

export default Contact