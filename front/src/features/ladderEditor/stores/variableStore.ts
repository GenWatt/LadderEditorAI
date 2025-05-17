import { create } from "zustand";
import * as zod from "zod";
import { VariableType, type IVariable } from "../types/variableTypes";

export const variableInfo = {
    BOOL: {
        type: VariableType.BOOL,
        initialValue: false,
        description: "Boolean variable",
        validationSchema: zod.boolean(),
    },
    INT: {
        type: VariableType.INT,
        initialValue: 0,
        description: "Integer variable",
        validationSchema: zod.number().int(),
    },
    FLOAT: {
        type: VariableType.FLOAT,
        initialValue: 0.0,
        description: "Float variable",
        validationSchema: zod.number(),
    },
    STRING: {
        type: VariableType.STRING,
        initialValue: "",
        description: "String variable",
        validationSchema: zod.string(),
    },
}

export interface VariableStore {
    // select var
    selectedVariable: IVariable | null;
    setSelectedVariable: (id: string | null | IVariable) => void;

    // edit var
    editingVariable: IVariable | null;
    setEditingVariable: (id: string | null) => void;

    // variables
    variables: IVariable[];
    addVariable: (variable: IVariable) => void;
    removeVariable: (id: string) => void;
    updateVariable: (id: string, updatedVariable: Partial<IVariable>) => void;
    getVariable: (id: string) => IVariable | undefined;
}

export const useVariableStore = create<VariableStore>((set, get) => ({
    // select var

    selectedVariable: null,
    setSelectedVariable: (value) => {
        if (value === null) {
            set({ selectedVariable: null });
        } else if (typeof value === "string") {
            const variable = get().variables.find((v) => v.id === value);
            set({ selectedVariable: variable || null });
        } else {
            set({ selectedVariable: value });
        }
    },

    // edit var

    editingVariable: null,
    setEditingVariable: (id) => {
        set({ editingVariable: id ? get().variables.find((v) => v.id === id) : null });
    },

    // variables

    variables: [],
    addVariable: (variable) => {
        set((state) => ({
            variables: [...state.variables, variable],
        }));
    },

    removeVariable: (id) => {
        set((state) => ({
            variables: state.variables.filter((variable) => variable.id !== id),
            selectedVariable: state.selectedVariable?.id === id ? null : state.selectedVariable,
            editingVariable: state.editingVariable?.id === id ? null : state.editingVariable,
        }));
    },

    updateVariable: (id, updatedVariable) => {
        set((state) => ({
            variables: state.variables.map((variable) =>
                variable.id === id ? { ...variable, ...updatedVariable } : variable
            ),
        }));
    },

    getVariable: (id) => {
        const { variables } = get();
        return variables.find((variable) => variable.id === id);
    },
}))