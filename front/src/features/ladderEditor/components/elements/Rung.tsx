import { Group, Line } from 'react-konva';
import { memo } from 'react';
import { Wire, SegmentedWire } from './Wire';
import { useLadderEditorStore } from '@/shared/editor/stores/editorStore';
import type { IRung, IElement, Branch, Position } from '@/shared/editor/types/ladderEditorTypes';

interface RungProps {
    rung: IRung;
    width: number;
    isSelected?: boolean;
}

export const Rung = memo(function Rung({
    rung,
    width,
    isSelected = false
}: RungProps) {
    const { gridSize } = useLadderEditorStore();

    const startX = 3;
    const endX = width - 3;
    const rungY = rung.position.y;
    console.log('Rung Y:', rungY);

    // Draw the main horizontal wire
    const renderMainWire = () => {
        const elementPositions = rung.branches
            .flatMap(branch => branch.paths)
            .map(element => element.position.x)
            .sort((a, b) => a - b);

        let lastX = startX;
        const wireSegments = [];

        console.log('Element Positions:', rungY);
        for (const posX of elementPositions) {
            if (posX > lastX) {
                console.log('Adding wire segment');
                wireSegments.push(
                    <Wire
                        key={`wire-${lastX}-${posX}`}
                        start={{ x: lastX, y: rungY }}
                        end={{ x: posX - gridSize / 2, y: rungY }}
                    />
                );
            }

            lastX = posX + gridSize / 2;
        }

        console.log('Last X:', lastX);

        if (lastX < endX) {
            console.log('Adding final wire segment');
            wireSegments.push(
                <Wire
                    key={`wire-${lastX}-${endX}`}
                    start={{ x: lastX, y: 0 }}
                    end={{ x: endX, y: 0 }}
                />
            );
        }

        return wireSegments;
    };

    // Render a branch with its wires and elements
    const renderBranch = (branch: Branch) => {
        const { id, start, end, height, paths } = branch;

        const branchPoints = [
            { x: start, y: 0 },             // Starting point on main rung 
            { x: start, y: height },    // Down vertical segment
            { x: end, y: height },      // Horizontal segment
            { x: end, y: 0 }                // Up vertical segment back to main rung
        ];

        console.log('Branch Points:', branchPoints);

        return (
            <Group key={`branch-${id}`}>
                {/* Draw the branch outline */}
                <SegmentedWire
                    points={branchPoints}
                />

                {/* Render branch elements */}
                {paths.map(element => (
                    <Group
                        key={`element-${element.id}`}
                        x={element.position.x}
                        y={element.position.y}
                    >
                        {/* Element placeholder - replace with actual element components */}
                        <Line
                            points={[-gridSize / 2, 0, gridSize / 2, 0]}
                            stroke={isSelected ? "#3b82f6" : "#94a3b8"}
                            strokeWidth={2}
                        />
                    </Group>
                ))}
            </Group>
        );
    };

    const absoluteY = rung.position.y;

    return (
        <Group x={0} y={absoluteY}>

            {/* Main horizontal rung wire */}
            {renderMainWire()}

            {/* All branches for this rung */}
            {rung.branches.map(branch => renderBranch(branch))}
        </Group>
    );
});