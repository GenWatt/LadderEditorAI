import { useLadderStore } from '../stores/ladderStore';
import type { IRung } from '../types';
import Element from './Element';

export interface RungProps {
    rung: IRung;
    isClickable?: boolean;
}

function Rung({ rung, isClickable = true }: RungProps) {
    const { id: rungId, elements } = rung;
    const { selection, selectRung } = useLadderStore();
    const isSelected = rungId === selection.selectedRungId;

    const sortedElements = [...elements].sort((a, b) => a.position.x - b.position.x);

    const handleRungClick = (e: React.MouseEvent) => {
        if (!isClickable) return;

        e.stopPropagation();
        selectRung(rungId);
    };

    return (
        <div
            key={rungId}
            className={`relative flex items-center my-4 h-16 ${isClickable ? 'cursor-pointer' : ''}`}
            data-rung-id={rungId}  // Add data attribute for rung identification
            onClick={handleRungClick}
        >
            {/* Left border */}
            <div className={`h-full w-2 ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

            {/* Main rung container with horizontal line */}
            <div className="flex-1 relative">
                {/* Horizontal main line */}
                <div className={`absolute top-1/2 left-0 right-0 h-1 ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>

                {/* Elements positioned on the rung */}
                <div className="relative w-full h-full flex items-center">
                    {sortedElements.map(element => (
                        <Element
                            key={element.id}
                            element={element}
                        />
                    ))}
                </div>
            </div>

            {/* Right border */}
            <div className={`h-full w-2 ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
        </div>
    );
}

export default Rung;