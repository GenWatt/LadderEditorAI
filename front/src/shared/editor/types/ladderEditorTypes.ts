import type { IVariable } from ".";

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

export type ElementMode = ContactMode | CoilMode | TimerMode | CounterMode;

export interface Position {
    x: number;
    y: number;
}

// Element Definitions
export interface BaseElement {
    id: string;
    position: Position;
    variable: IVariable | null;
    size: Position;
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
    paths: IElement[];
    start: number;
    end: number;
    height: number;
}

// Rung Structure
export interface IRung {
    id: string;
    number: number;
    branches: Branch[];
    position: Position;
}

// Selection State
export interface SelectionState {
    selectedElementId: string | null;
    selectedRungId: string | null;
    activeVariableType: "inputs" | "outputs" | "coils" | "timers" | "counters" | null;
    selectedCells?: Position[]; // Added for grid cell selection
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
        sourceElementId: string | null; // Could be ID of tool from toolbar or an existing element
    };
}

