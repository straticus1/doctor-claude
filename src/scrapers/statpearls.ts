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

  // Get title. Current NCBI Bookshelf pages expose a clean article title via
  // the `citation_title` meta tag; the visible <h1> is the generic "Bookshelf"
  // banner and the <title> text is polluted with social-media link text, so
  // prefer the meta tag and keep the legacy selectors as fallbacks.
  const title =
    $('meta[name="citation_title"]').attr('content')?.trim() ||
    $('h1.content-title, h1.heading-title, .article-title').first().text().trim() ||
    $('title').text().replace(' - StatPearls - NCBI Bookshelf', '').trim();

  // Get metadata. `citation_author` meta tags are the reliable modern source;
  // fall back to the legacy author/contrib containers.
  const authors =
    $('meta[name="citation_author"]')
      .map((_, elem) => $(elem).attr('content'))
      .get()
      .join(', ')
      .trim() ||
    $('.authors, .contrib-group').first().text().trim();
  const lastUpdated = $('.fm-updated, .fm-last-update').first().text().trim();

  // Locate the article body. Modern NCBI Bookshelf renders the chapter under
  // `.body-content` (inside `.book-part`); `.book-part` also wraps the citation
  // front-matter, so `.body-content` is preferred to skip that noise. The
  // legacy selectors are kept for older/alternate markup and test fixtures.
  const contentSelectors = [
    '.body-content',
    '.article-content',
    '#article-content',
    '.chapter-content',
    '.book-part',
  ];
  const contentSelector =
    contentSelectors.find((selector) => $(selector).first().length) || 'body';
  const $content = $(contentSelector).first();

  const sections: { name: string; content: string }[] = [];

  // StatPearls chapters are divided into sections, each a wrapper element
  // containing an h2/h3 heading followed by its content elements. Walk each
  // heading and gather following siblings until the next heading.
  $content.find('h2, h3').each((_, elem) => {
    const $heading = $(elem);
    const sectionName = $heading.text().trim();
    if (!sectionName) {
      return;
    }

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

    if (contentParts.length > 0) {
      sections.push({
        name: sectionName,
        content: contentParts.join('\n\n')
      });
    }
  });

  // Fallback: if no sections found, get all paragraphs from the content root
  if (sections.length === 0) {
    const allContent: string[] = [];
    $content.find('p').each((_, elem) => {
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
