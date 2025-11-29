import {faPen} from "@fortawesome/free-solid-svg-icons/faPen";
import {faEraser} from "@fortawesome/free-solid-svg-icons/faEraser";
import {faHand} from "@fortawesome/free-solid-svg-icons/faHand";
import ToolsMenuItem from "@/src/components/Sidebar/Menu/Tools/ToolsMenuItem";
import {useContext} from "react";
import {SetToolContext, ToolContext} from "@/src/contexts/ToolContext";
import MenuHeading from "@/src/components/Sidebar/Menu/MenuHeading";


export default function ToolsMenu() {
    const tool = useContext(ToolContext);
    const setTool = useContext(SetToolContext);

    if (setTool === null) {
        return null;
    }

    return (
        <div className="p-3 bg-white mt-3 rounded-lg">
            <MenuHeading title={"Tools"} />

            <div className="flex items-center justify-between gap-4 mt-1">
                <ToolsMenuItem icon={faPen} isSelected={tool === 'pen'} onClick={() => setTool('pen')} />
                <ToolsMenuItem icon={faEraser} isSelected={tool === 'eraser'} onClick={() => setTool('eraser')}/>
                <ToolsMenuItem icon={faHand} isSelected={tool === 'hand'} onClick={() => setTool('hand')} />
            </div>
        </div>
    )
}