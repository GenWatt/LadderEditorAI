import { Line } from 'react-konva';
import { memo } from 'react';
import type { Position } from '@/shared/editor/types/ladderEditorTypes';
import { useTheme } from '@/app/theme/context/ThemeProvider';

interface WireProps {
    start: Position;
    end: Position;
    color?: string;
    thickness?: number;
}

export const Wire = memo(function Wire({
    start,
    end,
    color,
    thickness = 2
}: WireProps) {
    const { activeColors } = useTheme();
    const wireColor = color || activeColors.chart2;

    return (
        <Line
            points={[start.x, start.y, end.x, end.y]}
            stroke={wireColor}
            strokeWidth={thickness}
            lineCap="round"
            perfectDrawEnabled={false}
            listening={false}
        />
    );
});

interface SegmentedWireProps {
    points: Position[];
    color?: string;
    thickness?: number;
}

export const SegmentedWire = memo(function SegmentedWire({
    points,
    color,
    thickness = 2
}: SegmentedWireProps) {
    const linePoints = points.flatMap(point => [point.x, point.y]);
    const { activeColors } = useTheme();
    const wireColor = color || activeColors.chart2;

    return (
        <Line
            points={linePoints}
            stroke={wireColor}
            strokeWidth={thickness}
            lineCap="round"
            perfectDrawEnabled={false}
            listening={false}
        />
    );
});