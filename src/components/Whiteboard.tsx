'use client';
import {MouseEvent as ReactMouseEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import SvgPath from "@/src/components/SvgPath";
import {PenSettingsContext} from "@/src/contexts/PenSettingsContext";
import {ToolContext} from "@/src/contexts/ToolContext";

const MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET = 30;

type Path = {
    value: string;
    color: string;
    width: number;
}

type Coordinates = {
    x: number;
    y: number;
}

interface Event {
    pathStateAfter: Path[];
}

export default function Whiteboard() {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState<Coordinates | null>(null);
    const [currentScreenTranslate, setCurrentScreenTranslate] = useState<Coordinates>({x: 0, y: 0});

    const [currentPath, setCurrentPath] = useState<Path | null>(null);
    const [paths, setPaths] = useState<Path[]>([]);
    const [events, setEvents] = useState<Event[]>([{pathStateAfter: []}]);
    const [undoneEvents, setUndoneEvents] = useState<Event[]>([]);

    const penSettings = useContext(PenSettingsContext);
    const tool = useContext(ToolContext);

    const svg = useRef<SVGSVGElement | null>(null);

    const handleMouseDown = (e: ReactMouseEvent<SVGSVGElement>) => {
        if (tool === 'pen') {
            startDrawing(e);
        } else if (tool === 'hand') {
            startScreenDragging(e);
        }
    }

    const handleMouseUp = () => {
        if (tool === 'pen') {
            stopDrawing();
        } else if (tool === 'hand') {
            stopScreenDragging();
        }
    }

    const startScreenDragging = (e: ReactMouseEvent<SVGSVGElement>) => {
        if (isMouseDown || svg.current === null || lastMousePosition !== null) {
            return;
        }

        setIsMouseDown(true);
        setLastMousePosition({
            x: e.clientX,
            y: e.clientY,
        });
    }

    const stopScreenDragging = () => {
        if (!isMouseDown || lastMousePosition === null) {
            return;
        }

        setIsMouseDown(false);
        setLastMousePosition(null);
    }

    const startDrawing = (e: ReactMouseEvent<SVGSVGElement>) => {
        if (currentPath !== null || isMouseDown || svg.current === null) {
            return;
        }

        const rect = svg.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);

        setCurrentPath({
            value: `M${x} ${y}`,
            color: penSettings.color,
            width: penSettings.width,
        });
        setIsMouseDown(true);
    }

    const stopDrawing = useCallback(() => {
        if (svg.current === null || !isMouseDown || currentPath === null) {
            return;
        }

        setPaths(prevState => [...prevState, {
            ...currentPath,
        }]);

        setEvents(prevState => [...prevState, {
            pathStateAfter: [...paths, {
                ...currentPath,
            }]
        }]);
        setUndoneEvents([]);
        setCurrentPath(null);
        setIsMouseDown(false);
    }, [currentPath, isMouseDown, paths]);

    const undoLastEvent = useCallback(() => {
        if (events.length > 1) {
            const newPaths = events[events.length - 2].pathStateAfter;
            const eventToUndo = events[events.length - 1];

            setEvents(events.slice(0, -1));
            setUndoneEvents(prevState => [...prevState, eventToUndo]);
            setPaths(newPaths);
        }
    }, [events]);

    const undoLastUndoneEvent = useCallback(() => {
        if (undoneEvents.length > 0) {
            const event = undoneEvents[undoneEvents.length - 1];

            setEvents(prevState => [...prevState, event]);
            setUndoneEvents(undoneEvents.slice(0, -1));
            setPaths(event.pathStateAfter);
        }
    }, [undoneEvents]);

    const clearPaths = () => {
        if (paths.length === 0) {
            return;
        }

        setEvents(prevState => [...prevState, {pathStateAfter: []}]);
        setUndoneEvents([]);
        setPaths([]);
    }

    const handleKeyPress = useCallback((e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'z' && e.ctrlKey) {
            undoLastEvent();
        } else if (e.key.toLowerCase() === 'y' && e.ctrlKey) {
            undoLastUndoneEvent();
        }
    }, [undoLastEvent, undoLastUndoneEvent]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress])

    useEffect(() => {
        if (isMouseDown) {
            const isMouseOutOfBound = (drawingRect: DOMRect, event: MouseEvent) => {
                return (
                    (event.clientX + MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) < drawingRect.x ||
                    (event.clientY + MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) < drawingRect.y ||
                    (event.clientX - MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) > (drawingRect.x + drawingRect.width) ||
                    (event.clientY - MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) > (drawingRect.y + drawingRect.height)
                )
            }

            const draw = (e: MouseEvent) => {
                if (svg.current === null || !isMouseDown || currentPath === null) {
                    return;
                }

                const rect = svg.current.getBoundingClientRect();
                if (isMouseOutOfBound(rect, e)) {
                    stopDrawing();
                    return;
                }

                const x = Math.round(e.clientX - rect.left);
                const y = Math.round(e.clientY - rect.top);

                setCurrentPath(prevState => {
                    if (prevState === null) {
                        return prevState;
                    }

                    return {
                        ...prevState,
                        value: `${prevState?.value} L${x} ${y}`,
                    }
                });
            };

            const moveScreen = (e: MouseEvent) => {
                if (lastMousePosition === null || svg.current === null) {
                    return;
                }

                const offsetX = e.clientX - lastMousePosition.x;
                const offsetY = e.clientY - lastMousePosition.y;

                const newX = currentScreenTranslate.x + offsetX;
                const newY = currentScreenTranslate.y + offsetY;

                svg.current.style.transform = `translate(${newX}px, ${newY}px)`;
                setCurrentScreenTranslate({
                    x: newX,
                    y: newY,
                })
                setLastMousePosition({
                    x: e.clientX,
                    y: e.clientY,
                })
            }

            const handleMouseMove = (e: MouseEvent) => {
                switch (tool) {
                    case 'pen':
                        draw(e);
                        break;
                    case 'eraser':
                        return;
                    case 'hand':
                        moveScreen(e);
                        return;
                    default:
                        return;
                }
            }

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [currentPath, currentScreenTranslate, isMouseDown, lastMousePosition, stopDrawing, tool]);

    return (
        <div className="text-black w-full h-screen overflow-hidden">
            {/*<button className="px-3 py-2 rounded-md bg-cyan-200 my-2" onClick={() => clearPaths()}>CLEAR</button>*/}
            <svg ref={svg} id="whiteboard" width="200%" height="200%"
                 onDragStart={(e) => e.preventDefault()}
                 onMouseDown={(e) => handleMouseDown(e)}
                 onMouseUp={() => handleMouseUp()}>
                {
                    paths.map((path, i) => (
                        <SvgPath d={path.value} key={i} color={path.color} width={path.width}/>
                    ))
                }
                {
                    currentPath !== null &&
                    (
                        <SvgPath d={currentPath.value} color={currentPath.color} width={currentPath.width}/>
                    )
                }
            </svg>
        </div>
    )
}