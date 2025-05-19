// import { Rect } from 'react-konva';
// import { useTheme } from '@/app/theme/context/ThemeProvider';
// import { useLadderEditorStore, type IGridCell } from '@/shared/editor/stores/editorStore';
// import { useCallback, useState, memo, useRef, useEffect, useMemo } from 'react';
// import debounce from 'lodash/debounce';

// export interface GridCellProps {
//     gridCell: IGridCell;
//     row: number;
//     col: number;
//     size: number;
//     onClick?: (gridCellState: GridCellState) => void;
//     onHover?: (gridCellState: GridCellState) => void;
// }

// export interface GridCellState {
//     isSelected: boolean;
//     isHovered: boolean;
//     gridCell: IGridCell;
//     row: number;
//     col: number;
// }

// const GridCell = memo(function GridCell({
//     gridCell,
//     row,
//     col,
//     onClick,
//     onHover,
//     size,
// }: GridCellProps) {
//     const [isLocalHovered, setIsLocalHovered] = useState(false);

//     const selectedCells = useLadderEditorStore(state => state.selectedCells);
//     const setHoveredCell = useLadderEditorStore(state => state.setHoveredCell);
//     const { activeColors } = useTheme();

//     const isSelected = useMemo(() =>
//         selectedCells?.some(cell => cell.id === gridCell.id) || false,
//         [selectedCells, gridCell.id]);

//     const isHovered = isLocalHovered;

//     const debouncedSetHoveredCell = useRef(
//         debounce((cell: IGridCell | null) => {
//             setHoveredCell(cell);
//         }, 100)
//     ).current;

//     useEffect(() => {
//         return () => {
//             debouncedSetHoveredCell.cancel();
//         };
//     }, [debouncedSetHoveredCell]);

//     const cellColor = isHovered
//         ? activeColors.cardForeground
//         : (isSelected ? activeColors.accent : "transparent");

//     const handleMouseEnter = useCallback(() => {
//         setIsLocalHovered(true);
//         debouncedSetHoveredCell(gridCell);

//         if (onHover) {
//             onHover({
//                 isSelected,
//                 isHovered: true,
//                 gridCell,
//                 row,
//                 col,
//             });
//         }
//     }, [gridCell, row, col, isSelected, onHover, debouncedSetHoveredCell]);

//     const handleMouseLeave = useCallback(() => {
//         setIsLocalHovered(false);
//         debouncedSetHoveredCell(null);
//     }, [debouncedSetHoveredCell]);

//     const handleClick = useCallback(() => {
//         if (onClick) {
//             onClick({
//                 isSelected,
//                 isHovered: isLocalHovered,
//                 gridCell,
//                 row,
//                 col,
//             });
//         }
//     }, [gridCell, row, col, isSelected, isLocalHovered, onClick]);

//     return (
//         <Rect
//             x={gridCell.position.x}
//             y={gridCell.position.y}
//             width={size}
//             height={size}
//             fill={cellColor}
//             stroke={activeColors.border}
//             strokeWidth={1}
//             onClick={handleClick}
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//             perfectDrawEnabled={false}
//             listening={true}
//         />
//     );
// }, (prevProps, nextProps) => {
//     return (
//         prevProps.gridCell.id === nextProps.gridCell.id &&
//         prevProps.size === nextProps.size &&
//         prevProps.row === nextProps.row &&
//         prevProps.col === nextProps.col
//     );
// });

// export default GridCell;