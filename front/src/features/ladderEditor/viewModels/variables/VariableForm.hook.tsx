import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { useVariableStore, variableInfo } from "../../stores/variableStore";
import { VariableType, type IVariable } from "../../types/variableTypes";
import { createVariableNameSchema, createVariableAddressSchema, variableDescriptionSchema } from "../../validation";

export interface UseVariableFormProps {
    existingVariable?: IVariable | null;
    onTypeChange?: (type: VariableType) => void;
    onSubmit?: (values: any) => void;
}

const defaultVariable = {
    name: "",
    address: "%I00000",
    description: "",
    type: VariableType.BOOL,
    value: variableInfo.BOOL.initialValue,
};

export function useVariableForm({ existingVariable, onTypeChange, onSubmit }: UseVariableFormProps) {
    const [selectedType, setSelectedType] = useState<VariableType>(VariableType.BOOL);
    const { variables, updateVariable, addVariable } = useVariableStore((state) => state);

    const formSchema = useMemo(() => {
        return z.object({
            name: createVariableNameSchema(variables, existingVariable?.id),
            address: createVariableAddressSchema(variables, existingVariable?.id),
            description: variableDescriptionSchema,
            type: z.nativeEnum(VariableType),
            value: variableInfo[selectedType].validationSchema,
        });
    }, [variables, existingVariable, selectedType]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultVariable,
    });

    useEffect(() => {
        if (existingVariable) {
            setSelectedType(existingVariable.type);
            form.reset({
                name: existingVariable.name,
                address: existingVariable.address,
                description: existingVariable.description,
                type: existingVariable.type,
                value: existingVariable.value,
            });
        } else {
            form.reset(defaultVariable);
        }
    }, [existingVariable, form]);

    const handleTypeChange = (type: VariableType) => {
        setSelectedType(type);
        form.setValue("type", type);

        switch (type) {
            case VariableType.BOOL:
                form.setValue("value", variableInfo.BOOL.initialValue);
                break;
            case VariableType.INT:
                form.setValue("value", variableInfo.INT.initialValue);
                break;
            case VariableType.FLOAT:
                form.setValue("value", variableInfo.FLOAT.initialValue);
                break;
        }

        if (onTypeChange) {
            onTypeChange(type);
        }
    };

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        if (existingVariable) {
            const updatedVariable: IVariable = {
                ...existingVariable,
                name: values.name,
                address: values.address,
                description: values.description || "",
                type: values.type,
                value: values.value,
            };
            updateVariable(existingVariable.id, updatedVariable);
        } else {
            const newVariable: IVariable = {
                id: uuidv4(),
                name: values.name,
                address: values.address,
                description: values.description || "",
                type: values.type,
                value: values.value,
                initial: values.value,
                elementId: "",
            };
            addVariable(newVariable);
        }

        form.reset();

        if (onSubmit) {
            onSubmit(values);
        }
    };

    const getSelectedValue = (value: string) => selectedType === VariableType.INT
        ? parseInt(value)
        : parseFloat(value);

    return {
        form,
        selectedType,
        handleTypeChange,
        handleSubmit: form.handleSubmit(handleSubmit),
        getSelectedValue
    };
}