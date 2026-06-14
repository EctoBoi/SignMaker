import * as signMaker from "./sign-maker.ts";
import { xToPx } from "./canvas-utils.ts";

// DOM References and Event Listeners
const fillInfoButton = document.getElementById("fillInfoButton") as HTMLButtonElement;

const sizesSelect = document.getElementById("sizes") as HTMLSelectElement;
const title1Input = document.getElementById("title1") as HTMLInputElement;
const title2Input = document.getElementById("title2") as HTMLInputElement;
const extrasInput = document.getElementById("extras") as HTMLInputElement;
const skuInput = document.getElementById("sku") as HTMLInputElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const regPriceInput = document.getElementById("regPrice") as HTMLInputElement;
const endDateInput = document.getElementById("endDate") as HTMLInputElement;
const copiesInput = document.getElementById("copies") as HTMLInputElement;
const createButton = document.getElementById("createButton") as HTMLButtonElement;
const printButton = document.getElementById("printButton") as HTMLButtonElement;

const formExtras = document.getElementById("formExtras") as HTMLDivElement;
const formBatchSelect = document.getElementById("formBatchSelect") as HTMLDivElement;

const saveToBatchButton = document.getElementById("saveToBatch") as HTMLButtonElement;
const batchSelect = document.getElementById("selectBatch") as HTMLSelectElement;
const printBatchButton = document.getElementById("printBatch") as HTMLButtonElement;
const batchPreviewDiv = document.getElementById("batchPreview") as HTMLDivElement;
const clearBatchButton = document.getElementById("clearBatch") as HTMLButtonElement;

createButton.addEventListener("click", createSign);
printButton.addEventListener("click", print);
fillInfoButton.addEventListener("click", fillFromInfo);
saveToBatchButton.addEventListener("click", saveToBatch);
clearBatchButton.addEventListener("click", clearBatch);
printBatchButton.addEventListener("click", printBatch);
batchSelect.addEventListener("change", loadBatchPreview);

sizesSelect.addEventListener("change", () => {
    const signtype = sizesSelect.value;
    if (signtype === "11x11 Sign Insert" || signtype === "17x17 Sign Insert" || signtype === "4x4 Fact Tag") {
        formExtras.style.display = "flex";
    } else {
        formExtras.style.display = "none";
    }
});

export interface SignInfo {
    size: string;
    title1: string;
    title2: string;
    extras: string;
    sku: string;
    price: string;
    dollars: string;
    cents: string;
    regPrice: string;
    endDate: string;
}

interface Batch {
    name: string;
    signs: HTMLImageElement[];
}

// State
let batches: Batch[] = [];
let lastCreatedBatchName: string | null = null;

async function fillFromInfo() {
    const clipboardContents = await navigator.clipboard.readText();
    if (clipboardContents.split("^").length > 2) {
        title1Input.value = clipboardContents.split("^")[0];
        skuInput.value = clipboardContents.split("^")[1];
        priceInput.value = clipboardContents.split("^")[2];

        if (clipboardContents.split("^").length > 3) {
            regPriceInput.value = clipboardContents.split("^")[3];
        } else {
            regPriceInput.value = "";
        }

        title2Input.value = "";
    } else {
        alert("Info Error");
    }
}

function showPrintControls() {
    printButton.style.visibility = "visible";
    saveToBatchButton.style.visibility = "visible";
    formBatchSelect.style.visibility = "visible";
    clearBatchButton.style.visibility = "visible";
    printBatchButton.style.visibility = "visible";
}

function getSignInfo(): SignInfo {
    let price = priceInput.value;
    let dollars = price ? price.split(".")[0].replace(/,/g, "") : "";
    let cents = price ? (price.split(".")[1] === undefined ? "" : price.split(".")[1]) : "";
    let endDate = "";
    if (endDateInput.value !== "") {
        const formDate = new Date(endDateInput.value.replace("-", "/"));
        const month = formDate.toLocaleString("default", { month: "short" });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear();
    }

    return {
        size: sizesSelect.value,
        title1: title1Input.value,
        title2: title2Input.value,
        extras: extrasInput.value,
        sku: skuInput.value,
        price: price,
        dollars: dollars,
        cents: cents,
        regPrice: regPriceInput.value,
        endDate: endDate,
    };
}

function createSign() {
    const signInfo = getSignInfo();
    lastCreatedBatchName = signInfo.size;

    if (signInfo.size === "2x4 Hang Tag") {
        signMaker.create2x4HangTag(signInfo);
    }
    if (signInfo.size === "3.25x5.75 Hang Tag") {
        signMaker.create3x5HangTag(signInfo);
    }
    if (signInfo.size === "4x4 Fact Tag") {
        signMaker.create4x4FactTag(signInfo);
    }
    if (signInfo.size === "4.5x2.75 Binocular") {
        signMaker.create4x2Binocular(signInfo);
    }
    if (signInfo.size === "11x11 Sign Insert") {
        signMaker.create11x11SignInsert(signInfo);
    }
    if (signInfo.size === "17x17 Sign Insert") {
        signMaker.create17x17SignInsert(signInfo);
    }

    showPrintControls();
}

function print() {
    const signCanvas = document.getElementById("signCanvas") as HTMLCanvasElement;
    if (!signCanvas) {
        alert("No Sign Created");
        return;
    }
    let img = new Image();
    img.id = "tempPrintImage";
    img.src = signCanvas.toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    if (img.complete) {
        const copies = parseInt(copiesInput.value);
        let imgs = [];
        for (let i = 0; i < copies; i++) {
            imgs.push(img);
        }
        if (lastCreatedBatchName) openPrintWindow(imgs, getSignFormat(lastCreatedBatchName));
        else alert("No Sign Created");
    } else {
        setTimeout(print, 300);
    }
}

