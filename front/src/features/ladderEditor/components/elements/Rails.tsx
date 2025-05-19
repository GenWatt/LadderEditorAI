// Rails.tsx
import { useTheme } from '@/app/theme/context/ThemeProvider';
import { Shape } from 'react-konva';

export interface RailsProps {
    width: number;
    height: number;
    offset: number;
}

export function Rails({ width, height, offset }: RailsProps) {
    const { activeColors } = useTheme();

    return (
        <Shape
            listening={false}
            sceneFunc={(ctx, shape) => {
                ctx.beginPath();
                ctx.strokeStyle = activeColors.chart5;
                ctx.lineWidth = 3;
                ctx.moveTo(offset + 1, 0);             // left rail
                ctx.lineTo(offset + 1, height);

                ctx.moveTo(width - offset - 2, 0);     // right rail
                ctx.lineTo(width - offset - 2, height);

                ctx.stroke();
                shape.getLayer()!.batchDraw();
            }}
            cached
        />
    );
}
