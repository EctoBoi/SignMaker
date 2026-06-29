export type SignConfig = {
    width: string;
    height: string;
    previewScale?: number;
    borderLineLength?: string;
    printOrientation: "portrait" | "landscape";
    allowMirror?: boolean;
    mirrorDirection?: "horizontal" | "vertical";
    title1: { fontSize: string; x: string; y: string; centered: boolean };
    title2?: { fontSize: string; x: string; y: string; centered: boolean };
    extras?: { fontSize: string; x: string; y: string; centered: boolean };
    price: {
        fontSize: string;
        fontSizeWithExtras?: string;
        x: string;
        dollarsY: string;
        dollarsYWithExtras?: string;
        centsY: string;
        centered: boolean;
        margin: string;
    };
    regPrice: { fontSize: string; fontSizeWithExtras?: string; x: string; y: string; centered: boolean };
    barcode: {
        width: number;
        height: number;
        fontSize: number;
        x: string;
        y: string;
    };
    endDate: {
        fontSize: string;
        x: string;
        y: string;
        centered: boolean;
    };
};

export const signConfigs: { [key: string]: SignConfig } = {
    "2x4 Hang Tag": {
        width: "48mm",
        height: "52mm",
        borderLineLength: "3mm",
        printOrientation: "portrait",
        allowMirror: true,
        mirrorDirection: "vertical",
        title1: { fontSize: "5mm", x: "0", y: "7mm", centered: true },
        title2: { fontSize: "5mm", x: "0", y: "12mm", centered: true },
        price: {
            fontSize: "23mm",
            x: "0",
            dollarsY: "34mm",
            centsY: "27mm",
            centered: true,
            margin: "8mm",
        },
        regPrice: {
            fontSize: "5mm",
            x: "0",
            y: "39mm",
            centered: true,
        },
        barcode: {
            width: 0.8,
            height: 6,
            fontSize: 10,
            x: "36mm",
            y: "46mm",
        },
        endDate: {
            fontSize: "4mm",
            x: "0",
            y: "44mm",
            centered: true,
        },
    },
    "3.25x5.75 Hang Tag": {
        width: "2.875in",
        height: "3.1875in",
        borderLineLength: "10mm",
        printOrientation: "portrait",
        allowMirror: true,
        mirrorDirection: "vertical",
        title1: { fontSize: "7mm", x: "0", y: "12mm", centered: true },
        title2: { fontSize: "7mm", x: "0", y: "19mm", centered: true },
        extras: { fontSize: "6mm", x: "0", y: "53mm", centered: true },
        price: {
            fontSize: "31mm",
            fontSizeWithExtras: "29mm",
            x: "0",
            dollarsY: "49mm",
            dollarsYWithExtras: "47mm",
            centsY: "39mm",
            centered: true,
            margin: "10mm",
        },
        regPrice: {
            fontSize: "6mm",
            fontSizeWithExtras: "5mm",
            x: "0",
            y: "58mm",
            centered: true,
        },
        barcode: {
            width: 1,
            height: 6,
            fontSize: 12,
            x: "54mm",
            y: "72mm",
        },
        endDate: {
            fontSize: "4mm",
            x: "0",
            y: "64mm",
            centered: true,
        },
    },
    "3x5 Sign Insert": {
        width: "3.48in",
        height: "3in",
        borderLineLength: "10mm",
        printOrientation: "landscape",
        allowMirror: true,
        mirrorDirection: "vertical",
        title1: { fontSize: "8mm", x: "0", y: "10mm", centered: true },
        title2: { fontSize: "8mm", x: "0", y: "18mm", centered: true },
        extras: { fontSize: "5mm", x: "0", y: "47mm", centered: true },
        price: {
            fontSize: "30mm",
            fontSizeWithExtras: "26.5mm",
            x: "0",
            dollarsY: "45mm",
            dollarsYWithExtras: "42mm",
            centsY: "34mm",
            centered: true,
            margin: "10mm",
        },
        regPrice: {
            fontSize: "6mm",
            fontSizeWithExtras: "4mm",
            x: "0",
            y: "51.5mm",
            centered: true,
        },
        barcode: {
            width: 1,
            height: 6,
            fontSize: 10,
            x: "70mm",
            y: "68mm",
        },
        endDate: {
            fontSize: "3mm",
            x: "0",
            y: "56mm",
            centered: true,
        },
    },
    "4x4 Fact Tag": {
        width: "4in",
        height: "4in",
        borderLineLength: "10mm",
        printOrientation: "portrait",
        allowMirror: true,
        mirrorDirection: "vertical",
        title1: { fontSize: "9mm", x: "0", y: "12mm", centered: true },
        title2: { fontSize: "9mm", x: "0", y: "21mm", centered: true },
        extras: { fontSize: "5mm", x: "0", y: "68mm", centered: true },
        price: {
            fontSize: "30mm",
            x: "0",
            dollarsY: "55mm",
            centsY: "45mm",
            centered: true,
            margin: "1.25in",
        },
        regPrice: {
            fontSize: "4mm",
            x: "25mm",
            y: "87.5mm",
            centered: false,
        },
        barcode: {
            width: 1.4,
            height: 8,
            fontSize: 13,
            x: "74mm",
            y: "76mm",
        },
        endDate: {
            fontSize: "4mm",
            x: "74mm",
            y: "87mm",
            centered: false,
        },
    },
    "4.5x2.75 Binocular": {
        width: "4.5in",
        height: "2.70in",
        borderLineLength: "10mm",
        printOrientation: "portrait",
        allowMirror: true,
        mirrorDirection: "vertical",
        title1: { fontSize: "8mm", x: "0", y: "36mm", centered: true },
        extras: { fontSize: "5mm", x: "30mm", y: "49mm", centered: false },
        price: {
            fontSize: "24mm",
            x: "80mm",
            dollarsY: "57mm",
            centsY: "49mm",
            centered: false,
            margin: "65mm",
        },
        regPrice: {
            fontSize: "4mm",
            x: "93mm",
            y: "62mm",
            centered: false,
        },
        barcode: {
            width: 1,
            height: 8,
            fontSize: 12,
            x: "20mm",
            y: "60mm",
        },
        endDate: {
            fontSize: "3.5mm",
            x: "0",
            y: "62mm",
            centered: true,
        },
    },
    "5x7 Sign Insert": {
        width: "5.25in",
        height: "6.75in",
        borderLineLength: "10mm",
        printOrientation: "landscape",
        allowMirror: true,
        mirrorDirection: "horizontal",
        title1: { fontSize: "5.5mm", x: "0", y: "84.5mm", centered: true },
        title2: { fontSize: "5.5mm", x: "0", y: "90mm", centered: true },
        extras: { fontSize: "5mm", x: "0", y: "127.5mm", centered: true },
        price: {
            fontSize: "38mm",
            fontSizeWithExtras: "33mm",
            x: "0",
            dollarsY: "126mm",
            dollarsYWithExtras: "122mm",
            centsY: "113mm",
            centered: true,
            margin: "40mm",
        },
        regPrice: {
            fontSize: "6mm",
            fontSizeWithExtras: "4mm",
            x: "0",
            y: "132mm",
            centered: true,
        },
        barcode: {
            width: 1,
            height: 6,
            fontSize: 10,
            x: "100mm",
            y: "133mm",
        },
        endDate: {
            fontSize: "2.5mm",
            x: "0",
            y: "135mm",
            centered: true,
        },
    },
    "11x11 Sign Insert": {
        width: "11in",
        height: "8.5in",
        previewScale: 0.8,
        printOrientation: "landscape",
        allowMirror: false,
        title1: { fontSize: "13mm", x: "0", y: "76mm", centered: true },
        title2: { fontSize: "13mm", x: "0", y: "89mm", centered: true },
        extras: { fontSize: "8mm", x: "0", y: "166mm", centered: true },
        price: {
            fontSize: "80mm",
            fontSizeWithExtras: "75mm",
            x: "0",
            dollarsY: "161mm",
            dollarsYWithExtras: "157mm",
            centsY: "135mm",
            centered: true,
            margin: "4in",
        },
        regPrice: {
            fontSize: "15mm",
            fontSizeWithExtras: "10mm",
            x: "0",
            y: "176mm",
            centered: true,
        },
        barcode: {
            width: 1.4,
            height: 8,
            fontSize: 13,
            x: "215mm",
            y: "180mm",
        },
        endDate: {
            fontSize: "6mm",
            x: "0",
            y: "183mm",
            centered: true,
        },
    },
    "17x17 Sign Insert": {
        width: "17in",
        height: "11in",
        previewScale: 0.6,
        printOrientation: "landscape",
        allowMirror: false,
        title1: { fontSize: "22mm", x: "0", y: "65mm", centered: true },
        title2: { fontSize: "22mm", x: "0", y: "87mm", centered: true },
        extras: { fontSize: "14mm", x: "0", y: "206mm", centered: true },
        price: {
            fontSize: "126mm",
            fontSizeWithExtras: "117mm",
            x: "0",
            dollarsY: "199mm",
            dollarsYWithExtras: "191mm",
            centsY: "155mm",
            centered: true,
            margin: "6in",
        },
        regPrice: {
            fontSize: "24mm",
            fontSizeWithExtras: "16mm",
            x: "0",
            y: "222mm",
            centered: true,
        },
        barcode: {
            width: 2,
            height: 14,
            fontSize: 20,
            x: "325mm",
            y: "225mm",
        },
        endDate: {
            fontSize: "8mm",
            x: "0",
            y: "233mm",
            centered: true,
        },
    },
};
