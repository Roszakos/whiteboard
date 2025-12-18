import {Color} from "@/src/components/ColorPicker/ColorPicker";
import {MouseEvent as ReactMouseEvent, useEffect, useRef, useState} from "react";
import {getCursorCoordinatesRelativeToDiv} from "@/src/components/ColorPicker/utils";


type PrimaryColorPickerProps = {
    currentColor: Color;
    changePrimaryColor: (color: Color) => void
}

const colors: Color[] = [
    {r: 255, g: 0, b: 0},
    {r: 255, g: 255, b: 0},
    {r: 0, g: 255, b: 0},
    {r: 0, g: 255, b: 255},
    {r: 0, g: 0, b: 255},
    {r: 255, g: 0, b: 255},
];

/**
 * @param pickerWidth - width of the picker element
 * @param pickPositionX - X value of the cursor, already calculated to be relative to the picker.
 */
function calculatePickedColor(pickerWidth: number, pickPositionX: number): Color {
    // The picker is a list of linear gradients, each combined of two of the `colors` array.
    //
    // To get the colour under the cursor position, we have to first determine on which gradient the cursor is, i.e.
    // between which two colours the cursor is - the colours will be the left and right boundaries
    //
    // Then, based on the calculated distance between the two colours, we can get the colour under the position of the cursor.

    // This value floored and ceiled should give us the left and right colour, relative to the cursor.
    const xRelativeToColorsList = (pickPositionX / pickerWidth) * (colors.length - 1);
    const leftColor = colors[Math.floor(xRelativeToColorsList)];
    const rightColor = colors[Math.ceil(xRelativeToColorsList)];

    const distanceToNextColor = xRelativeToColorsList - Math.floor(xRelativeToColorsList);

    return {
        r: leftColor.r + distanceToNextColor * (rightColor.r - leftColor.r),
        g: leftColor.g + distanceToNextColor * (rightColor.g - leftColor.g),
        b: leftColor.b + distanceToNextColor * (rightColor.b - leftColor.b),
    }
}

export default function PrimaryColorPicker(props: PrimaryColorPickerProps) {
    const [currentColor, setCurrentColor] = useState<Color>(props.currentColor);
    const [isPicking, setIsPicking] = useState<boolean>(false);
    const [pickPosition, setPickPosition] = useState<number>(0); // for this we operate just on the x-axis

    const picker = useRef<HTMLDivElement | null>(null);

    const startChangingPrimaryColor = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (picker.current === null) {
            return;
        }

        setIsPicking(true);

        const rect = picker.current.getBoundingClientRect();
        const [xRelativeToPicker] = getCursorCoordinatesRelativeToDiv(rect, e.clientX, e.clientY);
        setPickPosition(xRelativeToPicker);

        const color: Color = calculatePickedColor(rect.width, xRelativeToPicker);
        setCurrentColor(color);
        props.changePrimaryColor(color);
    }

    useEffect(() => {
        if (isPicking) {
            const handleMouseMove = (e: MouseEvent) => {
                if (picker.current === null) {
                    return;
                }

                const rect = picker.current.getBoundingClientRect();
                const [xRelativeToPicker] = getCursorCoordinatesRelativeToDiv(rect, e.clientX, e.clientY);
                setPickPosition(xRelativeToPicker);

                const color: Color = calculatePickedColor(rect.width, xRelativeToPicker);
                setCurrentColor(color);
                props.changePrimaryColor(color);
            }

            const handleMouseUp = () => {
                setIsPicking(false);
            }

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        }
    }, [isPicking, props]);

    return (
        <div className="flex relative mt-4" onMouseDown={startChangingPrimaryColor}>
            <div className="w-full flex justify-stretch rounded-md overflow-hidden " ref={picker}>
                {
                    Array.from({length: colors.length - 1}, (e, i) => i).map((i) => (
                        <div key={i} className="h-full py-1 grow z-50"
                             style={{
                                 background: `linear-gradient(90deg, rgb(${colors[i].r}, ${colors[i].g}, ${colors[i].b}) 0%, rgb(${colors[i + 1].r}, ${colors[i + 1].g}, ${colors[i + 1].b}) 100%)`
                             }}>

                        </div>
                    ))
                }
            </div>
            {/*Picked color indicator*/}
            <div className="flex items-center top-0 absolute h-full">
                <div className="flex items-center relative h-full">
                    <div className={`rounded-full absolute w-[22px] h-[22px] border-2 z-50`}
                         style={{
                             backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
                             left: `${pickPosition - 10}px`, // subtracted by half of the width of the element
                         }}>
                    </div>
                </div>
            </div>
        </div>
    )
}