import { Group, Rect, Text } from 'react-konva';
import { memo } from 'react';
import type { ContactElement as ContactElementType } from '@/shared/editor/types/ladderEditorTypes';
import { useLadderEditorStore } from '@/shared/editor/stores/editorStore';

interface ContactElementProps {
    element: ContactElementType;
    isSelected: boolean;
    onClick?: () => void;
}

export const ContactElement = memo(function ContactElement({
    element,
    isSelected,
    onClick
}: ContactElementProps) {
    const { gridSize } = useLadderEditorStore();

    return (
        <Group
            x={element.position.x}
            y={element.position.y}
            onClick={onClick}
        >
            <Rect
                width={gridSize}
                height={gridSize}
                fill={isSelected ? 'rgba(0, 100, 255, 0.3)' : 'rgba(255, 255, 255, 0.8)'}
                stroke="#333"
                strokeWidth={1}
            />
            <Text
                text={element.mode}
                fontSize={12}
                fill="#333"
                align="center"
                width={gridSize}
                y={gridSize / 3}
            />
        </Group>
    );
});