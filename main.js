import { create2x4HangTag, create3x5HangTag, create4x4FactTag, create11x11SignInsert, create17x17SignInsert} from './CreateSign.js';

document.getElementById("createButton").addEventListener("click", createSign)
document.getElementById("printButton").addEventListener("click", print)
document.getElementById("fillInfoButton").addEventListener("click", fillFromInfo)

let pageOrientation = "portrait"

async function fillFromInfo() {
    const clipboardContents = await navigator.clipboard.readText();
    if (clipboardContents.split("^").length > 2) {
        document.getElementById("title1").value = clipboardContents.split("^")[0]
        document.getElementById("sku").value = clipboardContents.split("^")[1]
        document.getElementById("price").value = clipboardContents.split("^")[2]

        if (clipboardContents.split("^").length > 3) {
            document.getElementById("regPrice").value = clipboardContents.split("^")[3]
        } else {
            document.getElementById("regPrice").value = ""
        }

        document.getElementById("title2").value = ""
        document.getElementById("endDate").value = ""
    } else {
        alert("Info Error")
    }
}

function createSign() {
    const size = document.getElementById("sizes").value

    if (size === "2x4 Hang Tag") {
        pageOrientation = "portrait"
            create2x4HangTag()
    }
    
    if (size === "3x5 Hang Tag") {
        pageOrientation = "portrait"
        create3x5HangTag()
    }

    if (size === "4x4 Fact Tag") {
        pageOrientation = "portrait"
        create4x4FactTag()
    }

    if (size === "11x11 Sign Insert") {
        pageOrientation = "landscape"
        create11x11SignInsert()
    }

    if (size === "17x17 Sign Insert") {
        pageOrientation = "landscape"
        create17x17SignInsert()
    }
}

function print() {
    let img = new Image();
    img.id = 'tempPrintImage'
    img.src = document.getElementById("signCanvas").toDataURL("image/png");
    img.width = img.width * 0.25;
    img.height = img.height * 0.25;

    if (img.complete)
        openPrintWindow(img)
    else
        setTimeout(print, 300)
}

function openPrintWindow(img) {
    let WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

    const copies = document.getElementById("copies").value

    for (let i = 0; i < copies; i++) {
        WinPrint.document.write(img.outerHTML);
    }

    let stylePortrait = `<style type="text/css" media="print">
        @page { size: portrait; display: flex;}
        </style>`
    let styleLandscape = `<style type="text/css" media="print">
          @page { size: landscape; }
        </style>`

    if (pageOrientation === "portrait")
        WinPrint.document.write(stylePortrait);
    if (pageOrientation === "landscape")
        WinPrint.document.write(styleLandscape);

    WinPrint.document.close();

    setTimeout(() => {
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }, 300)
}