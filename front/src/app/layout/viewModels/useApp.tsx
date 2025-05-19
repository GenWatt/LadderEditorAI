import { TooltipButton } from "@/components/ui/tooltip-button";
import Chat from "@/features/chat/components/Chat";
import { useChatStore } from "@/features/chat/store/chatStore";
import LadderEditor from "@/features/ladderEditor/components/LadderEditor";
import { useAppModeStore, AppModes } from "@/shared/app/store/useAppMode";
import WebBrowser from "@/features/webbrowser/component/WebBrowser";
import { Model, type IJsonModel } from "flexlayout-react";
import { X, Maximize, Minimize, PictureInPicture } from "lucide-react";
import { useCallback, useEffect } from "react";
import { useTabStore } from "../stores/tabStore";
import VariablePanel from "@/features/variablePanel/components/VariablePanel";

const LAYOUT_STORAGE_KEY = 'objectTracker-layout';

export enum TABS {
    CHAT = 'chat',
    WEB_BROWSER = 'web-browser',
    LADDER_EDITOR = 'ladder-editor'
}

function useApp() {
    const { url } = useChatStore()
    const { currentMode } = useAppModeStore()
    const { model, setModel } = useTabStore()

    const urlApi = currentMode === AppModes.SCRAPER
        ? "http://localhost:5000/api/stream-scraper"
        : "http://localhost:5000/api/stream-ladder"

    const showUrlInput = currentMode === AppModes.SCRAPER

    const createDefaultModel = useCallback(() => {
        const defaultJson: IJsonModel = {
            global: {
                tabEnablePopout: true,
                tabSetEnableDrag: true,
                tabSetEnableMaximize: true,
                tabSetEnableClose: true,
                borderEnableDrop: true,
                tabEnableClose: true,
                tabEnablePopoutIcon: true,
                borderEnableTabScrollbar: true,
                enableEdgeDock: true,
                borderEnableAutoHide: true,
                splitterSize: 0,
                splitterExtra: 5,
                borderAutoSelectTabWhenOpen: true,
                tabEnableRename: true,
                tabMinWidth: 200,
                tabSetEnableTabStrip: true,
            },
            borders: [],
            layout: {
                type: 'column',
                weight: 100,
                id: 'root',
                children: [
                    {
                        type: 'tabset',
                        weight: 70,
                        children: [
                            {
                                type: 'tab',
                                name: currentMode === AppModes.SCRAPER ? 'Web Browser' : 'Ladder Editor',
                                component: currentMode === AppModes.SCRAPER ? 'web-browser' : 'ladder-editor',
                                minWidth: 400,
                                id: currentMode === AppModes.SCRAPER ? TABS.WEB_BROWSER : TABS.LADDER_EDITOR,
                            }
                        ]
                    },
                    {
                        type: 'tabset',
                        weight: 30,
                        children: [
                            {
                                type: 'tab',
                                name: 'Chat',
                                component: 'chat',
                                id: TABS.CHAT,
                            }
                        ]
                    },
                    {
                        type: 'tabset',
                        weight: 0,
                        children: [
                            {
                                type: 'tab',
                                name: 'Variable',
                                component: 'variable',
                                id: 'variable',
                            }
                        ]
                    }
                ]
            }
        };

        return Model.fromJson(defaultJson);
    }, [currentMode]);

    useEffect(() => {
        try {
            let savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);

            if (savedLayout) {
                try {
                    const savedModel = Model.fromJson(JSON.parse(savedLayout));
                    setModel(savedModel);
                } catch (e) {
                    console.warn('Failed to restore layout, using default', e);
                    setModel(createDefaultModel());
                }
            } else {
                setModel(createDefaultModel());
            }
        } catch (e) {
            console.error('Error initializing layout', e);
            setModel(createDefaultModel());
        }
    }, [currentMode, createDefaultModel]);

    const handleModelChange = useCallback((updatedModel: Model) => {
        setModel(updatedModel);

        try {
            localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(updatedModel.toJson()));
        } catch (e) {
            console.error('Error saving layout', e);
        }
    }, []);

    const factory = (node: any) => {
        const component = node.getComponent();

        if (component === 'web-browser') {
            return <WebBrowser url={url} />;
        } else if (component === 'ladder-editor') {
            return <LadderEditor />;
        } else if (component === 'chat') {
            return <Chat initialMessages={true} showUrlInput={showUrlInput} />;
        } else if (component === 'variable') {
            return <VariablePanel />;
        }

        return <div>Unknown component: {component}</div>;
    };

    const classMapperFn = (className: string) => {
        const classMap: Record<string, string> = {
            'flexlayout__tab_button': 'bg-muted hover:bg-accent text-foreground px-2 rounded-t-md',
            'flexlayout__tab_button--selected': 'bg-background text-primary border-b-2 border-primary',
            'flexlayout__tabset_tabbar_outer': 'border-b flex justify-between',
            'flexlayout__layout': 'bg-background',
            'flexlayout__outline_rect': 'bg-accent-foreground/20',
            'flexlayout__tab': 'border',
            'flexlayout__tab_toolbar': 'border-l border-l-muted bg-muted/50 flex items-center',
            'flexlayout__mini_scrollbar_container': 'h-10 flex justify-between'
        };

        return classMap[className] || className;
    }

    const icons = {
        closeTabset: () => <TooltipButton className="w-6 p-1" asChild tooltipText='Close Tabset' size={'icon'} variant={'ghost'}>
            <X className='text-primary' />
        </TooltipButton>,
        close: () => <TooltipButton asChild className="w-6 p-1" tooltipText='Close' size={'icon'} variant={'ghost'}>
            <X className='text-primary' />
        </TooltipButton>,
        maximize: () => <TooltipButton asChild className="w-6 p-1" tooltipText='Maximize' size={'icon'} variant={'ghost'}>
            <Maximize className='text-primary' />
        </TooltipButton>,
        restore: () => <TooltipButton asChild className="w-6 p-1" tooltipText='Minimize' size={'icon'} variant={'ghost'}>
            <Minimize className='text-primary' />
        </TooltipButton>,
        popout: () => <TooltipButton asChild className="w-6 p-1" tooltipText='Open in new Tab' size={'icon'} variant={'ghost'}>
            <PictureInPicture className='text-primary' />
        </TooltipButton>
    }

    return {
        model,
        urlApi,
        showUrlInput,
        icons,
        setModel,
        handleModelChange,
        factory,
        classMapperFn
    }
}

export default useApp