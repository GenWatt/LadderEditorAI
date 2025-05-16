import { useState } from "react";
import { useLadderStore } from "../stores/ladderStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import VariableDialog from "./variables/VariableDialog";

function VariablePanel() {
    const { } = useLadderStore();

    const [newVariable, setNewVariable] = useState({
        description: "",
        type: "",
        initial: 0,
        preset: 1000,
        base: 10
    });

    return (
        <ScrollArea className="border-l p-4">
            <div className="mb-4 flex justify-between items-center">

                <VariableDialog />
            </div>
        </ScrollArea>
    );
}

export default VariablePanel;