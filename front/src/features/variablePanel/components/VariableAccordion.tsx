import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { IVariable } from "../../../shared/editor/types";
import useVariableAccordion from "../viewModels/useVariableAccordion.hook";
import DraggableVariable from "./DraggableVariable";

export interface VariableAccordionProps {
    variables: IVariable[];
}

function VariableAccordion({ variables }: VariableAccordionProps) {
    const {
        groupedVariables,
        removeVariable,
        selectedVariable,
        setEditingVariable,
        setSelectedVariable,
        variableTypes
    } = useVariableAccordion({ variables });

    return (
        <Accordion type="multiple" defaultValue={variableTypes} className="space-y-2">
            {Object.entries(groupedVariables).map(([type, typeVariables]) => (
                <AccordionItem key={type} value={type} className="border rounded-md px-2">
                    <AccordionTrigger className="py-2 font-medium">
                        {type} ({typeVariables.length})
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-1 pt-1">
                            {typeVariables.map(variable => (
                                <DraggableVariable
                                    key={variable.id}
                                    variable={variable}
                                    isSelected={selectedVariable?.id === variable.id}
                                    onSelect={setSelectedVariable}
                                    onEdit={setEditingVariable}
                                    onDelete={removeVariable}
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export default VariableAccordion;