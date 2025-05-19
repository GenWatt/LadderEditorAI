import type { StateCreator } from 'zustand';
import type { LadderEditorStore, IGridCell, IGrid } from '../editorStore';
import type { BaseElement, Position } from '../../types/ladderEditorTypes';

export interface GridSlice {
    // Grid properties
    gridSize: number;
    grid: IGrid;
    gridVisible: boolean;

    // Grid actions
    setGridSize: (size: number) => void;
    setGridDimensions: (width: number, height: number) => void;
    setGridVisible: (visible: boolean) => void;
    initializeGrid: () => void;

    // Cell operations
    setCellOccupied: (position: Position, isOccupied: boolean, element?: BaseElement) => void;
    getCellAt: (position: Position) => IGridCell | null;

    // Utility functions
    snapToGrid: (position: Position) => Position;
    positionToGridCoordinates: (position: Position) => { row: number, col: number };
    gridCoordinatesToPosition: (row: number, col: number) => Position;

    getCellPostionById: (id: string) => Position | null;
    getCellByRowCol: (row: number, col: number) => IGridCell | null;

    getPostionByRowCol: (row: number, col: number) => Position;
    getPostion: (row: number) => number;
}

export const createGridSlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    GridSlice
> = (set, get) => ({
    // Grid properties
    gridSize: 40,
    grid: {
        width: 0,
        height: 0,
        cells: []
    },
    gridVisible: true,

    // Grid actions
    setGridSize: (size) => set({ gridSize: size }),

    setGridDimensions: (width, height) => {
        const { gridSize } = get();
        const rows = Math.ceil(height / gridSize);
        const cols = Math.ceil(width / gridSize);

        // Create grid cells
        const cells: IGridCell[][] = [];
        for (let i = 0; i < rows; i++) {
            cells[i] = [];
            for (let j = 0; j < cols; j++) {
                cells[i][j] = {
                    id: `cell-${i}-${j}`,
                    position: { x: j * gridSize, y: i * gridSize },
                    isOccupied: false,
                    element: null
                };
            }
        }

        set({ grid: { width, height, cells } });
    },

    setGridVisible: (visible) => set({ gridVisible: visible }),

    initializeGrid: () => {
        const { grid } = get();
        get().setGridDimensions(grid.width, grid.height);
    },

    // Cell operations
    setCellOccupied: (position, isOccupied, element) => {
        const { row, col } = get().positionToGridCoordinates(position);
        const newGrid = { ...get().grid };

        if (row >= 0 && row < newGrid.cells.length &&
            col >= 0 && col < newGrid.cells[0].length) {
            newGrid.cells[row][col] = {
                ...newGrid.cells[row][col],
                isOccupied,
                element: element || null
            };
            set({ grid: newGrid });
        }
    },

    getCellAt: (position) => {
        const { row, col } = get().positionToGridCoordinates(position);
        const { cells } = get().grid;

        if (row >= 0 && row < cells.length && col >= 0 && col < cells[0].length) {
            return cells[row][col];
        }
        return null;
    },

    // Utility functions
    snapToGrid: (position) => {
        const { gridSize } = get();
        return {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize,
        };
    },

    positionToGridCoordinates: (position) => {
        const { gridSize } = get();
        return {
            row: Math.floor(position.y / gridSize),
            col: Math.floor(position.x / gridSize)
        };
    },

    gridCoordinatesToPosition: (row, col) => {
        const { gridSize } = get();
        return {
            x: col * gridSize,
            y: row * gridSize
        };
    },

    getCellPostionById: (id) => {
        const { grid } = get();
        for (let row = 0; row < grid.cells.length; row++) {
            for (let col = 0; col < grid.cells[row].length; col++) {
                if (grid.cells[row][col].id === id) {
                    return get().gridCoordinatesToPosition(row, col);
                }
            }
        }
        return null;
    },

    getCellByRowCol: (row, col) => {
        const { grid } = get();
        if (row >= 0 && row < grid.cells.length &&
            col >= 0 && col < grid.cells[0].length) {
            return grid.cells[row][col];
        }
        return null;
    },

    getPostionByRowCol: (row, col) => {
        const { gridSize } = get();
        return {
            x: col * gridSize,
            y: row * gridSize
        };
    },
    getPostion: (row) => {
        const { gridSize } = get();
        return row * gridSize;
    }
});