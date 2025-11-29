import {createContext, Dispatch, SetStateAction} from "react";

export type Tool = 'pen' | 'eraser' | 'hand';

export const ToolContext = createContext<Tool>('pen');
export const SetToolContext = createContext<Dispatch<SetStateAction<Tool>> | null>(null);