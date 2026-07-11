import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  parseMedlinePlusSearch,
  parseMedlinePlusArticle,
} from '../medlineplus.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name: string) =>
  readFileSync(join(__dirname, '..', '__fixtures__', name), 'utf8');

// Fixtures are real HTML captured from the live sites (see __fixtures__/).
// Tests assert SHAPE and NON-EMPTINESS, not exact text: content changes over
// time; a broken parser (structure drift) is what these detect.

describe('parseMedlinePlusSearch', () => {
  const results = parseMedlinePlusSearch(
    fixture('medlineplus-search-diabetes.html'),
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

  it('every result carries a title and url', () => {
    for (const r of results) {
      expect(r.title.length).toBeGreaterThan(0);
      expect(r.url.length).toBeGreaterThan(0);
    }
  });
});

describe('parseMedlinePlusArticle', () => {
  const article = parseMedlinePlusArticle(
    fixture('medlineplus-article-diabetes.html'),
    'https://medlineplus.gov/ency/article/001214.htm',
  );

  it('has a nonempty title', () => {
    expect(article.title.length).toBeGreaterThan(0);
  });

  it('preserves the source url', () => {
    expect(article.url).toBe('https://medlineplus.gov/ency/article/001214.htm');
  });

  it('has at least one section with nonempty content', () => {
    expect(article.sections.length).toBeGreaterThanOrEqual(1);
    const first = article.sections[0];
    expect(first.name.length).toBeGreaterThan(0);
    expect(first.content.length).toBeGreaterThan(0);
  });
});
