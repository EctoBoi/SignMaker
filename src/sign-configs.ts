export type SignConfig = {
    width: string;
    height: string;
    borderLineLength?: string;
    title1: { fontSize: string; x: string; y: string; centered: boolean };
    title2: { fontSize: string; x: string; y: string; centered: boolean };
    extras?: { fontSize: string; x: string; y: string; centered: boolean };
    price: {
        dollarsFontSize: string;
        centsFontSize: string;
        x: string;
        dollarsY: string;
        centsY: string;
        centered: boolean;
        margin: string;
    };
    regPrice: { fontSize: string; x: string; y: string; centered: boolean };
    barcode: {
        x: string;
        y: string;
        width: number;
        height: number;
        fontSize: number;
    };
    endDate: {
        x: string;
        y: string;
        fontSize: string;
        centered: boolean;
    };
};

export const signConfigs: { [key: string]: SignConfig } = {
    "4x4 Fact Tag": {
        width: "4in",
        height: "4in",
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
            x: "74mm",
            y: "76mm",
            width: 1.4,
            height: 8,
            fontSize: 13,
        },
        endDate: {
            x: "74mm",
            y: "87mm",
            fontSize: "4mm",
            centered: false,
        },
    },
};
