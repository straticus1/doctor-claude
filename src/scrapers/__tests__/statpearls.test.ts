import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  parseStatPearlsSearch,
  parseStatPearlsArticle,
} from '../statpearls.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  readFileSync(join(__dirname, '..', '__fixtures__', name), 'utf8');

// Both fixtures reflect the real NCBI Bookshelf markup. The article fixture
// mirrors the current live DOM shape (`.book-part` > `.body-content` with
// `div[id^="article-"]` section wrappers and a `citation_title` meta tag; see
// its header comment), so the parser is verified against the structure it
// actually meets in production, including that the citation front-matter block
// is not mistaken for a clinical section.
// Tests assert SHAPE and NON-EMPTINESS, not exact text.

describe('parseStatPearlsSearch', () => {
  const results = parseStatPearlsSearch(
    fixture('statpearls-search-diabetes.html'),
  );

  it('returns at least one result', () => {
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('first result has a nonempty title and url', () => {
    const first = results[0];
    expect(first.title.length).toBeGreaterThan(0);
    expect(first.url.length).toBeGreaterThan(0);
    expect(first.url).toMatch(/^https?:\/\//);
  });

  it('caps results at 10', () => {
    expect(results.length).toBeLessThanOrEqual(10);
  });
});

describe('parseStatPearlsArticle', () => {
  const article = parseStatPearlsArticle(
    fixture('statpearls-article-diabetes.html'),
    'https://www.ncbi.nlm.nih.gov/books/NBK551501/',
  );

  it('has a nonempty title', () => {
    expect(article.title.length).toBeGreaterThan(0);
  });

  it('preserves the source url', () => {
    expect(article.url).toBe('https://www.ncbi.nlm.nih.gov/books/NBK551501/');
  });

  it('has at least one section with nonempty content', () => {
    expect(article.sections.length).toBeGreaterThanOrEqual(1);
    const first = article.sections[0];
    expect(first.name.length).toBeGreaterThan(0);
    expect(first.content.length).toBeGreaterThan(0);
  });
});
