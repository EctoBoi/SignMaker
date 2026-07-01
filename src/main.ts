import { createSignCanvas } from "./sign-maker.ts";
import { resolution, mirrorCanvas } from "./canvas-utils.ts";
import { signConfigs } from "./sign-configs.ts";

// DOM References and Event Listeners
const fillInfoButton = document.getElementById("fillInfoButton") as HTMLButtonElement;

const typesSelect = document.getElementById("types") as HTMLSelectElement;
const title1Input = document.getElementById("title1") as HTMLInputElement;
const title2Input = document.getElementById("title2") as HTMLInputElement;
const extrasInput = document.getElementById("extras") as HTMLInputElement;
const skuInput = document.getElementById("sku") as HTMLInputElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const regPriceInput = document.getElementById("regPrice") as HTMLInputElement;
const endDateInput = document.getElementById("endDate") as HTMLInputElement;
const copiesInput = document.getElementById("copies") as HTMLInputElement;
const createButton = document.getElementById("createButton") as HTMLButtonElement;
const mirrorCheckbox = document.getElementById("mirror") as HTMLInputElement;
const printButton = document.getElementById("printButton") as HTMLButtonElement;

const canvasDiv = document.getElementById("canvasDiv") as HTMLDivElement;
const formTitle2 = document.getElementById("formTitle2") as HTMLDivElement;
const formExtras = document.getElementById("formExtras") as HTMLDivElement;
const formBatchSelect = document.getElementById("formBatchSelect") as HTMLDivElement;
const formMirror = document.getElementById("formMirror") as HTMLDivElement;

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

typesSelect.addEventListener("change", () => {
    const currentSignConfig = signConfigs[typesSelect.value];
    if (currentSignConfig.extras) {
        formExtras.style.display = "flex";
    } else {
        formExtras.style.display = "none";
    }
    if (currentSignConfig.title2) {
        formTitle2.style.display = "flex";
    } else {
        formTitle2.style.display = "none";
    }
    if (currentSignConfig.allowMirror === false) {
        formMirror.style.visibility = "hidden";
    } else {
        formMirror.style.visibility = "visible";
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        createSign();
    }
});

export type SignInfo = {
    type: string;
    title1: string;
    title2: string;
    extras: string;
    sku: string;
    price: string;
    dollars: string;
    cents: string;
    regPrice: string;
    endDate: string;
};

type Batch = {
    type: string;
    signs: HTMLImageElement[];
};

// State
const batches: Batch[] = [];
let lastCreatedSign: {
    type: string | null;
    canvas: HTMLCanvasElement | null;
} = { type: null, canvas: null };

async function fillFromInfo() {
    const clipboardContents = await navigator.clipboard.readText();
    // Expecting clipboard contents in the format: Title1^SKU^Price^RegPrice (RegPrice is optional)
    const splitContents = clipboardContents.split("^");
    if (splitContents.length > 2) {
        title1Input.value = splitContents[0];
        skuInput.value = splitContents[1];
        priceInput.value = splitContents[2];

        if (splitContents.length > 3) {
            regPriceInput.value = splitContents[3];
        } else {
            regPriceInput.value = "";
        }

        title2Input.value = "";
    } else {
        alert("Info Error");
    }
}

function fillTypesSelect() {
    const signTypes = Object.keys(signConfigs);

    signTypes.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        if (type === "11x11 Sign Insert") {
            option.selected = true;
        }
        typesSelect.appendChild(option);
    });
    typesSelect.dispatchEvent(new Event("change"));
}

function showPrintControls() {
    printButton.style.visibility = "visible";
    saveToBatchButton.style.visibility = "visible";
    formBatchSelect.style.visibility = "visible";
    clearBatchButton.style.visibility = "visible";
    printBatchButton.style.visibility = "visible";
}

