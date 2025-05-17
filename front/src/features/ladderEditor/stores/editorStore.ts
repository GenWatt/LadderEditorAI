import { create } from 'zustand';
import { ElementType, type Position } from '../types';
import { CircleIcon, SquareIcon, TimerIcon, HashIcon } from 'lucide-react';

export interface LadderToolbarTool {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    elementType?: ElementType;
}

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

export interface LadderEditorStore {
    // toolbar
    toolbarTools: LadderToolbarTool[];
    selectedTool: LadderToolbarTool | null;
    setSelectedTool: (tool: LadderToolbarTool | null) => void;

    // dragging
    gridSize: number;
    setGridSize: (size: number) => void;
    snapToRung: (position: Position) => { x: number; y: number };
}


export const useLadderEditorStore = create<LadderEditorStore>((set, get) => ({
    // toolbar

    toolbarTools: toolbarTools,
    selectedTool: null,
    setSelectedTool: (tool) => set({ selectedTool: tool }),

    // dragging
    gridSize: 20,
    setGridSize: (size) => set({ gridSize: size }),
    snapToRung: (position) => {
        const { gridSize } = get();
        return {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize,
        };
    },
}));