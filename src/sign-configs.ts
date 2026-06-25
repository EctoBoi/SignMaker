export type SignConfig = {
    width: string;
    height: string;
    marginOffset: string;
    borderLineLength?: string;
    title1: { fontSize: string; x: string; y: string; centered: boolean };
    title2?: { fontSize: string; x: string; y: string; centered: boolean };
    extras?: { fontSize: string; x: string; y: string; centered: boolean };
    price: {
        dollarsFontSize: string;
        dollarsFontSizeWithExtras?: string;
        centsFontSize: string;
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
        marginOffset: "0",
        title1: { fontSize: "5mm", x: "0", y: "7mm", centered: true },
        title2: { fontSize: "5mm", x: "0", y: "12mm", centered: true },
        price: {
            dollarsFontSize: "23mm",
            centsFontSize: "11.5mm",
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
        marginOffset: "0",
        title1: { fontSize: "7mm", x: "0", y: "12mm", centered: true },
        title2: { fontSize: "7mm", x: "0", y: "19mm", centered: true },
        price: {
            dollarsFontSize: "31mm",
            centsFontSize: "15.5mm",
            x: "0",
            dollarsY: "49mm",
            centsY: "39mm",
            centered: true,
            margin: "2mm",
        },
        regPrice: {
            fontSize: "6mm",
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
    "4x4 Fact Tag": {
        width: "4in",
        height: "4in",
        marginOffset: "0",
        borderLineLength: "10mm",
        title1: { fontSize: "9mm", x: "0", y: "12mm", centered: true },
        title2: { fontSize: "9mm", x: "0", y: "21mm", centered: true },
        extras: { fontSize: "5mm", x: "0", y: "68mm", centered: true },
        price: {
            dollarsFontSize: "30mm",
            centsFontSize: "15mm",
            x: "0",
            dollarsY: "55mm",
            centsY: "45mm",
            centered: true,
            margin: "1.25in",
        },
        regPrice: {
            fontSize: "4mm",
            x: "18mm",
            y: "87mm",
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
            x: "74mm",
            y: "87mm",
            fontSize: "4mm",
            centered: false,
        },
    },
    "4.5x2.75 Binocular": {
        width: "4.5in",
        height: "2.70in",
        marginOffset: "0",
        borderLineLength: "10mm",
        title1: { fontSize: "8mm", x: "0", y: "36mm", centered: true },
        price: {
            dollarsFontSize: "24mm",
            centsFontSize: "12mm",
            x: "80mm",
            dollarsY: "57mm",
            centsY: "49mm",
            centered: false,
            margin: "65mm",
        },
        regPrice: {
            fontSize: "4mm",
            x: "92mm",
            y: "62mm",
            centered: false,
        },
        barcode: {
            width: 1,
            height: 8,
            fontSize: 13,
            x: "20mm",
            y: "60mm",
        },
        endDate: {
            x: "0",
            y: "62mm",
            fontSize: "3.5mm",
            centered: true,
        },
    },
    "11x11 Sign Insert": {
        width: "10.2in",
        height: "7.6in",
        marginOffset: "0.45in",
        title1: { fontSize: "13mm", x: "0", y: "77mm", centered: true },
        title2: { fontSize: "13mm", x: "0", y: "90mm", centered: true },
        extras: { fontSize: "8mm", x: "0", y: "167mm", centered: true },
        price: {
            dollarsFontSize: "80mm",
            dollarsFontSizeWithExtras: "75mm",
            centsFontSize: "40mm",
            x: "0",
            dollarsY: "162mm",
            dollarsYWithExtras: "158mm",
            centsY: "136mm",
            centered: true,
            margin: "4in",
        },
        regPrice: {
            fontSize: "15mm",
            fontSizeWithExtras: "10mm",
            x: "0",
            y: "177mm",
            centered: true,
        },
        barcode: {
            width: 1.4,
            height: 8,
            fontSize: 13,
            x: "205mm",
            y: "181mm",
        },
        endDate: {
            fontSize: "6mm",
            x: "0",
            y: "184mm",
            centered: true,
        },
    },
    "17x17 Sign Insert": {
        width: "16.2in",
        height: "10.2in",
        marginOffset: "0.35in",
        title1: { fontSize: "22mm", x: "0", y: "64mm", centered: true },
        title2: { fontSize: "22mm", x: "0", y: "86mm", centered: true },
        extras: { fontSize: "14mm", x: "0", y: "205mm", centered: true },
        price: {
            dollarsFontSize: "126mm",
            dollarsFontSizeWithExtras: "117mm",
            centsFontSize: "63mm",
            x: "0",
            dollarsY: "198mm",
            dollarsYWithExtras: "190mm",
            centsY: "154mm",
            centered: true,
            margin: "6in",
        },
        regPrice: {
            fontSize: "24mm",
            fontSizeWithExtras: "16mm",
            x: "0",
            y: "221mm",
            centered: true,
        },
        barcode: {
            width: 2,
            height: 14,
            fontSize: 20,
            x: "315mm",
            y: "224mm",
        },
        endDate: {
            fontSize: "8mm",
            x: "0",
            y: "232mm",
            centered: true,
        },
    },
};
