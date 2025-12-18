import {ActionDispatch, createContext, useContext} from "react";
import {Color} from "@/src/components/ColorPicker/ColorPicker";

export type BackgroundSettings = {
    color: Color;
}

export enum BackgroundSettingsAction {
    CHANGE_COLOR = 'change_color',
}

interface BackgroundSettingsReducerAction {
    type: BackgroundSettingsAction;
    color: Color
}

export const BackgroundSettingsContext = createContext({
    color: {r: 255, g: 255, b: 255},
});

export const BackgroundSettingsDispatchContext = createContext<
    ActionDispatch<[action: BackgroundSettingsReducerAction]> | null
>(null);

export function backgroundSettingsReducer(
    backgroundSettings: BackgroundSettings,
    action: BackgroundSettingsReducerAction
): BackgroundSettings {
    switch (action.type) {
        case BackgroundSettingsAction.CHANGE_COLOR: {
            return {
                ...backgroundSettings,
                color: action.color
            };

        }

        default: {
            throw new Error('Unknown action type');
        }
    }
}

export const useBackgroundSettingsDispatch = () => {
    const dispatch = useContext(BackgroundSettingsDispatchContext);
    if (dispatch === null) {
        throw new Error('Context has not been provided');
    }

    return dispatch;
}