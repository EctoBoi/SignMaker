import { create2x4HangTag, create3x5HangTag, create4x4FactTag, create4x2Binocular, create11x11SignInsert, create17x17SignInsert } from "./CreateSign.js";

document.getElementById("createButton").addEventListener("click", createSign);
document.getElementById("printButton").addEventListener("click", print);
document.getElementById("fillInfoButton").addEventListener("click", fillFromInfo);

document.getElementById("saveToBatch").addEventListener("click", saveToBatch);
document.getElementById("clearBatch").addEventListener("click", clearBatch);
document.getElementById("printBatch").addEventListener("click", printBatch);
document.getElementById("selectBatch").addEventListener("change", loadBatchPreview);

document.getElementById("sizes").addEventListener("change", () => {
    const signtype = document.getElementById("sizes").value;
    if (signtype === "11x11 Sign Insert" || signtype === "17x17 Sign Insert" || signtype === "4x4 Fact Tag") {
        document.getElementById("formExtras").style.display = "flex";
    } else {
        document.getElementById("formExtras").style.display = "none";
    }
});

let batches = [];
let lastCreatedBatchName = null;

async function fillFromInfo() {
    const clipboardContents = await navigator.clipboard.readText();
    if (clipboardContents.split("^").length > 2) {
        document.getElementById("title1").value = clipboardContents.split("^")[0];
        document.getElementById("sku").value = clipboardContents.split("^")[1];
        document.getElementById("price").value = clipboardContents.split("^")[2];

        if (clipboardContents.split("^").length > 3) {
            document.getElementById("regPrice").value = clipboardContents.split("^")[3];
        } else {
            document.getElementById("regPrice").value = "";
        }

        document.getElementById("title2").value = "";
        //document.getElementById("endDate").value = ""
    } else {
        alert("Info Error");
    }
}

function createSign() {
    const size = document.getElementById("sizes").value;
    lastCreatedBatchName = size;

    if (size === "2x4 Hang Tag") {
        create2x4HangTag();
    }
    if (size === "3.25x5.75 Hang Tag") {
        create3x5HangTag();
    }
    if (size === "4x4 Fact Tag") {
        create4x4FactTag();
    }
    if (size === "4.5x2.75 Binocular") {
        create4x2Binocular();
    }
    if (size === "11x11 Sign Insert") {
        create11x11SignInsert();
    }
    if (size === "17x17 Sign Insert") {
        create17x17SignInsert();
    }
}

function print() {
    let img = new Image();
    img.id = "tempPrintImage";
    img.src = document.getElementById("signCanvas").toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    if (img.complete) {
        const copies = document.getElementById("copies").value;
        let imgs = [];
        for (let i = 0; i < copies; i++) {
            imgs.push(img);
        }
        openPrintWindow(imgs, getSignFormat(lastCreatedBatchName));
    } else {
        setTimeout(print, 300);
    }
}

function updateBatchSelect(batchName) {
    if (batches.length === 0) {
        document.getElementById("selectBatch").innerHTML = `<option value="" disabled selected>No Batches</option>`;
        return;
    } else {
        document.getElementById("selectBatch").innerHTML = `<option value="" disabled selected>Select Batch</option>`;
    }
    for (let i = 0; i < batches.length; i++) {
        document.getElementById("selectBatch").innerHTML += `<option value="${batches[i].name}">${batches[i].name}</option>`;
    }
    if (batchName) document.getElementById("selectBatch").value = batchName;
}

function saveToBatch() {
    let img = new Image();
    img.src = document.getElementById("signCanvas").toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    let batchName = lastCreatedBatchName;

    if (batches.find((b) => b.name === batchName) == null) {
        batches.push({ name: batchName, signs: [] });
    }
    let currentBatch = batches.find((b) => b.name === batchName);

    if (img.complete) {
        const copies = document.getElementById("copies").value;
        for (let i = 0; i < copies; i++) {
            let imgClone = img.cloneNode(true);
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
    let currentBatch = batches.find((b) => b.name === document.getElementById("selectBatch").value);
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
    let currentBatch = batches.find((b) => b.name === document.getElementById("selectBatch").value);
    if (currentBatch && currentBatch.signs.length > 0) {
        let format = getSignFormat(currentBatch.name);
        openPrintWindow(currentBatch.signs, format);
    } else {
        alert("Batch Empty");
    }
}

function loadBatchPreview() {
    let batchPreviewDiv = document.getElementById("batchPreview");
    batchPreviewDiv.innerHTML = "";

    let currentBatch = batches.find((b) => b.name === document.getElementById("selectBatch").value);

    if (currentBatch && currentBatch.signs.length > 0) {
        let signHeight = getSignFormat(currentBatch.name).height;

        batchPreviewDiv.style.minWidth = signHeight;
        batchPreviewDiv.style.width = signHeight;

        for (let i = 0; i < currentBatch.signs.length; i++) {
            currentBatch.signs[i].onclick = removeFromBatch;

            batchPreviewDiv.append(currentBatch.signs[i]);
        }
    }
}

function removeFromBatch() {
    let currentBatch = batches.find((b) => b.name === document.getElementById("selectBatch").value);
    if (confirm("Remove from Batch?")) {
        for (let i = 0; i < currentBatch.signs.length; i++) {
            if (currentBatch.signs[i].id === this.id) {
                currentBatch.signs.splice(i, 1);
            }
        }

        loadBatchPreview();
    }
}

function getSignFormat(signName) {
    let orientation = "portrait";
    let height = 0;

    if (signName === "2x4 Hang Tag" || signName === "3.25x5.75 Hang Tag" || signName === "4x4 Fact Tag") {
        height = xToPx("8.5in") + "px";
    } else if (signName === "4.5x2.75 Binocular" || signName === "11x11 Sign Insert") {
        height = xToPx("11in") + "px";
        orientation = "landscape";
    } else if (signName === "17x17 Sign Insert") {
        height = xToPx("17in") + "px";
        orientation = "landscape";
    }

    return { orientation: orientation, height: height };
}

function openPrintWindow(imgs, format) {
    let WinPrint = window.open("", "", "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0");

    if (imgs != null) {
        //null for batch
        for (let i = 0; i < imgs.length; i++) {
            WinPrint.document.write(imgs[i].outerHTML);
        }
    }

    let printStyle = `<style type="text/css" media="print">
            body { margin: 0; }
            @page { 
                size: ${format.orientation}; 
                ${format.orientation === "portrait" ? "display: flex;" : ""}
            }
        </style>`;

    WinPrint.document.write(printStyle);

    WinPrint.document.close();

    setTimeout(() => {
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }, 300);
}

function xToPx(x) {
    var div = document.createElement("div");
    div.style.display = "block";
    div.style.height = x;
    document.body.appendChild(div);
    var px = parseFloat(window.getComputedStyle(div, null).height);
    div.parentNode.removeChild(div);
    return px;
}
