import JsBarcode from "jsbarcode";
import { createHiDPICanvas, xToPx } from "./canvas-utils.ts";
import { SignInfo } from "./main.ts";

const defaultBorderWidth = "2";
const font = "Impact";

export async function create2x4HangTag(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const canvasWidth = xToPx("48mm");
    const canvasHeight = xToPx("52mm");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = "black";
    ctx.lineWidth = parseFloat(defaultBorderWidth);
    ctx.textBaseline = "alphabetic";

    //border
    const lineLength = xToPx("3mm");
    ctx.beginPath();
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineLength, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - lineLength);
    ctx.stroke();

    //text1
    ctx.font = xToPx("5mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("7mm"));

    //text2
    ctx.font = xToPx("5mm") + "px " + font;
    ctx.fillText(signInfo.title2, canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2, xToPx("12mm"));

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx("23mm");
    let centsSize = xToPx("11.5mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;

    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - xToPx("8mm"); i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(signInfo.dollars, canvasWidth / 2 - priceWidth / 2, xToPx("34mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, canvasWidth / 2 + priceWidth / 2 - centsWidth, xToPx("27mm") - priceOffset);

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 0.8,
            height: 6,
            margin: 0,
            textMargin: 0,
            fontSize: 10,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = function () {
                ctx.drawImage(img, xToPx("36mm") - img.width / 2, xToPx("46mm"));
                resolve(null);
            };
        });
    }

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("44mm"));
    }

    //reg
    if (signInfo.regPrice !== "") {
        ctx.font = xToPx("5mm") + "px " + font;
        ctx.fillText("Reg. $" + signInfo.regPrice, canvasWidth / 2 - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2, xToPx("39mm"));
    }

    return c;
}

export async function create3x5HangTag(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const canvasWidth = xToPx("2.875in");
    const canvasHeight = xToPx("3.1875in");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = "black";
    ctx.lineWidth = parseFloat(defaultBorderWidth);
    ctx.textBaseline = "alphabetic";

    //border

    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(xToPx("10mm"), canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, xToPx("10mm"));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - xToPx("10mm"), canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - xToPx("10mm"));
    ctx.stroke();

    //text1
    ctx.font = xToPx("7mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("12mm"));

    //text2
    ctx.font = xToPx("7mm") + "px " + font;
    ctx.fillText(signInfo.title2, canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2, xToPx("19mm"));

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx("31mm");
    let centsSize = xToPx("15.5mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;

    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - 20; i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(signInfo.dollars, canvasWidth / 2 - priceWidth / 2, xToPx("49mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, canvasWidth / 2 + priceWidth / 2 - centsWidth, xToPx("39mm") - priceOffset);

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("64mm"));
    }

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 1,
            height: 6,
            fontSize: 12,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = function () {
                ctx.drawImage(img, xToPx("54mm") - img.width / 2, xToPx("69mm"));
                resolve(null);
            };
        });
    }

    //reg
    if (signInfo.regPrice !== "") {
        ctx.font = xToPx("6mm") + "px " + font;
        ctx.fillText("Reg. $" + signInfo.regPrice, canvasWidth / 2 - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2, xToPx("58mm"));
    }

    return c;
}

export async function create4x4FactTag(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const canvasWidth = xToPx("4in");
    const canvasHeight = xToPx("4in");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = "black";
    ctx.lineWidth = parseFloat(defaultBorderWidth);
    ctx.textBaseline = "alphabetic";

    //border
    const lineLength = xToPx("10mm");
    ctx.beginPath();
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineLength, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - lineLength);
    ctx.stroke();

    //text1
    ctx.font = xToPx("9mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("12mm"));

    //text2
    ctx.font = xToPx("9mm") + "px " + font;
    ctx.fillText(signInfo.title2, canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2, xToPx("21mm"));

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx("30mm");
    let centsSize = xToPx("15mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;
    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - xToPx("1.25in"); i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(signInfo.dollars, canvasWidth / 2 - priceWidth / 2, xToPx("55mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, canvasWidth / 2 + priceWidth / 2 - centsWidth, xToPx("45mm") - priceOffset);

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 1.4,
            height: 8,
            fontSize: 13,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, xToPx("74mm") - img.width / 2, xToPx("73mm"));
                resolve(null);
            };
        });
    }

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, xToPx("74mm") - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("87mm"));
    }

    if (signInfo.extras !== "") {
        //extras
        ctx.font = xToPx("5mm") + "px " + font;
        ctx.fillText(signInfo.extras, canvasWidth / 2 - ctx.measureText(signInfo.extras).width / 2, xToPx("68mm"));
    }

    //reg
    if (signInfo.regPrice !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Reg. $" + signInfo.regPrice, xToPx("10mm"), xToPx("87mm"));
    }

    return c;
}

