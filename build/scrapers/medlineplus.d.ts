export interface MedlinePlusSearchResult {
    title: string;
    url: string;
    description: string;
    type: string;
}
export interface MedlinePlusArticle {
    title: string;
    url: string;
    sections: {
        name: string;
        content: string;
    }[];
}
/**
 * Search MedlinePlus for medical information
 */
export declare function searchMedlinePlus(query: string): Promise<MedlinePlusSearchResult[]>;
/**
 * Parse MedlinePlus search-results HTML into structured results.
 * Pure function of the HTML — no network access — so it can be tested against fixtures.
 */
export declare function parseMedlinePlusSearch(html: string): MedlinePlusSearchResult[];
/**
 * Fetch and parse a MedlinePlus article
 */
export declare function fetchMedlinePlusArticle(url: string): Promise<MedlinePlusArticle>;
/**
 * Parse a MedlinePlus article HTML into structured sections.
 * Pure function of the HTML and its source URL — no network access.
 */
export declare function parseMedlinePlusArticle(html: string, url: string): MedlinePlusArticle;
