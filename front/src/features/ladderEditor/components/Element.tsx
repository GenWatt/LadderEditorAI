import { useLadderStore } from '../stores/ladderStore';
import { ElementType, type IElement } from '../types';
import Coil from './elements/Coil';
import Contact from './elements/Contact';
import Counter from './elements/Counter';
import Timer from './elements/Timer';

export interface ElementProps {
    element: IElement
}

function Element({ element }: ElementProps) {
    let elementContent;
    const { editor } = useLadderStore();

    const handleElementClick = (e: React.MouseEvent, elementId: string) => {
        e.stopPropagation();

        // if (editor.mode === "select") {
        //     selectElement(elementId);
        // } else if (editor.mode === "delete") {
        //     removeElement(elementId);
        // }
    };

    switch (element.type) {
        case ElementType.CONTACT:
            elementContent = <Contact element={element} />;
            break;

        case ElementType.COIL:
            elementContent = <Coil element={element} />;
            break;

        case ElementType.TIMER:
            elementContent = <Timer element={element} />;
            break;

        case ElementType.COUNTER:
            elementContent = <Counter element={element} />;
            break;

        default:
            elementContent = <div>?</div>;
    }

    const isSelected = element.id === useLadderStore.getState().selection.selectedElementId;

    return (
        <div
            key={element.id}
            className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            onClick={(e) => handleElementClick(e, element.id)}
        >
            {elementContent}
        </div>
    );
}

export default Element