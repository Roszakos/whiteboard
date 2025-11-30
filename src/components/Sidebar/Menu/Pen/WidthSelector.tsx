import {useContext, useEffect, useRef, useState} from "react";
import {
    PEN_SETTINGS_DISPATCH_ACTIONS,
    PenSettingsContext,
    usePenSettingsDispatch
} from "@/src/contexts/PenSettingsContext";

const MIN_WIDTH = 1;
const MAX_WIDTH = 36;

export default function WidthSelector() {
    const penSettings = useContext(PenSettingsContext);
    const penSettingsDispatch = usePenSettingsDispatch();
    const [currentWidthPercentage, setCurrentWidthPercentage] = useState<`${number}%`>(
        `${Math.round(
            Math.min(
                Math.max(
                    (penSettings.width / (MAX_WIDTH - MIN_WIDTH) - MIN_WIDTH / (MAX_WIDTH - MIN_WIDTH)) * 100,
                    0
                ),
                95
            )
        )}%`
    );

    const [isChangingWidth, setIsChangingWidth] = useState<boolean>(false);

    const widthCircle = useRef<HTMLDivElement>(null);
    const widthBar = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsChangingWidth(true);
        document.body.style.cursor = 'none';
    }

    useEffect(() => {
        if (isChangingWidth) {
            const updateWidth = (cursorXPosition: number) => {
                if (widthBar.current === null) {
                    return;
                }

                const rect = widthBar.current.getBoundingClientRect();
                const minX = rect.x;
                const maxX = minX + rect.width;

                const normalizedX = Math.min(Math.max(cursorXPosition, minX), maxX) - minX;
                const newWidth = Math.max(
                    MIN_WIDTH,
                    Math.round((normalizedX / (maxX - minX)) * MAX_WIDTH)
                );

                setCurrentWidthPercentage(`${
                    Math.min((newWidth / (MAX_WIDTH - MIN_WIDTH) - (MIN_WIDTH / (MAX_WIDTH - MIN_WIDTH))) * 100, 95)
                }%`);

                penSettingsDispatch({
                    type: PEN_SETTINGS_DISPATCH_ACTIONS.CHANGE_WIDTH,
                    width: newWidth
                });
            }

            const handleMouseUp = (e: MouseEvent) => {
                if (!isChangingWidth) {
                    return;
                }

                updateWidth(e.clientX);
                document.body.style.cursor = 'auto';
                setIsChangingWidth(false);
            }

            const handleMouseMove = (e: MouseEvent) => {
                if (!isChangingWidth) {
                    return;
                }

                updateWidth(e.clientX);
            }

            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mouseup', handleMouseUp);
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }, [isChangingWidth, penSettingsDispatch])

    return (
        <>
            <h3 className="text-gray-800 text-sm mt-2">Width</h3>
            <div className="flex mt-1 gap-4 items-center">
                <div ref={widthBar}
                     className="grow relative flex py-2"
                     onMouseDown={handleMouseDown}
                     onDragStart={(e) => e.preventDefault()}>
                    <div className="h-[5px] bg-blue-500" style={{width: currentWidthPercentage}}></div>
                    <div className="h-[5px] bg-blue-300 grow"></div>
                    <div
                        className={"p-2 rounded-full bg-white border-blue-500 absolute self-center " + (isChangingWidth ? "border-2" : "border-1")}
                        style={{left: currentWidthPercentage}}
                        ref={widthCircle}>
                    </div>
                </div>

                <div className="py-1 px-3 font-semibold border-1 border-black rounded-md">
                    {penSettings.width}
                </div>
            </div>
        </>
    )
}