import { useRef, useState } from "react";
import { useLadderStore } from "../stores/ladderStore";

import Rung from "./Rung";
import GhostElement from "./GhostElement";
import { type Position, type ElementMode, ElementType, ContactMode, CoilMode, TimerMode, CounterMode } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";

function LadderCanvas() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });

    const {
        program,
        editor,
    } = useLadderStore();


    const findClosestRung = (y: number) => {
        if (program.rungs.length === 0) return null;

        const rungElements = document.querySelectorAll('[data-rung-id]');
        let closestRung = null;
        let minDistance = Infinity;

        rungElements.forEach((rungEl) => {
            const rect = rungEl.getBoundingClientRect();
            const rungMidY = rect.top + rect.height / 2;
            const distance = Math.abs(rungMidY - y);

            if (distance < minDistance) {
                minDistance = distance;
                closestRung = rungEl.getAttribute('data-rung-id');
            }
        });

        return closestRung;
    };

    const getDefaultModeForElementType = (type: ElementType): ElementMode => {
        switch (type) {
            case ElementType.CONTACT:
                return ContactMode.NO;
            case ElementType.COIL:
                return CoilMode.STANDARD;
            case ElementType.TIMER:
                return TimerMode.TON;
            case ElementType.COUNTER:
                return CounterMode.CTU;
            default:
                return ContactMode.NO;
        }
    };

    return (
        <ScrollArea className="flex flex-col">
            <div
                ref={canvasRef}
                className="flex-1 relative overflow-hidden"
                style={{
                    backgroundImage: editor.grid.visible ? `
                        linear-gradient(to right, #f0f0f030 1px, transparent 1px),
                        linear-gradient(to bottom, #f0f0f030 1px, transparent 1px)
                    ` : 'none',
                    backgroundSize: `${editor.grid.size}px ${editor.grid.size}px`
                }}
            >
                <div className="p-4">
                    {program.rungs.map((rung) => (
                        <Rung
                            key={rung.id}
                            rung={rung}
                            isClickable={editor.mode === "select"}
                        />
                    ))}

                    <GhostElement mousePosition={mousePosition} />
                </div>
            </div>
        </ScrollArea>
    );
}

export default LadderCanvas;