function getSignInfo(): SignInfo {
    const price = priceInput.value;
    const dollars = price ? price.split(".")[0].replace(/,/g, "") : "";
    const cents = price ? (price.split(".")[1] === undefined ? "" : price.split(".")[1]) : "";
    let endDate = "";
    if (endDateInput.value !== "") {
        const formDate = new Date(endDateInput.value.replace("-", "/"));
        const month = formDate.toLocaleString("default", { month: "short" });
        endDate = month + " " + formDate.getDate() + ", " + formDate.getFullYear();
    }

    return {
        type: typesSelect.value,
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

async function createSign() {
    lastCreatedSign = { type: null, canvas: null };
    const signInfo = getSignInfo();

    let signCanvas: HTMLCanvasElement = await createSignCanvas(signInfo);

    if (signCanvas) {
        if (mirrorCheckbox.checked && signConfigs[signInfo.type].allowMirror !== false) {
            signCanvas = mirrorCanvas(signCanvas, signConfigs[signInfo.type].mirrorDirection || "vertical");
            signCanvas.className = "signCanvas";
        }
        lastCreatedSign = { type: signInfo.type, canvas: signCanvas };

        const scaleFactor = signConfigs[signInfo.type].previewScale || 1;
        signCanvas.style.width = (signCanvas.width / resolution) * scaleFactor + "px";
        signCanvas.style.height = (signCanvas.height / resolution) * scaleFactor + "px";
        canvasDiv.replaceChildren(signCanvas);

        showPrintControls();
    }
}

function print() {
    if (lastCreatedSign.canvas == null) {
        alert("No Sign Created");
        return;
    }

    const img = new Image();
    img.id = "tempPrintImage";
    img.src = lastCreatedSign.canvas.toDataURL("image/png");
    img.width = img.width / resolution;
    img.height = img.height / resolution;

    if (img.complete) {
        const copies = parseInt(copiesInput.value);
        const imgs: HTMLImageElement[] = [];
        for (let i = 0; i < copies; i++) {
            imgs.push(img);
        }
        if (lastCreatedSign.type) openPrintWindow(imgs, signConfigs[lastCreatedSign.type].printOrientation || "portrait");
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
        batchSelect.innerHTML += `<option value="${batches[i].type}">${batches[i].type}</option>`;
    }
    if (batchName) batchSelect.value = batchName;
}

function saveToBatch() {
    if (lastCreatedSign.canvas == null) {
        alert("No Sign Created");
        return;
    }
    const img = new Image();
    img.src = lastCreatedSign.canvas.toDataURL("image/png");
    img.width = img.width / resolution;
    img.height = img.height / resolution;

    const batchName = lastCreatedSign.type;
    if (!batchName) {
        alert("No Sign Created");
        return;
    }

    if (batches.find((b) => b.type === batchName) == null) {
        batches.push({ type: batchName, signs: [] });
    }

    const currentBatch = batches.find((b) => b.type === batchName);
    if (!currentBatch) {
        alert("Batch Error");
        return;
    }

    if (img.complete) {
        const copies = parseInt(copiesInput.value);
        for (let i = 0; i < copies; i++) {
            const imgClone = img.cloneNode(true) as HTMLImageElement;
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
    const currentBatch = batches.find((b) => b.type === batchSelect.value);
    if (currentBatch && currentBatch.signs.length > 0) {
        if (confirm("Clear Batch " + currentBatch.type + "?")) {
            batches.splice(batches.indexOf(currentBatch), 1);

            updateBatchSelect(null);
            loadBatchPreview();
        }
    } else {
        alert("Batch Empty");
    }
}

function printBatch() {
    const currentBatch = batches.find((b) => b.type === batchSelect.value);
    if (currentBatch && currentBatch.signs.length > 0) {
        openPrintWindow(currentBatch.signs, signConfigs[currentBatch.type].printOrientation || "portrait");
    } else {
        alert("Batch Empty");
    }
}

function loadBatchPreview() {
    batchPreviewDiv.replaceChildren();

    const currentBatch = batches.find((b) => b.type === batchSelect.value);

    if (currentBatch && currentBatch.signs.length > 0) {
        for (let i = currentBatch.signs.length - 1; i >= 0; i--) {
            const previewImg = currentBatch.signs[i].cloneNode(true) as HTMLImageElement;
            previewImg.onclick = removeFromBatch.bind(currentBatch.signs[i]);
            previewImg.style.cursor = "pointer";
            previewImg.title = "Click to Remove from Batch";
            previewImg.style.backgroundColor = "white";
            previewImg.style.border = "1px solid black";
            const scaleFactor = signConfigs[currentBatch.type].previewScale || 1;
            previewImg.width = previewImg.width * scaleFactor;
            previewImg.height = previewImg.height * scaleFactor;

            batchPreviewDiv.append(previewImg);
        }
    }
}

function removeFromBatch(this: HTMLImageElement) {
    const currentBatch = batches.find((b) => b.type === batchSelect.value);
    if (currentBatch && confirm("Remove from Batch?")) {
        for (let i = 0; i < currentBatch.signs.length; i++) {
            if (currentBatch.signs[i].id === this.id) {
                currentBatch.signs.splice(i, 1);
            }
        }

        loadBatchPreview();
    }
}

function openPrintWindow(imgs: HTMLImageElement[], orientation: "portrait" | "landscape") {
    const WinPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");

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

    const printStyle = WinPrint.document.createElement("style");
    printStyle.media = "print";
    printStyle.innerHTML = `
            body { margin: 0; }
            @page { 
                size: ${orientation}; 
                ${orientation === "portrait" ? "display: flex;" : ""};
                margin: 0;
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

fillTypesSelect();

/*
function addTestData() {
    title1Input.value = "Test Title";
    title2Input.value = "Test Subtitle";
    extrasInput.value = "Test Extras";
    skuInput.value = "1234567";
    priceInput.value = "19.98";
    regPriceInput.value = "29.99";
    endDateInput.value = "2026-12-31";
}

addTestData();
*/
