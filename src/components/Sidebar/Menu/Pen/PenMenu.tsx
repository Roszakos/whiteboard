import MenuHeading from "@/src/components/Sidebar/Menu/MenuHeading";
import ColorsPicker from "@/src/components/Sidebar/Menu/Pen/ColorsPicker";
import WidthSelector from "@/src/components/Sidebar/Menu/Pen/WidthSelector";

export default function PenMenu() {
    return (
        <div className="p-3 bg-white mt-3 rounded-lg">
            <MenuHeading title={"Pen"}/>
            <ColorsPicker/>
        </div>
    )
}