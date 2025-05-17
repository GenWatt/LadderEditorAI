import { useDrag } from 'react-dnd';
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import type { IVariable } from '../../types/variableTypes';
import { useRef } from 'react';

export const DRAG_TYPES = {
    VARIABLE: 'variable'
};

interface DraggableVariableProps {
    variable: IVariable;
    isSelected: boolean;
    onSelect: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function DraggableVariable({
    variable,
    isSelected,
    onSelect,
    onEdit,
    onDelete
}: DraggableVariableProps) {
    // Create a ref that we'll attach to the div
    const elementRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, connectDragSource] = useDrag(() => ({
        type: DRAG_TYPES.VARIABLE,
        item: { variable },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    // Connect the drag source to our ref
    connectDragSource(elementRef);

    return (
        <div
            ref={elementRef}
            className={`flex items-center justify-between py-1.5 px-2 rounded-sm text-sm 
                ${isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-muted cursor-pointer'}
                ${isDragging ? 'opacity-50' : 'opacity-100'}`}
            onClick={() => onSelect(variable.id)}
        >
            <div className="flex-grow truncate pr-2">
                <div className="font-medium">{variable.name}</div>
                <div className="text-xs text-muted-foreground">{variable.address}</div>
            </div>
            <div className="flex shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(variable.id);
                    }}
                >
                    <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(variable.id);
                    }}
                >
                    <Trash className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}

export default DraggableVariable;