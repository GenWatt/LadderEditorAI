import { useMemo, useRef, useState, useEffect } from 'react';
import { useLadderStore } from '../stores/ladderStore';
import Contact from './elements/Contact';
import Coil from './elements/Coil';
import Timer from './elements/Timer';
import Counter from './elements/Counter';
import { ElementType } from '../types';

export interface GhostElementProps {
    mousePosition: { x: number; y: number };
}

function GhostElement({ mousePosition }: GhostElementProps) {
    // const { editor } = useLadderStore();
    const ghostRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // useEffect(() => {
    //     if (ghostRef.current) {
    //         const { offsetWidth, offsetHeight } = ghostRef.current;
    //         if (offsetWidth !== dimensions.width || offsetHeight !== dimensions.height) {
    //             setDimensions({ width: offsetWidth, height: offsetHeight });
    //         }
    //     }
    // }, [editor.dragInfo.elementType]);

    const ghostElement = useMemo(() => {
        // if (editor.mode !== "addElement" || !editor.dragInfo.isDragging || !editor.dragInfo.elementType) {
        //     return null;
        // }

        // let ghostContent;

        // switch (editor.dragInfo.elementType) {
        //     case ElementType.CONTACT:
        //         ghostContent = <Contact />;
        //         break;

        //     case ElementType.COIL:
        //         ghostContent = <Coil />;
        //         break;

        //     case ElementType.TIMER:
        //         ghostContent = <Timer />;
        //         break;

        //     case ElementType.COUNTER:
        //         ghostContent = <Counter />;
        //         break;

        //     default:
        //         ghostContent = <div>?</div>;
        // }

        return (
            <div
                ref={ghostRef}
                className="absolute pointer-events-none"
                style={{
                    left: `${mousePosition.x - (dimensions.width / 2)}px`,
                    top: `${mousePosition.y - (dimensions.height / 2)}px`,
                }}
            >
                {/* {ghostContent} */}
            </div>
        );
    }, [mousePosition, dimensions]);

    return ghostElement;
}

export default GhostElement;