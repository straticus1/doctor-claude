import * as cheerio from 'cheerio';

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
export async function searchStatPearls(query: string): Promise<StatPearlsSearchResult[]> {
  // Search directly within the StatPearls book
  const searchUrl = `https://www.ncbi.nlm.nih.gov/books/NBK430685/?term=${encodeURIComponent(query)}`;

  const response = await fetch(searchUrl);
  const html = await response.text();
  return parseStatPearlsSearch(html);
}

/**
 * Parse StatPearls (NCBI book) search-results HTML into structured results.
 * Pure function of the HTML — no network access — so it can be tested against fixtures.
 */
export function parseStatPearlsSearch(html: string): StatPearlsSearchResult[] {
  const $ = cheerio.load(html);

  const results: StatPearlsSearchResult[] = [];

  // Parse search results within the book
  $('.rslt').each((_, elem) => {
    const $result = $(elem);
    const $titleLink = $result.find('p.title a, .title a');
    const title = $titleLink.text().trim();
    const href = $titleLink.attr('href');

    if (title && href) {
      // Build full URL
      let url = href;
      if (!url.startsWith('http')) {
        url = `https://www.ncbi.nlm.nih.gov${url}`;
      }

      // Get description from details or supp
      const description = $result.find('.desc, .details').text().trim();

      results.push({
        title,
        url,
        description: description || ''
      });
    }
  });

  return results.slice(0, 10); // Limit to top 10 results
}

/**
 * Fetch and parse a StatPearls article from NCBI
 */
export async function fetchStatPearlsArticle(url: string): Promise<StatPearlsArticle> {
  const response = await fetch(url);
  const html = await response.text();
  return parseStatPearlsArticle(html, url);
}

/**
 * Parse a StatPearls article HTML into structured sections.
 * Pure function of the HTML and its source URL — no network access.
 */
export function parseStatPearlsArticle(html: string, url: string): StatPearlsArticle {
  const $ = cheerio.load(html);

  // Get title
  const title = $('h1.heading-title, .article-title').first().text().trim() ||
    $('title').text().replace(' - StatPearls - NCBI Bookshelf', '').trim();

  // Get metadata
  const authors = $('.authors, .contrib-group').text().trim();
  const lastUpdated = $('.fm-updated, .fm-last-update').text().trim();

  const sections: { name: string; content: string }[] = [];

  // StatPearls articles have structured sections with h2 headings
  $('.article-content, #article-content, .chapter-content').find('h2, h3').each((_, elem) => {
    const $heading = $(elem);
    const sectionName = $heading.text().trim();

    // Get content until next heading
    const contentParts: string[] = [];
    let $next = $heading.next();

    while ($next.length && !$next.is('h2, h3')) {
      const text = $next.text().trim();
      if (text) {
        contentParts.push(text);
      }
      $next = $next.next();
    }

    if (sectionName && contentParts.length > 0) {
      sections.push({
        name: sectionName,
        content: contentParts.join('\n\n')
      });
    }
  });

  // Fallback: if no sections found, get all paragraphs
  if (sections.length === 0) {
    const allContent: string[] = [];
    $('.article-content p, #article-content p, .chapter-content p').each((_, elem) => {
      const text = $(elem).text().trim();
      if (text) {
        allContent.push(text);
      }
    });

    if (allContent.length > 0) {
      sections.push({
        name: 'Content',
        content: allContent.join('\n\n')
      });
    }
  }

  return {
    title,
    url,
    authors: authors || undefined,
    lastUpdated: lastUpdated || undefined,
    sections
  };
}
