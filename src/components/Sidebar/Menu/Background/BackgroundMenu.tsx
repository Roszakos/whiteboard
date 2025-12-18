import MenuContainer from "@/src/components/Sidebar/Menu/MenuContainer";
import MenuHeading from "@/src/components/Sidebar/Menu/MenuHeading";
import ColorPicker, {Color} from "@/src/components/ColorPicker/ColorPicker";
import {useContext} from "react";
import {
    BackgroundSettingsAction,
    BackgroundSettingsContext,
    useBackgroundSettingsDispatch
} from "@/src/contexts/BackgroundSettingsContext";


export default function BackgroundMenu() {
    const backgroundSettings = useContext(BackgroundSettingsContext);
    const backgroundSettingsDispatch = useBackgroundSettingsDispatch();

    const changeColor = (color: Color) => {
        backgroundSettingsDispatch({
            type: BackgroundSettingsAction.CHANGE_COLOR,
            color: color
        });
    }

    return (
        <MenuContainer>
            <MenuHeading title={"Background color"}/>
            <div className="mt-3">
                <ColorPicker visible={true} currentColor={backgroundSettings.color} onColorChange={changeColor}/>
            </div>
        </MenuContainer>
    )
}