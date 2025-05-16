import type { IElement } from "../../types"

export interface TimerProps extends React.HTMLProps<HTMLDivElement> {
    element?: IElement
}

function Timer({ element, ...props }: TimerProps) {
    return (
        element ? <div {...props}>
            <p className=' text-center text-white'>{element.variableId}</p>
            <span className={`w-10 h-10 border-2 flex bg-foreground`}>

            </span>
        </div> : <div className='w-10 h-10 border-2 rounded-full opacity-40 bg-foreground'></div>
    )
}

export default Timer