import { useLadderStore } from "../stores/ladderStore";
import { TooltipButton } from "@/components/ui/tooltip-button";

import { CircleIcon, SquareIcon, TimerIcon, HashIcon } from "lucide-react";
import { ElementType } from "../types";

export interface LadderToolbarTool {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    elementType?: ElementType;
}

function LadderToolbar() {
    const {
        editor,
    } = useLadderStore();

    const toolbarTools: LadderToolbarTool[] = [
        {
            id: "contact",
            name: "Contact",
            icon: CircleIcon,
            description: "Add a contact element to the ladder diagram.",
            elementType: ElementType.CONTACT
        },
        {
            id: "coil",
            name: "Coil",
            icon: SquareIcon,
            description: "Add a coil element to the ladder diagram.",
            elementType: ElementType.COIL
        },
        {
            id: "timer",
            name: "Timer",
            icon: TimerIcon,
            description: "Add a timer element to the ladder diagram.",
            elementType: ElementType.TIMER
        },
        {
            id: "counter",
            name: "Counter",
            icon: HashIcon,
            description: "Add a counter element to the ladder diagram.",
            elementType: ElementType.COUNTER
        }
    ];

    const handleToolClick = (tool: LadderToolbarTool) => {
        if (tool.elementType) {
            // startDragging(tool.elementType);
        }
    };

    return (
        <div className="p-2 border flex flex-col gap-4">
            {/* Element tools */}
            <div>
                <h3 className="text-sm font-medium mb-2">Elements</h3>
                <div className="flex flex-wrap gap-2">
                    {toolbarTools.map((tool) => (
                        <TooltipButton
                            key={tool.id}
                            tooltipText={tool.description}
                            size="icon"
                            variant={editor.dragInfo.elementType === tool.elementType ? "default" : "outline"}
                            onClick={() => handleToolClick(tool)}
                            className="flex items-center justify-center"
                        >
                            <tool.icon className="w-5 h-5" />
                        </TooltipButton>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LadderToolbar;