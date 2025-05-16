import { create } from "zustand";
import type { IVariable } from "../types";

export interface VariableStore {
    variables: IVariable[];

    addVariable: (variable: IVariable) => void;
    removeVariable: (id: string) => void;
    updateVariable: (id: string, updatedVariable: Partial<IVariable>) => void;
    getVariable: (id: string) => IVariable | undefined;
}

export const useTabStore = create<VariableStore>((set, get) => ({
    variables: [],

    addVariable: (variable) => {
        set((state) => ({
            variables: [...state.variables, variable],
        }));
    },

    removeVariable: (id) => {
        set((state) => ({
            variables: state.variables.filter((variable) => variable.id !== id),
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