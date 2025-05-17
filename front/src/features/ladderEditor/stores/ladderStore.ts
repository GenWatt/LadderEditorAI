import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import type { IRung } from '../types'

export interface LadderProgram {
    rungs: IRung[];
}

export interface LadderStore {
    // State
    program: LadderProgram;

    // Variable Operations
    // addInput: (input: Omit<InputVariable, "id">) => string;
    addRung: () => string;
}

export const useLadderStore = create<LadderStore>()(
    immer((set, get) => ({
        program: {
            rungs: []
        },

        // Variable Operations
        // addInput: (input) => {
        //     const id = `I${get().program.variables.inputs.length}`;
        //     set(state => {
        //         state.program.variables.inputs.push({
        //             id,
        //             ...input
        //         });
        //     });
        //     return id;
        // },
        addRung: () => {
            const id = uuidv4();
            set(state => {
                state.program.rungs.push({
                    id: id,
                    number: state.program.rungs.length + 1,
                    elements: [],
                    branches: []
                });
            });

            return id;
        }
    }))
);