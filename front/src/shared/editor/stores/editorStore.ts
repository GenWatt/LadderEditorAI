import { create } from 'zustand';
import { ElementType, type Position, type BaseElement } from '../types/ladderEditorTypes';
import { createHoverSlice, type HoverSlice } from './editorSlices/hoverSlices';
import { createGridSlice, type GridSlice } from './editorSlices/gridSlice';
import { createToolbarSlice, type ToolbarSlice } from './editorSlices/toolbarSlice';
import { createSelectionSlice, type SelectionSlice } from './editorSlices/selectionSlice';
import { createDragSlice, type DragSlice } from './editorSlices/dragSlice';
import { createUtilitySlice, type UtilitySlice } from './editorSlices/utilitySlice';

export interface LadderToolbarTool {
    id: string;
    name: string;
    icon: React.ElementType;
    description: string;
    elementType?: ElementType;
    defaultGridWidth?: number;
    defaultGridHeight?: number;
}

export interface IGridCell {
    id: string;
    position: Position;
    isOccupied: boolean;
    element?: BaseElement | null
}
export interface IGrid {
    width: number;
    height: number;
    cells: IGridCell[][];
}

export interface LadderEditorStore extends HoverSlice, GridSlice, SelectionSlice, ToolbarSlice, DragSlice, UtilitySlice {

}

export const useLadderEditorStore = create<LadderEditorStore>((get, set, api) => ({
    ...createHoverSlice(get, set, api),
    ...createGridSlice(get, set, api),
    ...createToolbarSlice(get, set, api),
    ...createSelectionSlice(get, set, api),
    ...createDragSlice(get, set, api),
    ...createUtilitySlice(get, set, api),
}));