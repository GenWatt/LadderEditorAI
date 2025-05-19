import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/app/theme/component/ToggleTheme"
import { PlusCircleIcon } from 'lucide-react'
import SelectMode from "./SelectMode"
import { cn } from "@/lib/utils"
import Logo from '@/assets/images/logo_ladder_editor.png'

export interface IAppbarProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

function Appbar({ children, className, ...props }: IAppbarProps) {
    return (
        <div className={cn('w-screen h-16 bg-background flex items-center justify-between px-4 border-b-2 border-muted', className)} {...props}>
            <div className='flex items-center gap-2 justify-between flex-1'>
                <div className="flex gap-2">
                    <img src={Logo} alt="Logo" className="h-12 w-12 rounded-md" />
                    {children}
                </div>
                <div className="flex gap-2 items-center">
                    <Button>
                        <PlusCircleIcon />
                    </Button>
                    <SelectMode />
                    <ModeToggle />
                </div>
            </div>
        </div>
    )
}

export default Appbar