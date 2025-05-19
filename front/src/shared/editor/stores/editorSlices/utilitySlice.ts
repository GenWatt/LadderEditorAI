import type { StateCreator } from 'zustand';
import type { Position } from '../../types/ladderEditorTypes';
import type { LadderEditorStore } from '../editorStore';

export interface UtilitySlice {
    // Position and grid utilities
    snapToGrid: (position: Position) => Position;
    positionToGridCoords: (position: Position) => { row: number; col: number };
    gridCoordsToPosition: (row: number, col: number) => Position;

    // Distance/calculation utilities
    getDistance: (pos1: Position, pos2: Position) => number;

    // Boundary checking
    isWithinBounds: (position: Position) => boolean;
}

export const createUtilitySlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    UtilitySlice
> = (set, get) => ({
    snapToGrid: (position) => {
        const { gridSize } = get();
        return {
            x: Math.round(position.x / gridSize) * gridSize,
            y: Math.round(position.y / gridSize) * gridSize,
        };
    },

    positionToGridCoords: (position) => {
        const { gridSize } = get();
        return {
            row: Math.floor(position.y / gridSize),
            col: Math.floor(position.x / gridSize),
        };
    },

    gridCoordsToPosition: (row, col) => {
        const { gridSize } = get();
        return {
            x: col * gridSize,
            y: row * gridSize,
        };
    },

    getDistance: (pos1, pos2) => {
        const dx = pos2.x - pos1.x;
        const dy = pos2.y - pos1.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    isWithinBounds: (position) => {
        const { grid, gridSize } = get();
        const { width, height } = grid;

        return (
            position.x >= 0 &&
            position.y >= 0 &&
            position.x <= width * gridSize &&
            position.y <= height * gridSize
        );
    },

    // isInViewport: (position: Position) => {

    // }
});