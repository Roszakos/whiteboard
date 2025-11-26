
type SvgPathProps = {
    d: string;
}

export default function SvgPath(props: SvgPathProps) {
    return (
        <path style={{fill: 'none', strokeWidth: 2, stroke: 'black'}} d={props.d}/>
    )
}