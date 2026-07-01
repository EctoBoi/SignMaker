import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// ---------- Types ----------

type MediaMetadataItem = {
    external_id: string;
    value: string | { external_id: string; value: string };
};

type MediaAsset = {
    metadata: MediaMetadataItem[];
};

type MediaAssetsResponse = {
    resources: MediaAsset[];
};

type CoveoTokenResponse = {
    token: string;
};

// Raw fields use the _ca suffix pattern (e.g. offerprice_ca confirmed in API response).
// If any field comes back undefined, check console output for available keys.
type CoveoRaw = {
    brand_ca?: string;
    offerprice_ca?: number;
    listprice_ca?: number;
    issale_ca?: number | string;
    percentsavings_ca?: number;
    savings_ca?: number;
    department_name_ca?: string;
    style_number_ca?: string;
    availquantity_ca?: number;
    sku?: string;
    [key: string]: unknown;
};

type CoveoResult = {
    title: string;
    raw: CoveoRaw;
};

type CoveoSearchResponse = {
    results: CoveoResult[];
    totalCount: number;
};

// ---------- Helpers ----------

function findMetaValue(asset: MediaAsset, externalId: string): string | undefined {
    const item = asset.metadata.find((m) => m.external_id === externalId);
    if (!item) return undefined;
    return typeof item.value === "string" ? item.value : item.value.value;
}

// ---------- Route ----------

router.get("/product", async (req: Request, res: Response) => {
    try {
        const partNumber = req.query.partNumber as string;
        if (!partNumber) {
            return res.status(400).json({ error: "Missing partNumber param" });
        }

        // Step 1: fetch Coveo token and media assets in parallel
        const [tokenRes, mediaRes] = await Promise.all([
            fetch("https://www.basspro.ca/api/v2/10151/prod/coveo/getCoveoToken"),
            fetch(`https://www.basspro.ca/wcs/resources/store/10151/cloudinary/getMediaAssets?partNumber=${encodeURIComponent(partNumber)}`),
        ]);

        if (!tokenRes.ok) {
            return res.status(500).json({ error: "Failed to fetch Coveo token" });
        }
        const { token } = (await tokenRes.json()) as CoveoTokenResponse;

        // Media assets gives us UPC; treat it as optional so we don't fail if it's down
        let upc: string | undefined;
        if (mediaRes.ok) {
            const mediaData = (await mediaRes.json()) as MediaAssetsResponse;
            const firstAsset = mediaData.resources?.[0];
            if (firstAsset) {
                upc = findMetaValue(firstAsset, "upc");
            }
        } else {
            console.warn("Media assets fetch failed:", mediaRes.status);
        }

        // Step 2: query Coveo for product data by SKU
        const coveoRes = await fetch("https://platform.cloud.coveo.com/rest/search/v2", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                q: "",
                aq: `@sku==${partNumber}`,
                numberOfResults: 1,
            }),
        });

        console.log("Coveo search status:", coveoRes.status);
        if (!coveoRes.ok) {
            const errText = await coveoRes.text();
            console.error("Coveo error body:", errText);
            return res.status(coveoRes.status).json({ error: "Failed to fetch product from Coveo" });
        }

        const coveoData = (await coveoRes.json()) as CoveoSearchResponse;
        const result = coveoData.results?.[0];
        if (!result) {
            return res.status(404).json({ error: "Product not found" });
        }

        const raw = result.raw;
        //console.log("Coveo raw data:", raw);

        res.json({
            brand: raw.brand_ca ?? null,
            title: result.title,
            salePrice: raw.offerprice_ca ?? null,
            regularPrice: raw.listprice_ca ?? null,
            onSale: raw.issale_ca === 1 || raw.issale_ca === "1",
            percentSavings: raw.percentsavings_ca ?? null,
            amountSavings: raw.savings_ca ?? null,
            departmentName: raw.department_name_ca ?? null,
            styleNumber: raw.style_number_ca ?? null,
            availableQuantityCanada: raw.availquantity_ca ?? null,
            sku: raw.sku ?? partNumber,
            upc: upc ?? null,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
