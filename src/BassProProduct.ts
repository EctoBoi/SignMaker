export interface BassProProduct {
    brand: string;
    title: string;
    salePrice: number;
    regularPrice: number;
    onSale: boolean;
    percentSavings: number | null;
    amountSavings: number | null;
    departmentName: string | null;
    styleNumber: string | null;
    availableQuantityCanada: number | null;
    sku: string;
    upc: string | null;
}

function copyToClipboard(value: string, el: HTMLElement) {
    navigator.clipboard.writeText(value).catch((err) => {
        console.error("Copy failed:", err);
    });

    el.classList.add("copy-flash");
    setTimeout(() => el.classList.remove("copy-flash"), 400);
}

function makeCopyable(label: string, value: string, className: string): HTMLElement {
    const el = document.createElement("div");
    el.className = className;
    el.title = "Click to copy";

    const labelSpan = document.createElement("span");
    labelSpan.className = `${className}-label`;
    labelSpan.textContent = label;

    const valueSpan = document.createElement("span");
    valueSpan.className = `${className}-value`;
    valueSpan.textContent = value;

    el.append(labelSpan, valueSpan);
    el.addEventListener("click", () => copyToClipboard(value, el));

    return el;
}

export function renderProductCard(data: BassProProduct, bassProResults: HTMLElement) {
    bassProResults.innerHTML = "";
    bassProResults.classList.add("visible");

    // Top: brand/title + price
    const top = document.createElement("div");
    top.className = "product-card__top";

    const titleBlock = document.createElement("div");
    const brandEl = document.createElement("p");
    brandEl.className = "product-card__brand";
    brandEl.textContent = data.brand;

    const titleEl = document.createElement("h3");
    titleEl.className = "product-card__title";
    titleEl.textContent = data.title;

    titleBlock.append(brandEl, titleEl);

    const priceBlock = document.createElement("div");
    priceBlock.className = "product-card__price-block";

    const salePriceEl = document.createElement("span");
    salePriceEl.className = "product-card__sale-price";
    salePriceEl.textContent = `$${data.salePrice.toFixed(2)}`;

    priceBlock.appendChild(salePriceEl);

    if (data.onSale && data.regularPrice !== data.salePrice) {
        const regularPriceEl = document.createElement("span");
        regularPriceEl.className = "product-card__regular-price";
        regularPriceEl.textContent = `$${data.regularPrice.toFixed(2)}`;
        priceBlock.appendChild(regularPriceEl);
    }

    if (data.onSale && data.percentSavings) {
        const badge = document.createElement("div");
        badge.className = "product-card__savings-badge";
        badge.textContent = `Save ${data.percentSavings}%${data.amountSavings ? ` ($${Number(data.amountSavings).toFixed(2)})` : ""}`;
        priceBlock.appendChild(document.createElement("br"));
        priceBlock.appendChild(badge);
    }

    top.append(titleBlock, priceBlock);

    // Meta row: sku, upc, category, subcategory, stock
    const metaRow = document.createElement("div");
    metaRow.className = "product-card__meta";

    const metaFields: [string, string | number | null][] = [
        ["SKU:", data.sku],
        ["UPC:", data.upc],
        ["Department:", data.departmentName],
        ["Style Number:", data.styleNumber],
        ["In Stock Online (CA):", data.availableQuantityCanada],
    ];

    for (const [label, value] of metaFields) {
        if (value === null || value === undefined) continue;
        metaRow.appendChild(makeCopyable(label, String(value), "product-card__meta-item"));
    }

    bassProResults.append(top, metaRow);
}
