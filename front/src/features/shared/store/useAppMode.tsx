import { create } from "zustand";

export enum AppModes {
    SCRAPER = "scraper",
    LADDER = "ladder",
}

export interface AppModeState {
    currentMode: AppModes;
    setMode: (mode: AppModes) => void;
}

export const useAppModeStore = create<AppModeState>((set) => ({
    currentMode: AppModes.LADDER,
    setMode: (mode) => set({ currentMode: mode }),
}));