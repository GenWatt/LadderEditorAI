import type { KonvaEventObject } from 'konva/lib/Node';
import { Rect } from 'react-konva';
import { type FC, useCallback, memo, useRef, useState } from 'react';
import { useLadderEditorStore } from '@/shared/editor/stores/editorStore';
import throttle from 'lodash/throttle';
import type { Position } from '@/shared/editor/types/ladderEditorTypes';

interface GridInteractionLayerProps {
    width: number;
    height: number;
    cellSize: number;
}

export const GridInteractionLayer: FC<GridInteractionLayerProps> = memo(({
    width,
    height,
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const lastPosition = useRef<Position | null>(null);

    const {
        setHoveredCellByRowCol,
        positionToGridCoordinates,
        startSelection,
        updateSelection,
        endSelection,
        clearSelection,
        isSelecting
    } = useLadderEditorStore();

    const throttledSetHoveredCell = useRef(
        throttle((row: number, col: number) => {
            if (!isSelecting) {
                setHoveredCellByRowCol(row, col);
            }
        }, 32)
    ).current;

    const handleMouseMove = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage();
            if (!stage) return;

            const pos = stage.getPointerPosition();
            if (!pos) return;

            const { row, col } = positionToGridCoordinates({ x: pos.x, y: pos.y });

            if (lastPosition.current?.x === col && lastPosition.current?.y === row) {
                return;
            }

            lastPosition.current = { x: col, y: row };

            if (isDragging) {
                requestAnimationFrame(() => {
                    updateSelection({ x: col, y: row });
                });
            } else {
                throttledSetHoveredCell(row, col);
            }
        },
        [positionToGridCoordinates, throttledSetHoveredCell, isDragging, updateSelection]
    );

    const handleMouseDown = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage();
            if (!stage) return;

            const pos = stage.getPointerPosition();
            if (!pos) return;

            const { row, col } = positionToGridCoordinates({ x: pos.x, y: pos.y });
            lastPosition.current = { x: col, y: row };

            if (!e.evt.shiftKey) {
                clearSelection();
            }

            startSelection({ x: col, y: row });
            setIsDragging(true);
        },
        [positionToGridCoordinates, startSelection, clearSelection]
    );

    const handleMouseUp = useCallback(() => {
        if (isDragging) {
            endSelection();
            setIsDragging(false);
            lastPosition.current = null;
        }
    }, [endSelection, isDragging]);

    const handleMouseLeave = useCallback(() => {
        setHoveredCellByRowCol(-1, -1);

        if (isDragging) {
            endSelection();
            setIsDragging(false);
            lastPosition.current = null;
        }
    }, [setHoveredCellByRowCol, endSelection, isDragging]);

    return (
        <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            listening={true}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            perfectDrawEnabled={false}
        />
    );
});