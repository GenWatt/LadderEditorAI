import React from 'react';
import { useAvailableModelsQuery } from '@/features/chat/api/useAvaliableModelsQuery';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ModelListProps {
    onModelSelect?: (modelId: string) => void;
    defaultValue?: string;
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const ModelList: React.FC<ModelListProps> = ({
    onModelSelect,
    triggerClassName,
    contentClassName,
    placeholder = "Select a model",
    disabled = false,
}) => {
    const { data, isLoading, error } = useAvailableModelsQuery();
    const models = data?.models || [];
    const defaultModel = data?.defaultModel;

    const handleValueChange = (value: string) => {
        if (onModelSelect) {
            onModelSelect(value);
        }
    };

    if (isLoading) {
        return <div>Loading models...</div>;
    }

    if (error || !models) {
        return <div>Error loading models</div>;
    }

    return (
        <Select
            onValueChange={handleValueChange}
            defaultValue={defaultModel}
            disabled={disabled || models.length === 0}
        >
            <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
                {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                        {model.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default ModelList;