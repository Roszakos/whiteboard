
type SvgPathProps = {
    d: string;
    color: string;
    width: number;
}

export default function SvgPath(props: SvgPathProps) {
    return (
        <path style={{fill: 'none', strokeWidth: props.width, stroke: props.color}} d={props.d}/>
    )
}