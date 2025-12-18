import {MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef, useState} from "react";
import PrimaryColorPicker from "@/src/components/ColorPicker/PrimaryColorPicker";
import {getCursorCoordinatesRelativeToDiv} from "@/src/components/ColorPicker/utils";


type ColorPickerProps = {
    visible: boolean,
    currentColor: Color,
    hide?: () => void,
    onColorChange: (color: Color) => void,
}

export type Color = {
    r: number
    g: number
    b: number
}

export type Coordinates = {
    x: number
    y: number
}

/**
 * @param primaryColor
 * @param y - Position of cursor already calculated to describe the value 0-255 where 0 is cursor on the top
 *  border and 255 is cursor on the bottom border
 * @param x - Position of cursor already calculated to describe the value 0-255 where 0 is cursor on the left
 *  border and 255 is cursor on the right border
 */
function getColor(primaryColor: Color, y: number, x: number) {
    const startingColor: Color = {r: 255 - y, g: 255 - y, b: 255 - y};
    const endingColor: Color = {
        r: Math.round(primaryColor.r - (primaryColor.r / 255 * y)),
        g: Math.round(primaryColor.g - (primaryColor.g / 255 * y)),
        b: Math.round(primaryColor.b - (primaryColor.b / 255 * y))
    };

    const r = (startingColor.r - Math.floor((startingColor.r - endingColor.r) / 255 * x));
    const g = (startingColor.g - Math.floor((startingColor.g - endingColor.g) / 255 * x));
    const b = (startingColor.b - Math.floor((startingColor.b - endingColor.b) / 255 * x));

    return {r, g, b};
}

function getGradientBackground(primaryColor: Color): string {
    return `linear-gradient(90deg,rgb(255, 255, 255) 0%, rgb(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}) 100%)`
}

export default function ColorPicker(props: ColorPickerProps) {
    // const [pickedColor, setpickedColor] = useState<Color>(props.currentColor);
    const [currentPickPosition, setCurrentPickPosition] = useState<Coordinates>({x: 0, y: 0}); // relative to picker area
    const [primaryColor, setPrimaryColor] = useState<Color>({r: 255, g: 0, b: 0});

    const [isPicking, setIsPicking] = useState<boolean>(false);

    const picker = useRef<HTMLDivElement | null>(null);

    const updatePickPositionAndColor = useCallback((cursorX: number, cursorY: number) => {
        if (picker.current === null) {
            return;
        }

        const pickerRect = picker.current.getBoundingClientRect();
        const [xRelativeToPicker, yRelativeToPicker] = getCursorCoordinatesRelativeToDiv(pickerRect, cursorX, cursorY);
        setCurrentPickPosition({x: xRelativeToPicker, y: yRelativeToPicker});

        const calculatedX = Math.round((xRelativeToPicker / pickerRect.width) * 255);
        const calculatedY = Math.round((yRelativeToPicker / pickerRect.height) * 255);
        props.onColorChange(getColor(primaryColor, calculatedY, calculatedX));
    }, [primaryColor, props]);

    const updatePrimaryColor = (color: Color) => {
        if (picker.current === null) {
            return;
        }

        setPrimaryColor(color);
        const pickerRect = picker.current.getBoundingClientRect();
        const calculatedX = Math.round((currentPickPosition.x / pickerRect.width) * 255);
        const calculatedY = Math.round((currentPickPosition.y / pickerRect.height) * 255);
        props.onColorChange(getColor(color, calculatedY, calculatedX));
    }

    const startPicking = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (picker.current === null) {
            return;
        }

        setIsPicking(true);
        updatePickPositionAndColor(e.clientX, e.clientY);
    }

    useEffect(() => {
        if (isPicking) {
            const handleMouseMove = (e: MouseEvent) => {
                updatePickPositionAndColor(e.clientX, e.clientY);
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
    }, [isPicking, primaryColor, updatePickPositionAndColor]);

    if (!props.visible) {
        return;
    }

    return (
        <>
            <div className="w-full aspect-video border-2 relative z-50" ref={picker} onMouseDown={startPicking}>
                {/*Transition white -> primary color (left to right)*/}
                <div className="w-full h-full absolute left-0 top-0"
                     style={{background: getGradientBackground(primaryColor)}}>
                </div>

                {/*Transition black -> transparent (bottom to top)*/}
                <div className="w-full h-full absolute left-0 top-0"
                     style={{background: "linear-gradient(360deg,rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)"}}>
                </div>

                {/*Picked color indicator*/}
                <div className={`rounded-full absolute w-[22px] h-[22px] border-2 z-50`}
                     style={{
                         backgroundColor: `rgb(${props.currentColor.r}, ${props.currentColor.g}, ${props.currentColor.b})`,
                         left: `${currentPickPosition.x - 12}px`, // subtracted by half of the width of the element
                         top: `${currentPickPosition.y - 12}px`, // subtracted by half of the height of the element
                     }}>
                </div>
            </div>

            <PrimaryColorPicker currentColor={primaryColor} changePrimaryColor={updatePrimaryColor}/>
        </>
    )
}