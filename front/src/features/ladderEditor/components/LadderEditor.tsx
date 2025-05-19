import { useEffect, useRef } from "react";
import LadderToolbar from "./LadderToolbar";
import LadderCanvas from "./LadderCanvas";
import { useLadderStore } from "../../../shared/editor/stores/ladderStore";
import { useLadderEditorStore } from "@/shared/editor/stores/editorStore";

function LadderEditor() {
    const { addRung, addBranch, program } = useLadderStore();
    const { getPostionByRowCol, getPostion } = useLadderEditorStore();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!initializedRef.current && program.rungs.length === 0) {
            const rungPosition = getPostionByRowCol(1, 0);
            const branchPosition = getPostionByRowCol(0, 4);
            const branchHeight = getPostion(2)

            const branchPosition2 = getPostionByRowCol(0, 6);
            const branchHeight2 = getPostion(4)

            const id = addRung(rungPosition);
            addBranch(id, branchPosition.x, branchPosition.y, branchHeight);
            addBranch(id, branchPosition2.x, branchPosition2.y, branchHeight2);

            initializedRef.current = true;
        }
    }, [program.rungs.length, addRung]);

    return (
        <div className="flex flex-1 flex-col bg-background h-full">
            <LadderToolbar />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col overflow-auto">
                    <LadderCanvas />
                </div>
            </div>
        </div>
    );
}

export default LadderEditor;