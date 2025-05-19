import type { StateCreator } from 'zustand';
import type { IGridCell, LadderEditorStore } from '../editorStore';

export interface HoverSlice {
    hoveredCell: IGridCell | null;
    setHoveredCell: (cell: IGridCell) => void;
    setHoveredCellByRowCol: (row: number, col: number) => void;

    isHoveringOverElement: boolean;
    setHoveringOverElement: (isHovering: boolean) => void;

    hoveredElementId: string | null;
    setHoveredElementId: (elementId: string | null) => void;
}

export const createHoverSlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    HoverSlice
> = (set, get) => ({
    hoveredCell: null,
    setHoveredCell: (cell) => set({ hoveredCell: cell }),
    setHoveredCellByRowCol: (row, col) => {
        const cell = get().grid.cells[row]?.[col] || null;
        set({ hoveredCell: cell });
    },

    isHoveringOverElement: false,
    setHoveringOverElement: (isHovering) => set({ isHoveringOverElement: isHovering }),

    hoveredElementId: null,
    setHoveredElementId: (elementId) => set({ hoveredElementId: elementId }),
});