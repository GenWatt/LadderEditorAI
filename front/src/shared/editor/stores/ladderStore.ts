import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import type { IRung, Position } from '../types/ladderEditorTypes'

export interface LadderProgram {
    rungs: IRung[];
}

export interface LadderStore {
    // State
    program: LadderProgram;

    // Variable Operations
    // addInput: (input: Omit<InputVariable, "id">) => string;
    addRung: (postion: Position) => string;
    addBranch: (rungId: string, start: number, end: number, height: number) => void;
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
        addRung: (position) => {
            const id = uuidv4();

            set(state => {
                const rungData = { id, number: state.program.rungs.length + 1, elements: [], branches: [], position };
                state.program.rungs.push(rungData);
            });

            get().addBranch(id, 0, 0, 0); // Add a default branch to the new rung

            return id;
        },
        addBranch: (rungId, start, end, height) => set(state => {
            const rung = state.program.rungs.find(r => r.id === rungId);
            if (rung) {
                const branchId = uuidv4();
                const newBranch = { id: branchId, paths: [], start, end, height };
                rung.branches.push(newBranch);
            }
        })
    }))
);