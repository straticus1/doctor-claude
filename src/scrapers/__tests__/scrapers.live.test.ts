import { describe, it, expect } from 'vitest';
import {
  searchMedlinePlus,
  fetchMedlinePlusArticle,
} from '../medlineplus.js';
import {
  searchStatPearls,
  fetchStatPearlsArticle,
} from '../statpearls.js';

// LIVE SMOKE SUITE — hits the real MedlinePlus and NCBI sites.
// EXCLUDED from `npm test`; run only via `npm run test:live`.
// Purpose: detect drift between the live site HTML and the parsers.
// Network failures here are acceptable (offline CI); structure drift is the
// signal we want. Per-test timeout is 30s.

const QUERY = 'diabetes';

describe('MedlinePlus (live)', () => {
  it(
    'searches and fetches the first result',
    { timeout: 30_000 },
    async () => {
      const results = await searchMedlinePlus(QUERY);
      expect(results.length).toBeGreaterThanOrEqual(1);
      const first = results[0];
      expect(first.title.length).toBeGreaterThan(0);
      expect(first.url.length).toBeGreaterThan(0);

      const article = await fetchMedlinePlusArticle(first.url);
      expect(article.sections.length).toBeGreaterThanOrEqual(1);
      expect(article.sections[0].content.length).toBeGreaterThan(0);
    },
  );
});

describe('StatPearls (live)', () => {
  it(
    'searches and fetches the first result',
    { timeout: 30_000 },
    async () => {
      const results = await searchStatPearls(QUERY);
      expect(results.length).toBeGreaterThanOrEqual(1);
      const first = results[0];
      expect(first.title.length).toBeGreaterThan(0);
      expect(first.url.length).toBeGreaterThan(0);

      const article = await fetchStatPearlsArticle(first.url);
      expect(article.sections.length).toBeGreaterThanOrEqual(1);
      expect(article.sections[0].content.length).toBeGreaterThan(0);
    },
  );
});