export async function create4x2Binocular(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const canvasWidth = xToPx("4.5in");
    const canvasHeight = xToPx("2.70in");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = "black";
    ctx.lineWidth = parseFloat(defaultBorderWidth);
    ctx.textBaseline = "alphabetic";

    //border
    const lineLength = xToPx("10mm");
    ctx.beginPath();
    ctx.moveTo(lineLength, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lineLength, canvasHeight);
    ctx.lineTo(0, canvasHeight);
    ctx.lineTo(0, canvasHeight - lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, 0);
    ctx.lineTo(canvasWidth, 0);
    ctx.lineTo(canvasWidth, lineLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvasWidth - lineLength, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.lineTo(canvasWidth, canvasHeight - lineLength);
    ctx.stroke();

    //text1
    ctx.font = xToPx("8mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("36mm"));

    //text2
    //ctx.font = xToPx("9mm") + "px " + font;
    //ctx.fillText(signInfo.title2, (canvasWidth / 2) - (ctx.measureText(signInfo.title2).width / 2), xToPx("21mm"));

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx("24mm");
    let centsSize = xToPx("12mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;

    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = -1;

    for (let i = 0; priceWidth > canvasWidth - xToPx("65mm"); i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(signInfo.dollars, xToPx("80mm") - priceWidth / 2, xToPx("57mm") - priceOffset);

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, xToPx("80mm") + priceWidth / 2 - centsWidth, xToPx("49mm") - priceOffset);

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("3.5mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("62mm"));
    }

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 1,
            height: 8,
            margin: 0,
            textMargin: 0,
            fontSize: 13,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, xToPx("20mm") - img.width / 2, xToPx("60mm"));
                resolve(null);
            };
        });
    }

    //reg
    if (signInfo.regPrice !== "") {
        ctx.font = xToPx("4mm") + "px " + font;
        ctx.fillText("Reg. $" + signInfo.regPrice, xToPx("77mm"), xToPx("62mm"));
    }

    return c;
}

export async function create11x11SignInsert(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const o = xToPx("0.45in"); //margin offset
    const canvasWidth = xToPx("10.2in");
    const canvasHeight = xToPx("7.6in");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.textBaseline = "alphabetic";

    //text1
    ctx.font = xToPx("13mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("77mm") - o);

    //text2
    ctx.font = xToPx("13mm") + "px " + font;
    ctx.fillText(signInfo.title2, canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2, xToPx("90mm") - o);

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx(80 - (signInfo.extras !== "" ? 5 : 0) + "mm");
    let centsSize = xToPx("40mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;

    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - xToPx("4in"); i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(signInfo.dollars, canvasWidth / 2 - priceWidth / 2, xToPx("162mm") - o - priceOffset - (signInfo.extras === "" ? 0 : xToPx("4mm")));

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, canvasWidth / 2 + priceWidth / 2 - centsWidth, xToPx("136mm") - o - priceOffset);

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("6mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("184mm") - o);
    }

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 1.4,
            height: 8,
            fontSize: 13,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, xToPx("205mm") - img.width / 2, xToPx("179mm") - o);
                resolve(null);
            };
        });
    }

    //extras
    if (signInfo.extras !== "") {
        ctx.font = xToPx("8mm") + "px " + font;
        ctx.fillText(signInfo.extras, canvasWidth / 2 - ctx.measureText(signInfo.extras).width / 2, xToPx("167mm") - o);
    }

    //reg
    if (signInfo.regPrice !== "") {
        if (signInfo.extras !== "") {
            ctx.font = xToPx("10mm") + "px " + font;
        } else {
            ctx.font = xToPx("15mm") + "px " + font;
        }
        ctx.fillText("Reg. $" + signInfo.regPrice, canvasWidth / 2 - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2, xToPx("177mm") - o);
    }

    return c;
}

export async function create17x17SignInsert(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const o = xToPx("0.35in"); //margin offset
    const canvasWidth = xToPx("16.2in");
    const canvasHeight = xToPx("10.2in");

    const c = createHiDPICanvas(canvasWidth, canvasHeight);
    c.className = "signCanvas";

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.textBaseline = "alphabetic";

    //text1
    ctx.font = xToPx("22mm") + "px " + font;
    ctx.fillText(signInfo.title1, canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2, xToPx("64mm") - o);

    //text2
    ctx.font = xToPx("22mm") + "px " + font;
    ctx.fillText(signInfo.title2, canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2, xToPx("86mm") - o);

    //price
    let priceWidth = 0;
    let dollorsSize = xToPx(126 - (signInfo.extras === "" ? 0 : 9) + "mm");
    let centsSize = xToPx("63mm");

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;

    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - xToPx("6in"); i++) {
        dollorsSize--;
        centsSize--;
        priceOffset++;
        priceWidth = 0;
        ctx.font = dollorsSize + "px " + font;
        dollarsWidth = ctx.measureText(signInfo.dollars).width;
        priceWidth += dollarsWidth;
        ctx.font = centsSize + "px " + font;
        centsWidth = ctx.measureText(signInfo.cents).width;
        priceWidth += centsWidth;
    }

    priceOffset = priceOffset / 2;

    //dollor
    ctx.font = dollorsSize + "px " + font;

    ctx.fillText(signInfo.dollars, canvasWidth / 2 - priceWidth / 2, xToPx("198mm") - o - priceOffset - (signInfo.extras === "" ? 0 : xToPx("8mm")));

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(signInfo.cents, canvasWidth / 2 + priceWidth / 2 - centsWidth, xToPx("154mm") - o - priceOffset);

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx("8mm") + "px " + font;
        ctx.fillText("Sale Ends " + signInfo.endDate, canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2, xToPx("232mm") - o);
    }

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: 2,
            height: 14,
            margin: 0,
            textMargin: 0,
            fontSize: 20,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = function () {
                ctx.drawImage(img, xToPx("315mm") - img.width / 2, xToPx("224mm") - o);
                resolve(null);
            };
        });
    }

    //extras
    if (signInfo.extras !== "") {
        ctx.font = xToPx("14mm") + "px " + font;
        ctx.fillText(signInfo.extras, canvasWidth / 2 - ctx.measureText(signInfo.extras).width / 2, xToPx("205mm") - o);
    }

    //reg
    if (signInfo.regPrice !== "") {
        if (signInfo.extras !== "") {
            ctx.font = xToPx("16mm") + "px " + font;
        } else {
            ctx.font = xToPx("24mm") + "px " + font;
        }
        ctx.fillText("Reg. $" + signInfo.regPrice, canvasWidth / 2 - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2, xToPx("221mm") - o);
    }

    return c;
}
