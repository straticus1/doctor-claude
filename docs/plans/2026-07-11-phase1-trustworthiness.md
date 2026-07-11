# Phase 1: Trustworthiness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Every clinical calculator validated against published worked examples, scrapers tested against fixtures with a live drift-detection suite, all wired into CI.

**Architecture:** vitest test suite testing through the public `calculateClinicalScore` dispatch (so zod validation + calculation are exercised together). Scrapers get parse functions extracted from fetch functions so parsing is testable offline against saved HTML fixtures. A separate `*.live.test.ts` suite hits real sites on a weekly CI schedule.

**Tech Stack:** vitest, GitHub Actions. ESM project (`"type": "module"`) — internal imports use `.js` extensions, including in test files.

**Medical correctness rule (applies to every calculator task):** Expected values in tests come from the published scoring rule (source paper or MDCalc), NOT from running the implementation. If a test fails, first verify the expectation against the published source; if the expectation is right, the implementation has a bug — fix the implementation and note it in the commit message. Never adjust a test to match code without checking the source.

---

### Task 1: vitest setup

**Files:**
- Modify: `package.json` (scripts + devDependency)
- Create: `vitest.config.ts`

**Step 1: Install vitest**

```bash
npm install -D vitest
```

**Step 2: Add scripts to package.json**

```json
"test": "vitest run --exclude '**/*.live.test.ts'",
"test:watch": "vitest --exclude '**/*.live.test.ts'",
"test:live": "vitest run src/**/*.live.test.ts"
```

**Step 3: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

**Step 4: Verify the runner works**

