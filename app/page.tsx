'use client';

import Whiteboard from "@/src/components/Whiteboard";
import Sidebar from "@/src/components/Sidebar/Sidebar";
import {useReducer, useState} from "react";
import {SetToolContext, Tool, ToolContext} from "@/src/contexts/ToolContext";
import {PenSettingsContext, PenSettingsDispatchContext, penSettingsReducer} from "@/src/contexts/PenSettingsContext";


export default function Home() {
    const [tool, setTool] = useState<Tool>('pen');
    const [penSettings, dispatch] = useReducer(
        penSettingsReducer,
        {
            color: '#000000',
            width: 3
        },
    );

    return (
        <ToolContext value={tool}>
            <PenSettingsContext value={penSettings}>
                <PenSettingsDispatchContext value={dispatch}>
                    <div className="flex min-h-screen items-center justify-center bg-zinc-200 font-sans">
                        <SetToolContext value={setTool}>
                            <Sidebar/>
                        </SetToolContext>
                        <Whiteboard/>
                    </div>
                </PenSettingsDispatchContext>
            </PenSettingsContext>
        </ToolContext>
    );
}