function updateBatchSelect(batchName: string | null) {
    if (batches.length === 0) {
        batchSelect.innerHTML = `<option value="" disabled selected>No Batches</option>`;
        return;
    } else {
        batchSelect.innerHTML = `<option value="" disabled selected>Select Batch</option>`;
    }
    for (let i = 0; i < batches.length; i++) {
        batchSelect.innerHTML += `<option value="${batches[i].name}">${batches[i].name}</option>`;
    }
    if (batchName) batchSelect.value = batchName;
}

function saveToBatch() {
    const signCanvas = document.getElementById("signCanvas") as HTMLCanvasElement;
    if (!signCanvas) {
        alert("No Sign Created");
        return;
    }
    let img = new Image();
    img.src = signCanvas.toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    let batchName = lastCreatedBatchName;
    if (!batchName) {
        alert("No Sign Created");
        return;
    }

    if (batches.find((b) => b.name === batchName) == null) {
        batches.push({ name: batchName, signs: [] });
    }

    let currentBatch = batches.find((b) => b.name === batchName);
    if (!currentBatch) {
        alert("Batch Error");
        return;
    }

    if (img.complete) {
        const copies = parseInt(copiesInput.value);
        for (let i = 0; i < copies; i++) {
            let imgClone = img.cloneNode(true) as HTMLImageElement;
            imgClone.id = "tempPrintImage" + currentBatch.signs.length;
            currentBatch.signs.push(imgClone);
        }

        updateBatchSelect(batchName);
        loadBatchPreview();

        if (copies > 1) alert("Saved " + copies + " Signs to Batch " + batchName);
        else alert("Saved " + copies + " Sign to Batch " + batchName);
    } else {
        setTimeout(saveToBatch, 300);
    }
}

function clearBatch() {
    let currentBatch = batches.find((b) => b.name === batchSelect.value);
    if (currentBatch && currentBatch.signs.length > 0) {
        if (confirm("Clear Batch " + currentBatch.name + "?")) {
            batches.splice(batches.indexOf(currentBatch), 1);

            updateBatchSelect(null);
            loadBatchPreview();
        }
    } else {
        alert("Batch Empty");
    }
}

function printBatch() {
    let currentBatch = batches.find((b) => b.name === batchSelect.value);
    if (currentBatch && currentBatch.signs.length > 0) {
        let format = getSignFormat(currentBatch.name);
        openPrintWindow(currentBatch.signs, format);
    } else {
        alert("Batch Empty");
    }
}

function loadBatchPreview() {
    batchPreviewDiv.replaceChildren();

    let currentBatch = batches.find((b) => b.name === batchSelect.value);

    if (currentBatch && currentBatch.signs.length > 0) {
        let signFormat = getSignFormat(currentBatch.name);
        batchPreviewDiv.style.width = xToPx("11in") + "px";

        for (let i = 0; i < currentBatch.signs.length; i++) {
            let previewImg = currentBatch.signs[i].cloneNode(true) as HTMLImageElement;
            previewImg.onclick = removeFromBatch.bind(currentBatch.signs[i]);
            previewImg.style.cursor = "pointer";
            previewImg.title = "Click to Remove from Batch";
            previewImg.style.backgroundColor = "white";
            if (signFormat.width > xToPx("16in")) {
                previewImg.width = previewImg.width * 0.7;
                previewImg.height = previewImg.height * 0.7;
            } else if (signFormat.width > xToPx("10in")) {
                previewImg.width = previewImg.width * 0.8;
                previewImg.height = previewImg.height * 0.8;
            }

            batchPreviewDiv.append(previewImg);
        }
    }
}

function removeFromBatch(this: HTMLImageElement) {
    let currentBatch = batches.find((b) => b.name === batchSelect.value);
    if (currentBatch && confirm("Remove from Batch?")) {
        for (let i = 0; i < currentBatch.signs.length; i++) {
            if (currentBatch.signs[i].id === this.id) {
                currentBatch.signs.splice(i, 1);
            }
        }

        loadBatchPreview();
    }
}

function getSignFormat(signName: string): { orientation: string; width: number } {
    let orientation = "portrait";
    let width: number = 0;

    if (signName === "2x4 Hang Tag" || signName === "3.25x5.75 Hang Tag" || signName === "4x4 Fact Tag") {
        width = xToPx("8.5in");
    } else if (signName === "4.5x2.75 Binocular" || signName === "11x11 Sign Insert") {
        width = xToPx("11in");
        orientation = "landscape";
    } else if (signName === "17x17 Sign Insert") {
        width = xToPx("17in");
        orientation = "landscape";
    }

    return { orientation: orientation, width: width };
}

function openPrintWindow(imgs: HTMLImageElement[], format: { orientation: string; width: number }) {
    let WinPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");

    if (!WinPrint) {
        alert("Popup Blocker is enabled! Please allow popups for this website to print.");
        return;
    }
    if (imgs != null) {
        //null for batch
        for (let i = 0; i < imgs.length; i++) {
            WinPrint.document.body.appendChild(imgs[i].cloneNode(true));
        }
    }

    let printStyle = WinPrint.document.createElement("style");
    printStyle.media = "print";
    printStyle.innerHTML = `
            body { margin: 0; }
            @page { 
                size: ${format.orientation}; 
                ${format.orientation === "portrait" ? "display: flex;" : ""}
            }
        </style>`;

    WinPrint.document.head.appendChild(printStyle);

    WinPrint.document.close();

    setTimeout(() => {
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }, 300);
}