Run: `npm test`
Expected: "No test files found" (exit code may be nonzero — that's fine, no tests exist yet)

**Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "add vitest test runner"
```

---

### Task 2: CURB-65 tests (template for all calculator tests)

This task establishes the pattern every calculator test file follows: worked examples → boundary cases → rejection cases, all through `calculateClinicalScore`.

**Files:**
- Create: `src/tools/clinical-scores/calculators/__tests__/curb65.test.ts`

**Step 1: Write the tests**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// CURB-65 (Lim et al., Thorax 2003): confusion, BUN >19 mg/dL (urea >7 mmol/L),
// RR ≥30, SBP <90 or DBP ≤60, age ≥65 — 1 point each.
const base = {
  confusion: false,
  urea: 10, // mg/dL, below threshold
  respiratoryRate: 18,
  bloodPressure: { systolic: 120, diastolic: 80 },
  age: 50,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'curb65', inputs } as any);
}

describe('CURB-65 worked examples', () => {
  it('scores 0 for a healthy low-risk presentation', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 5 for a maximal presentation (MDCalc worked example)', () => {
    const r = run({
      confusion: true,
      urea: 25,
      respiratoryRate: 32,
      bloodPressure: { systolic: 85, diastolic: 55 },
      age: 80,
    });
    expect(r.score).toBe(5);
    expect(r.maxScore).toBe(5);
    expect(r.riskCategory).toMatch(/high|severe/i);
  });

  it('scores 2 for elderly patient with elevated BUN only', () => {
    const r = run({ ...base, age: 70, urea: 24 });
    expect(r.score).toBe(2);
  });
});

describe('CURB-65 boundaries', () => {
  it('age 65 scores the age point; 64 does not', () => {
    expect(run({ ...base, age: 65 }).score).toBe(1);
    expect(run({ ...base, age: 64 }).score).toBe(0);
  });

  it('RR 30 scores; RR 29 does not', () => {
    expect(run({ ...base, respiratoryRate: 30 }).score).toBe(1);
    expect(run({ ...base, respiratoryRate: 29 }).score).toBe(0);
  });

  it('SBP 89 scores; SBP 90 with normal DBP does not', () => {
    expect(run({ ...base, bloodPressure: { systolic: 89, diastolic: 80 } }).score).toBe(1);
    expect(run({ ...base, bloodPressure: { systolic: 90, diastolic: 80 } }).score).toBe(0);
  });

  it('DBP 60 scores (≤60); DBP 61 does not', () => {
    expect(run({ ...base, bloodPressure: { systolic: 120, diastolic: 60 } }).score).toBe(1);
    expect(run({ ...base, bloodPressure: { systolic: 120, diastolic: 61 } }).score).toBe(0);
  });

  it('BUN 20 mg/dL scores; 19 does not (threshold >19)', () => {
    expect(run({ ...base, urea: 20 }).score).toBe(1);
    expect(run({ ...base, urea: 19 }).score).toBe(0);
  });

  it('urea in mmol/L is converted (8 mmol/L ≈ BUN 22.4 → scores)', () => {
    expect(run({ ...base, urea: 8 }).score).toBe(1);
  });

  it('omitted urea contributes nothing rather than guessing', () => {
    const { urea, ...noUrea } = base;
    expect(run(noUrea).score).toBe(0);
  });
});

describe('CURB-65 rejection', () => {
  it('rejects missing required field', () => {
    const { age, ...missingAge } = base;
    expect(() => run(missingAge)).toThrow();
  });

  it('rejects wrong-typed input', () => {
    expect(() => run({ ...base, respiratoryRate: 'fast' })).toThrow();
  });
});
```

**Step 2: Run and verify**

Run: `npx vitest run src/tools/clinical-scores/calculators/__tests__/curb65.test.ts`
Expected: all pass. **Before checking the boundary tests, read `src/tools/clinical-scores/constants.ts` and `calculators/curb65.ts`** to confirm the implementation's thresholds and the urea-unit heuristic (`convertUreaToBUN` in `utils.ts` treats values ≤ `UREA_MMOL_THRESHOLD` as mmol/L). If a boundary test fails, apply the medical correctness rule from the header.

**Step 3: Commit**

```bash
git add src/tools/clinical-scores/calculators/__tests__/curb65.test.ts
git commit -m "test: CURB-65 against published worked examples and boundaries"
```

---

### Task 3: MELD tests (template for formula-based calculators)

**Files:**
- Create: `src/tools/clinical-scores/calculators/__tests__/meld.test.ts`

MELD (original UNOS): `3.78×ln(bilirubin) + 11.2×ln(INR) + 9.57×ln(creatinine) + 6.43`, labs floored at 1.0, creatinine capped at 4.0 (and set to 4.0 if dialysis), rounded, clamped to 6–40.

**Step 1: Write the tests**

```typescript
import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'meld', inputs } as any);
}

describe('MELD worked examples', () => {
  it('all-normal labs clamp to minimum score 6', () => {
    const r = run({ bilirubin: 1.0, inr: 1.0, creatinine: 1.0, dialysis: false });
    expect(r.score).toBe(6); // ln(1)=0 → 6.43 → rounds to 6
  });

  it('bilirubin 3.0, INR 1.5, creatinine 2.0 → 22', () => {
    // 3.78×ln(3) + 11.2×ln(1.5) + 9.57×ln(2) + 6.43 = 4.153+4.541+6.633+6.43 = 21.76 → 22
    const r = run({ bilirubin: 3.0, inr: 1.5, creatinine: 2.0, dialysis: false });
    expect(r.score).toBe(22);
  });

  it('extreme labs clamp to maximum 40', () => {
    const r = run({ bilirubin: 30, inr: 5, creatinine: 4, dialysis: false });
    expect(r.score).toBe(40);
  });
});

describe('MELD boundaries', () => {
  it('labs below 1.0 are floored at 1.0', () => {
    const low = run({ bilirubin: 0.5, inr: 0.8, creatinine: 0.6, dialysis: false });
    const floored = run({ bilirubin: 1.0, inr: 1.0, creatinine: 1.0, dialysis: false });
    expect(low.score).toBe(floored.score);
  });

  it('dialysis forces creatinine to 4.0', () => {
    const dialysis = run({ bilirubin: 2.0, inr: 1.5, creatinine: 1.0, dialysis: true });
    const cr4 = run({ bilirubin: 2.0, inr: 1.5, creatinine: 4.0, dialysis: false });
    expect(dialysis.score).toBe(cr4.score);
  });

  it('creatinine above 4.0 is capped at 4.0', () => {
    const high = run({ bilirubin: 2.0, inr: 1.5, creatinine: 6.0, dialysis: false });
    const capped = run({ bilirubin: 2.0, inr: 1.5, creatinine: 4.0, dialysis: false });
    expect(high.score).toBe(capped.score);
  });
});

describe('MELD rejection', () => {
  it('rejects zero/negative lab values (schema requires positive)', () => {
    expect(() => run({ bilirubin: 0, inr: 1.0, creatinine: 1.0, dialysis: false })).toThrow();
    expect(() => run({ bilirubin: 1.0, inr: -1, creatinine: 1.0, dialysis: false })).toThrow();
  });
});
```

**Step 2: Run, verify, commit**

Run: `npx vitest run src/tools/clinical-scores/calculators/__tests__/meld.test.ts`
Expected: pass (verify the hand-computed 21.76 → 22 case against `calculators/meld.ts` rounding: it rounds to 1 decimal, then rounds to integer).

```bash
git add src/tools/clinical-scores/calculators/__tests__/meld.test.ts
git commit -m "test: MELD formula, clamping, and dialysis handling"
```

---

### Tasks 4–12: remaining 17 calculators

One test file per calculator, same three-group structure and `run()` helper as Task 2. **For each: read the calculator source + its entry in `constants.ts` and `guidance.ts` first**, then write tests from the published rule. One commit per calculator (`test: <name> ...`). Group into these tasks:

**Task 4 — simple additive scores:** `qsofa` (RR ≥22, SBP ≤100, AMS; boundaries at 22/21 and 100/101), `alvarado` (MANTRELS weights: tenderness 2, leukocytosis 2, rest 1; max 10), `centor` (check source for McIsaac age adjustment: +1 age 3–14, −1 age ≥45), `gad7` (all-`not_at_all`=0, all-`nearly_every_day`=21; category boundaries at 5/10/15).

**Task 5 — Wells pair:** `wells_dvt` (each +1, `alternativeDiagnosis` −2 — test the negative total, e.g. only alternativeDiagnosis true → −2), `wells_pe` (weights 3/3/1.5/1.5/1.5/1/1, max 12.5 — test fractional totals, e.g. HR>100 + immobilization = 3).

**Task 6 — cardiac risk:** `heart` (age bands <45/45–64/≥65 → 0/1/2; riskFactors 0/1–2/≥3 → 0/1/2; boundaries at 45 and 65), `timi` (7×1 point, age ≥65 boundary), `grace` (point-table based — take 2 worked examples from MDCalc, verify each variable's banding against `constants.ts`; test Killip class bounds 1–4 rejection at 0 and 5).

**Task 7 — anticoagulation pair:** `cha2ds2_vasc` (age bands 65–74→1, ≥75→2; female +1; boundaries at 65/75; max 9 — e.g. 76yo female with all comorbidities = 9), `has_bled` (age >65 boundary — check source: strictly greater vs ≥; max 9).

**Task 8 — neuro:** `gcs` (min 3 all-none, max 15; verify each enum level's points from the schema descriptions), `nihss` (max 42 all-worst; `amputation` and `intubated` score 0; sum a mid-range worked example item-by-item), `abcd2` (age ≥60 =1; BP ≥140 systolic OR ≥90 diastolic =1 — test both arms; features/duration enums; max 7).

**Task 9 — PERC:** rule-out semantics, not a graded score — all-negative (age <50, HR <100, SpO2 ≥95, no other criteria) must report PE ruled out / negative; any single positive criterion flips it. Boundaries: age 49/50, HR 99/100, SpO2 95/94.

**Task 10 — GI bleed:** `glasgow_blatchford` (banded point table, sex-dependent hemoglobin bands; score 0 case: BUN <18.2, Hgb ≥13 male/≥12 female, SBP ≥110, pulse <100, no melena/syncope/hepatic/cardiac; one high-score worked example from MDCalc; verify bands against `constants.ts`).

**Task 11 — SOFA:** six organ systems 0–4. Test each organ's banding in isolation (hold others at normal): respiratory (PaO2/FiO2 ratio with/without ventilation; FiO2 accepted as 0.21–1.0 or 21–100 via `normalizeFiO2`), coagulation (platelet bands), liver (bilirubin bands), cardiovascular (MAP <70 and each vasopressor enum), CNS (GCS bands), renal (creatinine bands + urine-output overrides in `calculateRenalScore`). Plus one full worked example summing to a known total.

**Task 12 — dispatch:** `src/tools/clinical-scores/__tests__/dispatch.test.ts` — unknown calculator name rejected by the enum; inputs for calculator A sent to calculator B throw; every calculator name in the enum has an entry in `calculatorMap` (iterate the enum options).

---

### Task 13: tighten input schemas (fail closed on nonsense)

**Files:**
- Modify: `src/tools/clinical-scores/schemas.ts`
- Modify: calculator test files (add rejection cases)

Several numeric fields accept any number (age −5, RR 4000). Add conservative range constraints, then rejection tests for each:

- `age`: `.min(0).max(120)` everywhere age appears
- `respiratoryRate`: `.min(0).max(100)`
- systolic/diastolic BP: `.min(0).max(300)` / `.min(0).max(200)`
- `heartRate`/`pulse`: `.min(0).max(300)`
- `oxygenSaturation`: `.min(0).max(100)`
- `riskFactors` (HEART): add `.max(10)`

Range choices are physiologic-plausibility guards, not clinical judgments — keep them wide. Run the full suite after (`npm test`) to confirm no worked example is rejected. Commit: `fix: add physiologic range constraints to calculator inputs`.

---

### Task 14: extract scraper parse functions

**Files:**
- Modify: `src/scrapers/medlineplus.ts`, `src/scrapers/statpearls.ts`

Each scraper currently fetches and parses in one function. Split, preserving public APIs exactly:

- `parseMedlinePlusSearch(html: string): MedlinePlusSearchResult[]` and `parseMedlinePlusArticle(html: string, url: string): MedlinePlusArticle`; `searchMedlinePlus`/`fetchMedlinePlusArticle` become fetch-then-parse wrappers. Same for StatPearls.
- Pure refactor — no behavior change. Verify with `npm run build` (types) and Task 15's fixture tests.

Commit: `refactor: extract scraper parse functions for testability`.

---

### Task 15: scraper fixture tests

**Files:**
- Create: `src/scrapers/__fixtures__/` (saved HTML)
- Create: `src/scrapers/__tests__/medlineplus.test.ts`, `src/scrapers/__tests__/statpearls.test.ts`

**Step 1: Capture fixtures** (check `src/scrapers/*.ts` for the exact URL formats used):

```bash
curl -s 'https://medlineplus.gov/...' > src/scrapers/__fixtures__/medlineplus-search-diabetes.html
# ...one search-results page and one article page per source
```

**Step 2: Write tests** — load fixture with `readFileSync`, call the parse function, assert: nonzero result count, first result has nonempty title/url, article has nonempty title and ≥1 section with content. Assert *shape and non-emptiness*, not exact text (content changes; structure breaking is what we detect).

**Step 3: Run, verify, commit** (`test: scraper parsing against saved HTML fixtures`). Commit the fixtures.

---

### Task 16: live smoke suite

**Files:**
- Create: `src/scrapers/__tests__/scrapers.live.test.ts`

One test per scraper function hitting the real site with a stable query (e.g. "diabetes"): asserts ≥1 search result with nonempty title/url, and that fetching the first result yields ≥1 nonempty section. 30s timeouts (`it('...', { timeout: 30_000 }, ...)`). Excluded from `npm test` by the Task 1 script config — verify `npm test` does NOT run it and `npm run test:live` does. Commit: `test: live smoke suite for scraper drift detection`.

---

### Task 17: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml` — on push + PR: `npm ci`, `npm run build`, `npm test` (Node 20)
- Create: `.github/workflows/live-smoke.yml` — `on: schedule: - cron: '0 6 * * 1'` (weekly, Monday) + `workflow_dispatch`: `npm ci && npm run build && npm run test:live`

Verify: `git push` and confirm the ci workflow goes green on GitHub (`gh run watch`). Commit: `ci: test on push, weekly live scraper smoke`.

---

### Task 18: final verification

- `npm test` — full suite green.
- `npm run build` — clean.
- Grep test files for `test.skip`, `.only`, empty test bodies — none allowed.
- Count: 19 calculator test files + dispatch + 2 scraper test files + 1 live suite.
