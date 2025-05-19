import type { StateCreator } from 'zustand';
import type { Position } from '../../types/ladderEditorTypes';
import type { IGridCell, LadderEditorStore } from '../editorStore';

export interface SelectionSlice {
    // Selection state
    selectedCells: IGridCell[];
    isSelecting: boolean;
    selectionStart: Position | null;
    selectionEnd: Position | null;

    // Selection actions
    setSelectedCells: (cells: IGridCell[]) => void;
    startSelection: (position: Position) => void;
    updateSelection: (position: Position) => void;
    endSelection: () => void;
    clearSelection: () => void;

    // Utility functions for selections
    isPositionSelected: (position: Position) => boolean;
    getSelectionBounds: () => { startX: number; startY: number; endX: number; endY: number } | null;
}

export const createSelectionSlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    SelectionSlice
> = (set, get) => ({
    // Selection state
    selectedCells: [],
    isSelecting: false,
    selectionStart: null,
    selectionEnd: null,

    // Selection actions
    setSelectedCells: (cells) => set({ selectedCells: cells }),

    startSelection: (position) => {
        const grid = get().grid;
        if (!grid) return;

        // Find the cell at the starting position
        const cell = get().getCellByRowCol(position.y, position.x);
        if (!cell) return;

        set({
            isSelecting: true,
            selectionStart: position,
            selectionEnd: position,
            selectedCells: [cell]
        });
    },

    updateSelection: (position) => {
        if (!get().isSelecting) return;

        const start = get().selectionStart;
        if (!start) return;

        // Check if the selection end position has changed
        const currentEnd = get().selectionEnd;
        if (currentEnd && currentEnd.x === position.x && currentEnd.y === position.y) {
            return; // No change, prevent infinite loop
        }

        const grid = get().grid;
        if (!grid) return;

        // Calculate bounds before updating state to avoid re-renders
        const startX = Math.min(start.x, position.x);
        const startY = Math.min(start.y, position.y);
        const endX = Math.max(start.x, position.x);
        const endY = Math.max(start.y, position.y);

        const selectedCells: IGridCell[] = [];

        // Collect all cells in the selection area
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const cell = get().getCellByRowCol(y, x);
                if (cell) {
                    selectedCells.push(cell);
                }
            }
        }

        // Update all state in a single operation to prevent multiple rerenders
        set({
            selectionEnd: position,
            selectedCells
        });
    },

    endSelection: () => {
        set({ isSelecting: false });
        // Keep the selected cells
    },

    clearSelection: () => {
        set({
            selectedCells: [],
            isSelecting: false,
            selectionStart: null,
            selectionEnd: null
        });
    },

    // Utility functions
    isPositionSelected: (position) => {
        return get().selectedCells.some(cell => {
            const cellPosition = get().getCellPostionById(cell.id);
            return cellPosition &&
                cellPosition.x === position.x &&
                cellPosition.y === position.y;
        });
    },

    getSelectionBounds: () => {
        const { selectionStart, selectionEnd } = get();

        if (!selectionStart || !selectionEnd) return null;

        return {
            startX: Math.min(selectionStart.x, selectionEnd.x),
            startY: Math.min(selectionStart.y, selectionEnd.y),
            endX: Math.max(selectionStart.x, selectionEnd.x),
            endY: Math.max(selectionStart.y, selectionEnd.y)
        };
    }
});