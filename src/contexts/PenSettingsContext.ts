import {ActionDispatch, Context, createContext, useContext} from "react";

export type PenSettings = {
    color: string,
    width: number
}

export enum PEN_SETTINGS_DISPATCH_ACTIONS {
    CHANGE_COLOR = 'change_color',
    CHANGE_WIDTH = 'change_width',
}

interface PenSettingsReducerAction {
    type: PEN_SETTINGS_DISPATCH_ACTIONS,
    color?: string,
    width?: number,
}

export const PenSettingsContext = createContext<PenSettings>({
    color: '#000000',
    width: 2
});

export const PenSettingsDispatchContext = createContext<
    ActionDispatch<[action: PenSettingsReducerAction]> | null
>(null);


export function penSettingsReducer(penSettings: PenSettings, action: PenSettingsReducerAction): PenSettings {
    switch (action.type) {
        case PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_COLOR: {
            if (action.color === undefined) {
                throw Error(`No color provided for ${PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_COLOR} action`);
            }

            return {
                ...penSettings,
                color: action.color
            }
        }

        case PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_WIDTH: {
            if (action.width === undefined) {
                throw Error(`No width provided for ${PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_WIDTH} action`);
            }

            return {
                ...penSettings,
                width: action.width
            }
        }

        default: {
            throw Error('Unknown action type: ' + action.type);
        }
    }
}

export const usePenSettingsDispatch = () => {
    const dispatch = useContext(PenSettingsDispatchContext);
    if (dispatch === null) {
        throw new Error('Context has not been provided');
    }

    return dispatch;
}