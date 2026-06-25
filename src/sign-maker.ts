import JsBarcode from "jsbarcode";
import { createHiDPICanvas, xToPx } from "./canvas-utils.ts";
import { SignInfo } from "./main.ts";
import { signConfigs, SignConfig } from "./sign-configs.ts";

const defaultBorderWidth = "2";
const font = "Impact";

export async function createSignCanvas(signInfo: SignInfo): Promise<HTMLCanvasElement> {
    const config: SignConfig = signConfigs[signInfo.type];
    if (!config) {
        throw new Error("Sign Type Not Supported");
    }

    const canvasWidth = xToPx(config.width);
    const canvasHeight = xToPx(config.height);
    const offset = xToPx(config.marginOffset);

    const c = createHiDPICanvas(canvasWidth, canvasHeight);

    const ctx = c.getContext("2d") as CanvasRenderingContext2D;

    ctx.strokeStyle = "black";
    ctx.lineWidth = parseFloat(defaultBorderWidth);
    ctx.textBaseline = "alphabetic";

    //border
    if (config.borderLineLength) {
        const borderLineLength = xToPx(config.borderLineLength);
        ctx.beginPath();
        ctx.moveTo(borderLineLength, 0);
        ctx.lineTo(0, 0);
        ctx.lineTo(0, borderLineLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(borderLineLength, canvasHeight);
        ctx.lineTo(0, canvasHeight);
        ctx.lineTo(0, canvasHeight - borderLineLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvasWidth - borderLineLength, 0);
        ctx.lineTo(canvasWidth, 0);
        ctx.lineTo(canvasWidth, borderLineLength);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvasWidth - borderLineLength, canvasHeight);
        ctx.lineTo(canvasWidth, canvasHeight);
        ctx.lineTo(canvasWidth, canvasHeight - borderLineLength);
        ctx.stroke();
    }

    //title1
    ctx.font = xToPx(config.title1.fontSize) + "px " + font;
    ctx.fillText(
        signInfo.title1,
        config.title1.centered ? canvasWidth / 2 - ctx.measureText(signInfo.title1).width / 2 : xToPx(config.title1.x),
        xToPx(config.title1.y) - offset,
    );

    //title2
    if (config.title2) {
        ctx.font = xToPx(config.title2.fontSize) + "px " + font;
        ctx.fillText(
            signInfo.title2,
            config.title2.centered ? canvasWidth / 2 - ctx.measureText(signInfo.title2).width / 2 : xToPx(config.title2.x),
            xToPx(config.title2.y) - offset,
        );
    }

    //price
    let priceWidth = 0;
    let dollorsSize =
        signInfo.extras && config.price.dollarsFontSizeWithExtras ? xToPx(config.price.dollarsFontSizeWithExtras) : xToPx(config.price.dollarsFontSize);
    let centsSize = xToPx(config.price.centsFontSize);

    ctx.font = dollorsSize + "px " + font;
    let dollarsWidth = ctx.measureText(signInfo.dollars).width;
    priceWidth += dollarsWidth;
    ctx.font = centsSize + "px " + font;
    let centsWidth = ctx.measureText(signInfo.cents).width;
    priceWidth += centsWidth;

    let priceOffset = 0;

    for (let i = 0; priceWidth > canvasWidth - xToPx(config.price.margin); i++) {
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
    let dollorBaseY = config.price.dollarsY;
    if (signInfo.extras && config.price.dollarsYWithExtras) {
        dollorBaseY = config.price.dollarsYWithExtras;
    }
    ctx.font = dollorsSize + "px " + font;
    ctx.fillText(
        signInfo.dollars,
        config.price.centered ? canvasWidth / 2 - priceWidth / 2 : xToPx(config.price.x) - priceWidth / 2,
        xToPx(dollorBaseY) - priceOffset - offset,
    );

    //cent
    ctx.font = centsSize + "px " + font;
    ctx.fillText(
        signInfo.cents,
        config.price.centered ? canvasWidth / 2 + priceWidth / 2 - centsWidth : xToPx(config.price.x) + priceWidth / 2 - centsWidth,
        xToPx(config.price.centsY) - priceOffset - offset,
    );

    //sku
    if (signInfo.sku !== "") {
        const svgNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgNode.id = "barcode";

        JsBarcode(svgNode, signInfo.sku, {
            width: config.barcode.width,
            height: config.barcode.height,
            fontSize: config.barcode.fontSize,
            margin: 0,
            textMargin: 0,
            xmlDocument: document,
        });
        const xml = new XMLSerializer().serializeToString(svgNode);
        const base64 = "data:image/svg+xml;base64," + btoa(xml);
        const img = new Image();
        img.src = base64;

        await new Promise((resolve) => {
            img.onload = () => {
                ctx.drawImage(img, xToPx(config.barcode.x) - img.width / 2, xToPx(config.barcode.y) - offset);
                resolve(null);
            };
        });
    }

    //sale ends
    if (signInfo.endDate !== "") {
        ctx.font = xToPx(config.endDate.fontSize) + "px " + font;
        ctx.fillText(
            "Sale Ends " + signInfo.endDate,
            config.endDate.centered
                ? canvasWidth / 2 - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2
                : xToPx(config.endDate.x) - ctx.measureText("Sale Ends " + signInfo.endDate).width / 2,
            xToPx(config.endDate.y) - offset,
        );
    }

    if (signInfo.extras !== "" && config.extras) {
        //extras
        ctx.font = xToPx(config.extras.fontSize) + "px " + font;
        ctx.fillText(
            signInfo.extras,
            config.extras.centered
                ? canvasWidth / 2 - ctx.measureText(signInfo.extras).width / 2
                : xToPx(config.extras.x) - ctx.measureText(signInfo.extras).width / 2,
            xToPx(config.extras.y) - offset,
        );
    }

    //reg
    if (signInfo.regPrice !== "") {
        let regBaseFontSize = config.regPrice.fontSize;
        if (signInfo.extras && config.regPrice.fontSizeWithExtras) {
            regBaseFontSize = config.regPrice.fontSizeWithExtras;
        }
        ctx.font = xToPx(regBaseFontSize) + "px " + font;
        ctx.fillText(
            "Reg. $" + signInfo.regPrice,
            config.regPrice.centered
                ? canvasWidth / 2 - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2
                : xToPx(config.regPrice.x) - ctx.measureText("Reg. $" + signInfo.regPrice).width / 2,
            xToPx(config.regPrice.y) - offset,
        );
    }

    c.className = "signCanvas";
    return c;
}
