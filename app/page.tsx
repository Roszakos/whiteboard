'use client';

import Whiteboard from "@/src/components/Whiteboard";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import {useReducer, useState} from "react";
import {SetToolContext, Tool, ToolContext} from "@/src/contexts/ToolContext";
import {PenSettingsContext, PenSettingsDispatchContext, penSettingsReducer} from "@/src/contexts/PenSettingsContext";
import {
    BackgroundSettingsContext,
    BackgroundSettingsDispatchContext,
    backgroundSettingsReducer
} from "@/src/contexts/BackgroundSettingsContext";


export default function Home() {
    const [tool, setTool] = useState<Tool>('pen');
    const [penSettings, penSettingsDispatch] = useReducer(
        penSettingsReducer,
        {
            color: '#000000',
            width: 3
        },
    );
    const [backgroundSettings, backgroundSettingsDispatch] = useReducer(
        backgroundSettingsReducer,
        {
            color: {r: 255, g: 255, b: 255}
        }
    );


    return (
        <ToolContext value={tool}>
            <PenSettingsContext value={penSettings}>
                <PenSettingsDispatchContext value={penSettingsDispatch}>
                    <BackgroundSettingsContext value={backgroundSettings}>
                        <BackgroundSettingsDispatchContext value={backgroundSettingsDispatch}>
                            <div className="flex min-h-screen items-center justify-center bg-zinc-200 font-sans">
                                <SetToolContext value={setTool}>
                                    <Sidebar/>
                                </SetToolContext>
                                <Whiteboard/>
                            </div>
                        </BackgroundSettingsDispatchContext>
                    </BackgroundSettingsContext>
                </PenSettingsDispatchContext>
            </PenSettingsContext>
        </ToolContext>
    );
}
