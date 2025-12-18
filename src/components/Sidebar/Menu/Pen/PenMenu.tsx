import MenuHeading from "@/src/components/Sidebar/Menu/MenuHeading";
import ColorsPicker from "@/src/components/Sidebar/Menu/Pen/ColorsPicker";
import WidthSelector from "@/src/components/Sidebar/Menu/Pen/WidthSelector";
import MenuContainer from "@/src/components/Sidebar/Menu/MenuContainer";

export default function PenMenu() {
    return (
        <MenuContainer>
            <MenuHeading title={"Pen"}/>
            <ColorsPicker/>
            <WidthSelector/>
        </MenuContainer>
    )
}