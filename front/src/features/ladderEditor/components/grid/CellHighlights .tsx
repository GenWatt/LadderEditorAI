import { useTheme } from '@/app/theme/context/ThemeProvider'
import { useLadderEditorStore, type IGridCell } from '@/shared/editor/stores/editorStore'
import { Rect } from 'react-konva'
import { memo, useCallback } from 'react'

const OFFSET = 1

const CellHighlights = memo(function CellHighlights() {
    // Use selective store subscription to avoid unnecessary re-renders
    const hoveredCell = useLadderEditorStore(state => state.hoveredCell)
    const selectedCells = useLadderEditorStore(state => state.selectedCells)
    const gridSize = useLadderEditorStore(state => state.gridSize)
    const { activeColors } = useTheme()

    // Create a shared render function for cell highlights
    const renderCell = useCallback((cell: IGridCell, key: string, color = activeColors.accent) => (
        <Rect
            key={key}
            x={cell.position.x + OFFSET}
            y={cell.position.y + OFFSET}
            width={gridSize - OFFSET * 2}
            height={gridSize - OFFSET * 2}
            fill={color}
            listening={false}
            perfectDrawEnabled={false}
            shadowForStrokeEnabled={false}
            hitGraphEnabled={false}
        />
    ), [gridSize, activeColors.accent])

    // If there's nothing to render, return null to save render cycles
    if (!hoveredCell && selectedCells.length === 0) {
        return null
    }

    // Filter out off-screen cells (optional - depends on your implementation)
    // const visibleCells = selectedCells.filter(cell => isInViewport(cell.position))

    return (
        <>
            {selectedCells.map(cell =>
                renderCell(cell, `selected-${cell.id}`)
            )}

            {hoveredCell && !selectedCells.some(cell => cell.id === hoveredCell.id) &&
                renderCell(hoveredCell, 'hovered', activeColors.cardForeground)
            }
        </>
    )
})

export default CellHighlights