import {ReactNode} from "react";

type MenuContainerProps = {
    children: ReactNode;
}

export default function MenuContainer(props: MenuContainerProps) {
    return (
        <div className="p-3 bg-white mt-3 rounded-lg">
            {props.children}
        </div>
    )
}