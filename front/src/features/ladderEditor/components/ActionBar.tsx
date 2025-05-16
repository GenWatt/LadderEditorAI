import { FilePlus, FolderOpen, Save, Undo, Redo, Bot, Globe, Cog, X, type LucideProps } from 'lucide-react'
import React, { useCallback } from 'react';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
    MenubarSub,
    MenubarSubTrigger,
    MenubarSubContent,
} from "@/components/ui/menubar"
import { useTabStore, TabComponents } from '@/features/layout/stores/tabStore';
import { TABS } from '@/features/layout/viewModels/useApp';

export interface IAction {
    id: string;
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    description: string;
    actions?: IAction[];
}

export interface IMenu {
    id: string;
    name: string;
    actions: IAction[];
}

const tabConfigs = {
    [TABS.CHAT]: {
        id: TABS.CHAT,
        type: 'tab',
        name: 'Chat',
        component: TabComponents.CHAT,
        config: {}
    },
    [TABS.LADDER_EDITOR]: {
        id: TABS.LADDER_EDITOR,
        type: 'tab',
        name: 'Ladder Editor',
        component: TabComponents.LADDER_EDITOR,
        config: {}
    },
    [TABS.WEB_BROWSER]: {
        id: TABS.WEB_BROWSER,
        type: 'tab',
        name: 'Web Browser',
        component: TabComponents.WEB_BROWSER,
        config: {}
    }
};

const actionToTabMap = {
    'Chat': TABS.CHAT,
    'Ladder Editor': TABS.LADDER_EDITOR,
    'Web Browser': TABS.WEB_BROWSER
};

function ActionBar() {
    const { isTabOpen, addTab, hideTab } = useTabStore();

    const handleTabAction = useCallback((actionId: string) => {
        const tabId = actionToTabMap[actionId as keyof typeof actionToTabMap];
        if (!tabId) return;

        const isOpen = isTabOpen(tabId);

        if (isOpen) {
            hideTab(tabId);
        } else {
            addTab(tabConfigs[tabId]);
        }
    }, [isTabOpen, addTab, hideTab]);

    const updatedActions: IMenu[] = [
        {
            id: "file",
            name: "File",
            actions: [
                {
                    id: "new",
                    name: "New",
                    icon: FilePlus,
                    description: "Create a new file."
                },
                {
                    id: "open",
                    name: "Open",
                    icon: FolderOpen,
                    description: "Open an existing file."
                },
                {
                    id: "save",
                    name: "Save",
                    icon: Save,
                    description: "Save the current file."
                }
            ]
        },
        {
            id: "edit",
            name: "Edit",
            actions: [
                {
                    id: "undo",
                    name: "Undo",
                    icon: Undo,
                    description: "Undo the last action."
                },
                {
                    id: "redo",
                    name: "Redo",
                    icon: Redo,
                    description: "Redo the last undone action."
                }
            ]
        },
        {
            id: "view",
            name: "View",
            actions: [
                {
                    id: "Tabs",
                    name: "Tabs",
                    icon: FilePlus,
                    description: "Manage tabs",
                    actions: Object.entries(actionToTabMap).map(([actionId, tabId]) => {
                        const isOpen = isTabOpen(tabId);
                        return {
                            id: actionId,
                            name: isOpen ? `Close ${actionId}` : `Open ${actionId}`,
                            icon: isOpen ? X : (actionId === 'Chat' ? Bot : actionId === 'Web Browser' ? Globe : Cog),
                            description: isOpen ? `Close ${actionId}` : `Open ${actionId}`
                        };
                    })
                }
            ]
        }
    ];

    return (
        <Menubar className='bg-secondary'>
            {updatedActions.map((menu) => (
                <MenubarMenu key={menu.id}>
                    <MenubarTrigger className='hover:bg-foreground hover:text-secondary transition-all'>{menu.name}</MenubarTrigger>
                    <MenubarContent className='w-56'>
                        {menu.actions.map((action) => (
                            <React.Fragment key={action.id}>
                                {action.actions && action.actions.length > 0 ? (
                                    <MenubarSub>
                                        <MenubarSubTrigger>
                                            <action.icon className="mr-2" />
                                            {action.name}
                                        </MenubarSubTrigger>
                                        <MenubarSubContent>
                                            {action.actions.map((subAction) => (
                                                <MenubarItem
                                                    key={subAction.id}
                                                    onClick={() => handleTabAction(subAction.id)}
                                                >
                                                    <subAction.icon className="mr-2" />
                                                    {subAction.name}
                                                </MenubarItem>
                                            ))}
                                        </MenubarSubContent>
                                    </MenubarSub>
                                ) : (
                                    <MenubarItem>
                                        <action.icon className="mr-2" />
                                        {action.name}
                                    </MenubarItem>
                                )}
                                <MenubarSeparator />
                            </React.Fragment>
                        ))}
                    </MenubarContent>
                </MenubarMenu>
            ))}
        </Menubar>
    )
}

export default ActionBar