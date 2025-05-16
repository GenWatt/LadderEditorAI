import React from 'react';

import { AppModes, useAppModeStore } from '@/features/shared/store/useAppMode';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

export const SelectMode: React.FC = () => {
    const { currentMode, setMode } = useAppModeStore();

    const handleValueChange = (value: string) => {
        setMode(value as AppModes);
    };

    return (
        <Select value={currentMode} onValueChange={handleValueChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={AppModes.SCRAPER}>Scraper</SelectItem>
                <SelectItem value={AppModes.LADDER}>Ladder</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default SelectMode;