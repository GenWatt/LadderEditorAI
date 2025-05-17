import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider } from './features/theme/context/ThemeProvider'
import Appbar from './features/appbar/components/Appbar'
import 'flexlayout-react/style/light.css';
import useApp from './features/layout/viewModels/useApp'
import { Layout } from 'flexlayout-react';
import ActionBar from './features/ladderEditor/components/ActionBar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const queryClient = new QueryClient()

function App() {
  const { factory, handleModelChange, model, classMapperFn, icons } = useApp()

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col w-screen h-screen bg-background">
          <div className="w-full h-16 min-h-[64px] flex-shrink-0 z-50">
            <Appbar>
              <ActionBar />
            </Appbar>
          </div>
          <div className="flex-1 w-full relative overflow-hidden">
            <DndProvider backend={HTML5Backend}>
              {model && (
                <Layout
                  classNameMapper={classMapperFn}
                  model={model}
                  factory={factory}
                  onModelChange={handleModelChange}
                  icons={icons}
                />
              )}
            </DndProvider>
          </div>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;