import { useEffect, useRef } from "react";

// import { ScrollArea } from "@/components/ui/scroll-area";
import { useLadderEditorStore } from "../../../shared/editor/stores/editorStore";
// import { useLadderStore } from "../../../shared/editor/stores/ladderStore";
import { Stage, Layer } from "react-konva";
import { GridBackground } from "./grid/GridBackground";
import { GridInteractionLayer } from "./grid/GridInteractionLayer";
import CellHighlights from "./grid/CellHighlights ";
import { Rails } from "./elements/Rails";
import { useLadderStore } from "@/shared/editor/stores/ladderStore";
import { Rung } from "./elements/Rung";

function LadderCanvas() {
    const { gridSize, setGridDimensions, grid } = useLadderEditorStore();
    const { program } = useLadderStore();
    const { rungs } = program;
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function updateSize() {
            if (containerRef.current) {
                setGridDimensions(
                    containerRef.current.offsetWidth,
                    containerRef.current.offsetHeight,
                );
            }
        }
        console.log("LadderCanvas: updateSize called " + containerRef.current?.offsetHeight);
        updateSize(); // Initial size
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, [setGridDimensions]);

    return (
        <div ref={containerRef} className="w-full h-full relative">
            <Stage width={grid.width} height={grid.height}>
                {/* 1) static grid */}
                <Layer key={'grid-layer'}>
                    <GridBackground
                        width={grid.width}
                        height={grid.height}
                        cellSize={gridSize}
                    />
                </Layer>

                {/* 2) dynamic colored/selected cells */}
                <Layer key={'highlight-layer'}>
                    <CellHighlights />
                </Layer>

                {/* 3) interaction */}
                <Layer key={'interaction-layer'}>
                    <GridInteractionLayer
                        width={grid.width}
                        height={grid.height}
                        cellSize={gridSize}
                    />
                </Layer>

                {/* Ladder diagram layer */}
                <Layer>
                    {rungs?.map(rung => (
                        <Rung
                            key={rung.id}
                            rung={rung}
                            width={grid.width}
                        // isSelected={rung.id === selectedRungId}
                        />
                    ))}
                </Layer>

                {/* 4) Rails lines */}

                <Layer key={'rails-layer'}>
                    <Rails
                        height={grid.height}
                        width={grid.width}
                        offset={0}
                    />
                </Layer>
            </Stage>
        </div>
    );
}

export default LadderCanvas;