import type { StateCreator } from 'zustand';
import type { LadderEditorStore } from '../editorStore';
import { ElementType, type Position } from '../../types/ladderEditorTypes';

export interface DragInfo {
    isDragging: boolean;
    elementType: ElementType | null;
    sourceElementId: string | null;
    startPosition?: Position;
    currentPosition?: Position;
}

export interface DragSlice {
    dragInfo: DragInfo;

    // Actions
    startDrag: (elementType: ElementType | null, sourceElementId?: string | null, startPosition?: Position) => void;
    updateDrag: (currentPosition: Position) => void;
    endDrag: () => void;
    setDragInfo: (dragInfo: DragInfo) => void;

    // Helpers
    isDragging: () => boolean;
}

export const createDragSlice: StateCreator<
    LadderEditorStore,
    [],
    [],
    DragSlice
> = (set, get) => ({
    dragInfo: {
        isDragging: false,
        elementType: null,
        sourceElementId: null,
    },

    startDrag: (elementType, sourceElementId = null, startPosition) => set(() => ({
        dragInfo: {
            isDragging: true,
            elementType,
            sourceElementId,
            startPosition,
            currentPosition: startPosition,
        },
        editorMode: "dragging"
    })),

    updateDrag: (currentPosition) => set((state) => ({
        dragInfo: {
            ...state.dragInfo,
            currentPosition,
        }
    })),

    endDrag: () => set({
        dragInfo: {
            isDragging: false,
            elementType: null,
            sourceElementId: null,
        }
    }),

    setDragInfo: (dragInfo) => set({ dragInfo }),

    isDragging: () => get().dragInfo.isDragging,
});