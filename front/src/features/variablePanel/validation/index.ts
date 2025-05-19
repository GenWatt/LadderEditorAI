import type { IVariable } from "../../../shared/editor/types";
import * as zod from "zod";

export const createVariableNameSchema = (variables: IVariable[], currentId?: string) => zod
    .string().min(1, "Variable name is required")
    .max(20, "Variable name must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Variable name can only contain letters, numbers, and underscores")
    .refine(
        (name) => {
            const exists = variables.some(v => v.name === name && v.id !== currentId);
            return !exists;
        },
        { message: "Variable name must be unique" }
    );

export const createVariableAddressSchema = (variables: IVariable[], currentId?: string) =>
    zod.string()
        .regex(/^[%][I|Q|M|DB]\d{5}$/, "Invalid variable address format")
        .refine((value) => {
            const prefix = value[1];
            const numberPart = value.slice(2);
            const number = parseInt(numberPart, 10);
            if (prefix === "I" && number >= 0 && number <= 99999) return true;
            if (prefix === "Q" && number >= 0 && number <= 99999) return true;
            if (prefix === "M" && number >= 0 && number <= 99999) return true;
            if (prefix === "DB" && number >= 0 && number <= 99999) return true;
            return false;
        })
        .refine(
            (address) => {
                const exists = variables.some(v => v.address === address && v.id !== currentId);
                return !exists;
            },
            { message: "Variable address must be unique" }
        );

export const variableDescriptionSchema = zod
    .string()
    .max(100, "Description must be less than 100 characters")
    .optional();

export const valueSchema = zod.union([
    zod.boolean(),
    zod.number().int(),
]);
