import ToolsMenu from "@/src/components/Sidebar/Menu/Tools/ToolsMenu";
import PenMenu from "@/src/components/Sidebar/Menu/Pen/PenMenu";

export default function Sidebar() {
    return (
        <div className="p-4 h-[100vh] bg-gray-100 text-black min-w-[260px]">
            <h1 className="font-bold text-blue-600 text-lg">
                Whiteboard App
            </h1>

            <ToolsMenu />
            <PenMenu />

            {/*<ShapesMenu />*/}
            {/*<HistoryMenu />*/}

            {/*<LayersMenu/>*/}
            {/*<View/>*/}
        </div>
    )
}