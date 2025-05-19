import { VariablesSelect } from "./VariablesSelect";
import { VariableType, type IVariable } from "../../../shared/editor/types";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useVariableForm } from "../viewModels/useVariableForm.hook";

export interface VariableFormProps {
    existingVariable?: IVariable | null;
    onTypeChange?: (type: VariableType) => void;
    onSubmit?: (values: any) => void;
}

function VariableForm({ existingVariable, onTypeChange, onSubmit }: VariableFormProps) {
    const { form, getSelectedValue, handleSubmit, handleTypeChange, selectedType } =
        useVariableForm({ existingVariable, onTypeChange, onSubmit });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Variable Name</FormLabel>
                            <FormControl>
                                <Input placeholder="myVariable" {...field} />
                            </FormControl>
                            <FormDescription>
                                Only letters, numbers, and underscores allowed
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="%I00000" {...field} />
                            </FormControl>
                            <FormDescription>
                                Format: %[I|Q|M|DB]00000
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Variable Type</FormLabel>
                            <FormControl>
                                <VariablesSelect
                                    value={field.value}
                                    onValueChange={handleTypeChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Select the data type for this variable
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Initial Value</FormLabel>
                            <FormControl>
                                <div className="flex items-center">
                                    {selectedType === VariableType.BOOL ? (
                                        <Checkbox
                                            checked={field.value as boolean}
                                            onCheckedChange={field.onChange}
                                        />
                                    ) : (
                                        <Input
                                            type="number"
                                            value={field.value as number}
                                            onChange={(e) => {
                                                const value = getSelectedValue(e.target.value);
                                                field.onChange(value);
                                            }}
                                        />
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                Default value for this variable
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Optional description" {...field} />
                            </FormControl>
                            <FormDescription>
                                Helpful description of the variable's purpose
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">
                    {existingVariable ? "Update Variable" : "Add Variable"}
                </Button>
            </form>
        </Form>
    );
}

export default VariableForm;