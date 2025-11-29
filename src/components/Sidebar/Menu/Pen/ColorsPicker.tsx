import {
    PEN_SETTINGS_DISPATCH_ACTIONS,
    PenSettingsContext,
    usePenSettingsDispatch
} from "@/src/contexts/PenSettingsContext";
import {useContext} from "react";

const defaultColors = [
    '#000000',
    '#DDDDDD',
    '#0000FF',
    '#FF0000',
    '#00FF00',
    '#FFFF00',
    '#00FFFF',
    '#FF00FF',
]

export default function ColorsPicker() {
    const dispatch = usePenSettingsDispatch();
    const penSettings = useContext(PenSettingsContext);

    const changeColor = (color: string) => {
        dispatch({
            type: PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_COLOR,
            color: color,
        });
    }

    return (
        <>
            <h3 className="text-gray-800 text-sm mt-1">Color</h3>
            <div className="grid grid-cols-4 gap-2 mt-1">
                {defaultColors.map((color, index) => (
                    <div key={index}
                         onClick={() => changeColor(color)}
                         className={"rounded-full p-4 w-fit border-black " + (penSettings.color === color ? 'border-2' : '')}
                         style={{backgroundColor: color}}>
                    </div>
                ))}
            </div>
        </>
    )
}