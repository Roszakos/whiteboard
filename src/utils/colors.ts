import {Color} from "@/src/components/ColorPicker/ColorPicker";

export function colorToRgb(color: Color) {
    return 'rgb(' + color.r + ', ' + color.g + ',' + color.b + ')';
}