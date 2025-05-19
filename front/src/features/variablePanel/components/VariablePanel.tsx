import { ScrollArea } from "@/components/ui/scroll-area";
import VariableDialog from "./VariableDialog";
import { useVariableStore } from "../../../shared/editor/stores/variableStore";
import VariableDetails from "./VariableDetails";
import VariableAccordion from "./VariableAccordion";

function VariablePanel() {
    const { variables, selectedVariable } = useVariableStore();

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="border-l p-4 flex-grow">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Variables</h2>
                    <VariableDialog />
                </div>

                {variables.length === 0 ? (
                    <div className="text-center p-4 text-muted-foreground">
                        No variables added yet. Click "Add Variable" to create one.
                    </div>
                ) : (
                    <VariableAccordion
                        variables={variables} />
                )}
            </ScrollArea>

            {selectedVariable && (
                <VariableDetails variableDetails={selectedVariable} />
            )}
        </div>
    );
}

export default VariablePanel;