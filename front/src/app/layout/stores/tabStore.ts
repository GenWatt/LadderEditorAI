import { create } from 'zustand';
import { Actions, DockLocation, Model, Node } from 'flexlayout-react';
import type { TABS } from '../viewModels/useApp';

export enum TabComponents {
    CHAT = 'chat',
    WEB_BROWSER = 'web-browser',
    LADDER_EDITOR = 'ladder-editor'
}

export interface TabConfig {
    name: string;
    component: string;
    config?: Record<string, any>;
}

interface TabState {
    // State
    model: Model | null;

    // Actions
    setModel: (model: Model) => void;
    getTab: (id: TABS) => Node | undefined | null;
    addTab: (json: any) => void;
    isTabOpen: (id: TABS) => boolean;
    hideTab: (id: TABS) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
    model: null,

    setModel: (model: Model) => {
        set({ model });
    },
    getTab: (id: TABS) => {
        const { model } = get();
        if (!model) return null;

        const node = model.getNodeById(id);
        console.log('getTab', id, node);
        return node;
    },

    addTab: (json: any) => {
        const { model } = get();
        if (!model) return;

        model.doAction(Actions.addNode(json, 'root', DockLocation.CENTER, 0));
    },
    isTabOpen: (id: TABS) => {
        const { model } = get();
        if (!model) return false;

        const node = model.getNodeById(id);
        return !!node;
    },
    hideTab: (id: TABS) => {
        const { model } = get();
        if (!model) return;

        model.doAction(Actions.deleteTab(id));
    },

}))