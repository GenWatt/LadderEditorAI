import type { IElement } from "../../types"

export interface CoilProps extends React.HTMLProps<HTMLDivElement> {
    element?: IElement
}

function Counter({ element, ...props }: CoilProps) {
    return (
        element ? <div {...props}>
            <p className=' text-center text-white'>{element.variableId}</p>
            <span className={`w-10 h-10 border-2 rounded flex bg-foreground`}>

            </span>
        </div> : <div className='w-10 h-10 border-2 rounded-full opacity-40 bg-foreground'></div>
    )
}

export default Counter