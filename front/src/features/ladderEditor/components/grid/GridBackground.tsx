import { Shape } from 'react-konva';
import { type FC, useCallback, memo } from 'react';
import Konva from 'konva';
import { useTheme } from '@/app/theme/context/ThemeProvider';

interface GridBackgroundProps {
    width: number;
    height: number;
    cellSize: number;
    stroke?: string;
}

export const GridBackground: FC<GridBackgroundProps> = memo(({
    width,
    height,
    cellSize,
    stroke,
}) => {
    const { activeColors } = useTheme();

    const draw = useCallback(
        (ctx: Konva.Context) => {
            const visibleWidth = Math.min(width, window.innerWidth);
            const visibleHeight = Math.min(height, window.innerHeight);

            ctx.beginPath();
            ctx.strokeStyle = stroke || activeColors.muted;
            ctx.lineWidth = 1;

            const startX = 0;
            const startY = 0;
            const endX = visibleWidth;
            const endY = visibleHeight;

            for (let x = startX; x <= endX; x += cellSize) {
                const xPos = Math.floor(x) + 0.5;
                ctx.moveTo(xPos, startY);
                ctx.lineTo(xPos, endY);
            }

            for (let y = startY; y <= endY; y += cellSize) {
                const yPos = Math.floor(y) + 0.5;
                ctx.moveTo(startX, yPos);
                ctx.lineTo(endX, yPos);
            }

            ctx.stroke();
            ctx.closePath();
        },
        [width, height, cellSize, stroke, activeColors.muted]
    );

    return (
        <Shape
            listening={false}
            sceneFunc={draw}
            perfectDrawEnabled={false}
            hitGraphEnabled={false}
            shadowForStrokeEnabled={false}
            cached={true}
            x={0}
            y={0}
            width={width}
            height={height}
        />
    );
});

GridBackground.displayName = 'GridBackground';