import { useRef, useState } from "react";
import { useLadderStore } from "../stores/ladderStore";

import Rung from "./Rung";
import GhostElement from "./GhostElement";
import { type Position, type ElementMode, ElementType, ContactMode, CoilMode, TimerMode, CounterMode } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLadderEditorStore } from "../stores/editorStore";

function LadderCanvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

    const {
        program,
    } = useLadderStore();

    const { gridSize } = useLadderEditorStore();

    return (
        <div className="flex-1 flex flex-col" style={{
            backgroundImage: `
                linear-gradient(to right, #f0f0f030 1px, transparent 1px),
                linear-gradient(to bottom, #f0f0f030 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`
        }}>
            <ScrollArea className="flex-1">
                <div
                    ref={canvasRef}
                    className="relative"
                >
                    <div className="px-4">
                        {program.rungs.map((rung) => (
                            <Rung
                                key={rung.id}
                                rung={rung}
                            />
                        ))}

                        <GhostElement mousePosition={mousePosition} />
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

export default LadderCanvas;