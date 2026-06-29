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

export function mirrorCanvas(originalCanvas: HTMLCanvasElement, direction: "horizontal" | "vertical"): HTMLCanvasElement {
    const mirroredCanvas = document.createElement("canvas");
    if (direction === "vertical") {
        mirroredCanvas.width = originalCanvas.width;
        mirroredCanvas.height = originalCanvas.height * 2;
    } else if (direction === "horizontal") {
        mirroredCanvas.width = originalCanvas.width * 2;
        mirroredCanvas.height = originalCanvas.height;
    }
    const ctx = mirroredCanvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(originalCanvas, 0, 0);
    ctx.save();
    if (direction === "vertical") {
        ctx.translate(originalCanvas.width, originalCanvas.height * 2);
        ctx.scale(-1, -1);
        ctx.drawImage(originalCanvas, 0, 0);
    } else if (direction === "horizontal") {
        console.log("mirroring horizontally");
        ctx.translate(originalCanvas.width, 0);
        ctx.drawImage(originalCanvas, 0, 0);
    }
    ctx.restore();
    return mirroredCanvas;
}
