export type IVariable = {
    id: string;
    name: string;
    address: string;
    description: string;
    elementId: string;
    type: VariableType;
    value: boolean | number | string;
    initial: boolean | number | string;
}

export type IBooleanVariable = IVariable & {
    type: VariableType.BOOL;
    value: boolean;
    initial: boolean;
}

export type IFloatVariable = IVariable & {
    type: VariableType.FLOAT;
    value: number;
    initial: number;
}

export type IIntVariable = IVariable & {
    type: VariableType.INT;
    value: number;
    initial: number;
}

export enum VariableType {
    BOOL = "BOOL",
    INT = "INT",
    FLOAT = "FLOAT",
    STRING = "STRING",
}