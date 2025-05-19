import type { StateCreator } from 'zustand';
import { ElementType } from '../../types/ladderEditorTypes';
import { ContactIcon, CoilIcon, CounterIconSvg, TimerIconSvg } from '@/shared/editor/components/ToolbarIcons';
import type { LadderEditorStore, LadderToolbarTool } from '../editorStore';

export interface ToolbarSlice {
    toolbarTools: LadderToolbarTool[];
    selectedTool: LadderToolbarTool | null;
    setSelectedTool: (tool: LadderToolbarTool | null) => void;
}

const toolbarTools: LadderToolbarTool[] = [
    {
        id: "contact",
        name: "Contact",
        icon: ContactIcon,
        description: "Add a contact element to the ladder diagram.",
        elementType: ElementType.CONTACT,
        defaultGridWidth: 1,
        defaultGridHeight: 1
    },
    {
        id: "coil",
        name: "Coil",
        icon: CoilIcon,
        description: "Add a coil element to the ladder diagram.",
        elementType: ElementType.COIL,
        defaultGridWidth: 1,
        defaultGridHeight: 1
    },
    {
        id: "timer",
        name: "Timer",
        icon: TimerIconSvg,
        description: "Add a timer element to the ladder diagram.",
        elementType: ElementType.TIMER,
        defaultGridWidth: 2,
        defaultGridHeight: 1
    },
    {
        id: "counter",
        name: "Counter",
        icon: CounterIconSvg,
        description: "Add a counter element to the ladder diagram.",
        elementType: ElementType.COUNTER,
        defaultGridWidth: 2,
        defaultGridHeight: 1
    }
];

export const createToolbarSlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    ToolbarSlice
> = (set) => ({
    toolbarTools,
    selectedTool: null,
    setSelectedTool: (tool) => {
        set({ selectedTool: tool });

        if (tool && tool.elementType) {
            set({
                dragInfo: {
                    isDragging: false,
                    elementType: tool.elementType,
                    sourceElementId: tool.id
                }
            });
        } else if (!tool) {
            set({
                dragInfo: {
                    isDragging: false,
                    elementType: null,
                    sourceElementId: null
                }
            });
        }
    },
});