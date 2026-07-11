export interface StatPearlsSearchResult {
    title: string;
    url: string;
    description: string;
    authors?: string;
    updated?: string;
}
export interface StatPearlsArticle {
    title: string;
    url: string;
    authors?: string;
    lastUpdated?: string;
    sections: {
        name: string;
        content: string;
    }[];
}
/**
 * Search StatPearls on NCBI for medical information
 * Searches directly within the StatPearls book (NBK430685)
 */
export declare function searchStatPearls(query: string): Promise<StatPearlsSearchResult[]>;
/**
 * Parse StatPearls (NCBI book) search-results HTML into structured results.
 * Pure function of the HTML — no network access — so it can be tested against fixtures.
 */
export declare function parseStatPearlsSearch(html: string): StatPearlsSearchResult[];
/**
 * Fetch and parse a StatPearls article from NCBI
 */
export declare function fetchStatPearlsArticle(url: string): Promise<StatPearlsArticle>;
/**
 * Parse a StatPearls article HTML into structured sections.
 * Pure function of the HTML and its source URL — no network access.
 */
export declare function parseStatPearlsArticle(html: string, url: string): StatPearlsArticle;
