export const resolution = 4;

export function createHiDPICanvas(w: number, h: number): HTMLCanvasElement {
    const ratio = resolution;
    const canvas = document.createElement("canvas");
    canvas.width = w * ratio;
    canvas.height = h * ratio;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    canvas.getContext("2d")!.setTransform(ratio, 0, 0, ratio, 0, 0);
    return canvas;
}

export function xToPx(x: string): number {
    const div = document.createElement("div");
    div.style.display = "block";
    div.style.height = x;
    document.body.appendChild(div);
    const px = parseFloat(window.getComputedStyle(div, null).height);
    document.body.removeChild(div);
    return px;
}
