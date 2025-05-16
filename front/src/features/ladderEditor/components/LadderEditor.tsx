import { useEffect } from "react";
import LadderToolbar from "./LadderToolbar";
import LadderCanvas from "./LadderCanvas";
import { useLadderStore } from "../stores/ladderStore";

function LadderEditor() {
    const { addRung, program } = useLadderStore();

    useEffect(() => {
        if (program.rungs.length === 0) {
            addRung();
        }
    }, []);

    return (
        <div className="flex flex-1 flex-col bg-background h-full">
            <LadderToolbar />

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col">
                    <LadderCanvas />
                </div>
            </div>
        </div>
    );
}

export default LadderEditor;