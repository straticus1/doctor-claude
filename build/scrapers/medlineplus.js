import * as cheerio from 'cheerio';
/**
 * Search MedlinePlus for medical information
 */
export async function searchMedlinePlus(query) {
    const searchUrl = `https://vsearch.nlm.nih.gov/vivisimo/cgi-bin/query-meta?v%3Aproject=medlineplus&v%3Asources=medlineplus-bundle&query=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl);
    const html = await response.text();
    return parseMedlinePlusSearch(html);
}
/**
 * Parse MedlinePlus search-results HTML into structured results.
 * Pure function of the HTML — no network access — so it can be tested against fixtures.
 */
export function parseMedlinePlusSearch(html) {
    const $ = cheerio.load(html);
    const results = [];
    // Parse search results from ordered list
    $('ol li').each((_, elem) => {
        const $result = $(elem);
        const $titleLink = $result.find('a.title');
        const title = $titleLink.text().trim();
        const href = $titleLink.attr('href');
        const description = $result.find('.document-body').text().trim();
        // Extract actual URL from redirect
        if (href && title) {
            let actualUrl = '';
            let type = 'Article';
            // Extract the actual destination URL from the redirect
            if (href.includes('url=')) {
                const urlMatch = href.match(/url=([^&]+)/);
                if (urlMatch) {
                    actualUrl = decodeURIComponent(urlMatch[1]);
                    // Determine type from URL
                    if (actualUrl.includes('/ency/article/')) {
                        type = 'Medical Encyclopedia';
                    }
                    else if (actualUrl.includes('/ency/patientinstructions/')) {
                        type = 'Patient Instructions';
                    }
                    else if (actualUrl.includes('/genetics/')) {
                        type = 'Genetics';
                    }
                    else {
                        type = 'Health Topic';
                    }
                }
            }
            if (actualUrl) {
                results.push({
                    title,
                    url: actualUrl,
                    description: description || '',
                    type
                });
            }
        }
    });
    return results;
}
/**
 * Fetch and parse a MedlinePlus article
 */
export async function fetchMedlinePlusArticle(url) {
    const response = await fetch(url);
    const html = await response.text();
    return parseMedlinePlusArticle(html, url);
}
/**
 * Parse a MedlinePlus article HTML into structured sections.
 * Pure function of the HTML and its source URL — no network access.
 */
export function parseMedlinePlusArticle(html, url) {
    const $ = cheerio.load(html);
    // Get title
    const title = $('h1').first().text().trim() || $('title').text().trim();
    const sections = [];
    // For encyclopedia articles
    if (url.includes('/ency/article/')) {
        // Extract main content sections
        $('#ency_summary').each((_, elem) => {
            sections.push({
                name: 'Summary',
                content: $(elem).text().trim()
            });
        });
        // Extract all article sections
        $('article section, #article section').each((_, elem) => {
            const $section = $(elem);
            const sectionTitle = $section.find('h2, h3').first().text().trim();
            // Get content without the heading
            const $clone = $section.clone();
            $clone.find('h2, h3').first().remove();
            const content = $clone.text().trim();
            if (sectionTitle && content) {
                sections.push({
                    name: sectionTitle,
                    content
                });
            }
        });
        // Fallback: if no sections found, try to get main content
        if (sections.length === 0) {
            const mainContent = $('#ency_summary, #mplus-content, .main-content').text().trim();
            if (mainContent) {
                sections.push({
                    name: 'Content',
                    content: mainContent
                });
            }
        }
    }
    else {
        // For health topics and other pages
        const mainContent = $('#topic-summary, .page-content, #mplus-content').text().trim();
        if (mainContent) {
            sections.push({
                name: 'Summary',
                content: mainContent
            });
        }
    }
    return {
        title,
        url,
        sections
    };
}
