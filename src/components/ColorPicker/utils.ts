export function getCursorCoordinatesRelativeToDiv(pickerRect: DOMRect, cursorX: number, cursorY: number): [x: number, y: number] {
    const leftBorder = pickerRect.x;
    const rightBorder = pickerRect.x + pickerRect.width;
    const topBorder = pickerRect.y;
    const bottomBorder = pickerRect.y + pickerRect.height;

    const normalizedCursorX = Math.max(
        Math.min(cursorX, rightBorder),
        leftBorder
    );
    const normalizedCursorY = Math.max(
        Math.min(cursorY, bottomBorder),
        topBorder
    );

    const xRelativeToPicker = normalizedCursorX - leftBorder;
    const yRelativeToPicker = normalizedCursorY - topBorder;

    return [xRelativeToPicker, yRelativeToPicker];
}