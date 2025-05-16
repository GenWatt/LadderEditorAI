// Element Types
export enum ElementType {
    CONTACT = "contact",
    COIL = "coil",
    TIMER = "timer",
    COUNTER = "counter"
}

// Element Modes
export enum ContactMode {
    NO = "NO",  // Normally Open
    NC = "NC"   // Normally Closed
}

export enum CoilMode {
    STANDARD = "STANDARD",
    SET = "SET",
    RESET = "RESET",
    NEGATED = "NEGATED"
}

export enum TimerMode {
    TON = "TON",  // Timer On Delay
    TOF = "TOF"   // Timer Off Delay
}

export enum CounterMode {
    CTU = "CTU",  // Count Up
    CTD = "CTD"   // Count Down
}

// Type guards for element modes
export type ElementMode = ContactMode | CoilMode | TimerMode | CounterMode;

// Variable Definitions
export type IVariable = {
    id: string;
    name: string;
    address: string;
    description: string;
    type: ElementType;
}

export type IBooleanVariable = IVariable & {
    isOn: boolean;
    initial: 0 | 1;
}

export type InputVariable = IVariable & IBooleanVariable & {
    type: ElementType.CONTACT;
    mode: ContactMode;
}

export type OutputVariable = IVariable & IBooleanVariable & {
    type: ElementType.COIL;
    mode: CoilMode;
}

export type CoilVariable = IVariable & IBooleanVariable & {
    type: ElementType.COIL;
    mode: CoilMode;
}

export type TimerVariable = IVariable & {
    type: ElementType.TIMER;
    mode: TimerMode;
    preset: number; // milliseconds
    accum: number;  // current value
    base: number;   // time base in milliseconds
}

// export interface CounterVariable {
//     id: string;
//     type: CounterMode;
//     preset: number; // count
//     accum: number;  // current value
//     base: number;   // step value
// }

// Position for visual elements
export interface Position {
    x: number;
    y: number;
}

// Element Definitions
interface BaseElement {
    id: string;
    position: Position;
    variableId: string; // Reference to the variable this element uses
}

export interface ContactElement extends BaseElement {
    type: ElementType.CONTACT;
    mode: ContactMode;
}

export interface CoilElement extends BaseElement {
    type: ElementType.COIL;
    mode: CoilMode;
}

export interface TimerElement extends BaseElement {
    type: ElementType.TIMER;
    mode: TimerMode;
}

export interface CounterElement extends BaseElement {
    type: ElementType.COUNTER;
    mode: CounterMode;
}

// Union type for all element types
export type IElement = ContactElement | CoilElement | TimerElement | CounterElement;

// Branch Structure
export interface Branch {
    id: string;
    paths: IElement[][];
}

// Rung Structure
export interface IRung {
    id: string;
    number: number;
    elements: IElement[];
    branches: Branch[];
}

// Full Ladder Program
export interface LadderProgram {
    variables: {
        inputs: InputVariable[];
        outputs: OutputVariable[];
        coils: CoilVariable[];
        timers: TimerVariable[];
        // counters: CounterVariable[];
    };
    rungs: IRung[];
}

// Selection State
export interface SelectionState {
    selectedElementId: string | null;
    selectedRungId: string | null;
    activeVariableType: "inputs" | "outputs" | "coils" | "timers" | "counters" | null;
}

// Editor State
export interface EditorState {
    grid: {
        size: number;
        visible: boolean;
    };
    mode: "select" | "addElement" | "connect" | "delete";
    dragInfo: {
        isDragging: boolean;
        elementType: ElementType | null;
        sourceElementId: string | null;
    };
}

export interface LadderStore {
    // State
    program: LadderProgram;
    selection: SelectionState;
    editor: EditorState;

    // Variable Operations
    addInput: (input: Omit<InputVariable, "id">) => string;
    addRung: () => string;
}
