import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { nanoid } from "nanoid";
import type { IElement, LadderStore } from '../types'

const createId = () => nanoid(8);

export const useLadderStore = create<LadderStore>()(
    immer((set, get) => ({
        program: {
            variables: {
                inputs: [],
                outputs: [],
                coils: [],
                timers: [],
                counters: []
            },
            rungs: []
        },
        selection: {
            selectedElementId: null,
            selectedRungId: null,
            activeVariableType: null
        },
        editor: {
            grid: {
                size: 20,
                visible: true
            },
            mode: "select",
            dragInfo: {
                isDragging: false,
                elementType: null,
                sourceElementId: null
            }
        },

        // Variable Operations
        addInput: (input) => {
            const id = `I${get().program.variables.inputs.length}`;
            set(state => {
                state.program.variables.inputs.push({
                    id,
                    ...input
                });
            });
            return id;
        },
        addRung: () => {
            const id = createId();
            set(state => {
                state.program.rungs.push({
                    id,
                    number: state.program.rungs.length + 1,
                    elements: [],
                    branches: []
                });
            });
            return id;
        }
    }))
);