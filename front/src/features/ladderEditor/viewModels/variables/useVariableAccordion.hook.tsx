import { useVariableStore } from '../../stores/variableStore';
import type { IVariable, VariableType } from '../../types/variableTypes';

export interface VariableAccordionPropsHook {
    variables: IVariable[];
}

function useVariableAccordion({ variables }: VariableAccordionPropsHook) {

    const { selectedVariable, setSelectedVariable, setEditingVariable, removeVariable } = useVariableStore();

    const groupedVariables = variables.reduce((acc, variable) => {
        const type = variable.type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(variable);
        return acc;
    }, {} as Record<VariableType, typeof variables>);

    const variableTypes = Object.keys(groupedVariables);

    return {
        variableTypes,
        groupedVariables,
        selectedVariable,
        setSelectedVariable,
        setEditingVariable,
        removeVariable
    }
}

export default useVariableAccordion