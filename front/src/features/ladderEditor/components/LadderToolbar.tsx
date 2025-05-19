import { TooltipButton } from "@/components/ui/tooltip-button";
import { useLadderEditorStore } from "../../../shared/editor/stores/editorStore";

function LadderToolbar() {
    const {
        setSelectedTool,
        toolbarTools,
        selectedTool
    } = useLadderEditorStore();

    return (
        <div className="p-2 border flex flex-col gap-4">
            <div>
                <h3 className="text-sm font-medium mb-2">Elements</h3>
                <div className="flex flex-wrap gap-2">
                    {toolbarTools.map((tool) => (
                        <TooltipButton
                            key={tool.id}
                            tooltipText={tool.description}
                            size="icon"
                            variant={selectedTool?.id === tool.id ? "default" : "secondary"}
                            onClick={() => setSelectedTool(tool)}
                            className="flex items-center justify-center"
                        >
                            <tool.icon className="w-5 h-5" />
                        </TooltipButton>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LadderToolbar;