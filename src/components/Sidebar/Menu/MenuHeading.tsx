type MenuHeadingProps = {
    title: string;
}

export default function MenuHeading(props: MenuHeadingProps) {
    return (
        <h2 className="font-semibold text-black text-sm">
            {props.title}
        </h2>
    )
}