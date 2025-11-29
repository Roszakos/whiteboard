import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

type ToolsMenuItemProps = {
    icon: IconDefinition,
    isSelected: boolean;
    onClick: () => void;
}

export default function ToolsMenuItem(props: ToolsMenuItemProps) {
    return (
        <button className={"p-2 rounded-lg cursor-pointer " + (props.isSelected ? 'bg-blue-500' : '')} onClick={props.onClick}>
            <FontAwesomeIcon icon={props.icon} size="lg" color={props.isSelected ? 'white' : 'black'} />
        </button>
    )
}