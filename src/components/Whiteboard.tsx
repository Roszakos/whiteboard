'use client';
import {MouseEvent as ReactMouseEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import SvgPath from "@/src/components/SvgPath";
import {PenSettingsContext} from "@/src/contexts/PenSettingsContext";

const MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET = 30;

type Path = {
    value: string;
    color: string;
    width: number;
    // key?: number;
}

interface Event {
    pathStateAfter: Path[];
}

export default function Whiteboard() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<Path | null>(null);
    const [paths, setPaths] = useState<Path[]>([]);
    const [events, setEvents] = useState<Event[]>([{pathStateAfter: []}]);
    const [undoneEvents, setUndoneEvents] = useState<Event[]>([]);

    const penSettings = useContext(PenSettingsContext);

    const svg = useRef<SVGSVGElement | null>(null);

    const startDrawing = (e: ReactMouseEvent<SVGSVGElement>) => {
        if (currentPath !== null || isDrawing || svg.current === null) {
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
        setIsDrawing(true);
    }

    const stopDrawing = useCallback(() => {
        if (svg.current === null || !isDrawing || currentPath === null) {
            return;
        }

        setPaths(prevState => [...prevState, {
            ...currentPath,
            // key: paths.length + 1,
        }]);

        setEvents(prevState => [...prevState, {
            pathStateAfter: [...paths, {
                ...currentPath,
                // key: paths.length + 1
            }]
        }]);
        setUndoneEvents([]);
        setCurrentPath(null);
        setIsDrawing(false);
    }, [currentPath, isDrawing, paths]);

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
        if (isDrawing) {
            const isMouseOutOfBound = (drawingRect: DOMRect, event: MouseEvent) => {
                return (
                    (event.clientX + MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) < drawingRect.x ||
                    (event.clientY + MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) < drawingRect.y ||
                    (event.clientX - MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) > (drawingRect.x + drawingRect.width) ||
                    (event.clientY - MOUSE_ACCEPTABLE_OUT_OF_BOUND_OFFSET) > (drawingRect.y + drawingRect.height)
                )
            }

            const draw = (e: MouseEvent) => {
                if (svg.current === null || !isDrawing || currentPath === null) {
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

            window.addEventListener('mousemove', draw);
            return () => window.removeEventListener('mousemove', draw);
        }
    }, [currentPath, isDrawing, stopDrawing]);

    return (
        <div className="text-black">
            <button className="px-3 py-2 rounded-md bg-cyan-200 my-2" onClick={() => clearPaths()}>CLEAR</button>
            <svg ref={svg} id="whiteboard" width="1000" height="600" className="border-1 border-black bg-white"
                 onDragStart={(e) => e.preventDefault()}
                 onMouseDown={(e) => startDrawing(e)}
                 onMouseUp={() => stopDrawing()}>
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