# Doctor Claude Improvement Roadmap — Design

Date: 2026-07-11
Status: Approved

## Goal

Grow Doctor Claude from a scraper-plus-calculators MCP server into a trustworthy,
distributable medical knowledge tool, in five phases ordered by dependency:
tests before features, APIs before the features that consume them, distribution
once the thing being distributed is solid.

## Phase 1 — Trustworthiness

The foundation everything else builds on. Wrong-but-confident output is the
worst failure mode for a medical tool.

- **Test runner:** vitest, wired as `npm test`.
- **Calculator tests:** one file per calculator under
  `src/tools/clinical-scores/calculators/__tests__/`, each with three groups:
  1. *Published worked examples* — 2–4 cases per score with expected total and
     risk band, cited to the source paper or MDCalc in a comment.
  2. *Boundary cases* — every scoring cut-point edge (e.g. CURB-65 age 65 vs 64).
  3. *Rejection cases* — zod schemas refuse out-of-range, missing, and
     wrong-typed inputs. Fail closed, never guess.
- **Scraper tests:** unit tests against saved HTML fixtures (offline,
  deterministic), plus a separate `test:live` smoke suite that hits the real
  MedlinePlus/StatPearls sites so markup drift fails loudly instead of silently.
- **CI:** GitHub Actions — typecheck + unit tests on every push; the live
  smoke suite on a weekly schedule.

## Phase 2 — Data sources

Real APIs replace fragility rather than adding to it.

- **PubMed** via NCBI E-utilities, added as a source option on the existing
  `searchMedical`/`fetchArticle` tools (not a separate tool).
- **RxNorm** (NLM) for drug-name normalization ("Tylenol" → canonical concept).
- **openFDA** drug labels for dosing, warnings, contraindications, and the
  `drug_interactions` label sections.

## Phase 3 — Deeper clinical features

- **Patient profile schema v2** (`src/profile/`): adds `medications[]`
  (name/dose/frequency), `allergies[]` (substance/reaction), `conditions[]`,
  `labs[]`, `familyHistory[]` — all optional, zod-validated, with a migration
  path so existing `patient-profile.json` files keep working. The profile is
  the multiplier: calculators and the diagnostic prompt auto-consume it.
- More calculators; a follow-up/triage prompt beyond the single diagnostic
  consultation.

## Phase 4 — Polish & distribution

- npm publish + MCP registry listing.
- In-memory TTL response caching (the server is a long-lived process).
- Tightened tool descriptions so Claude routes by intent.

## Phase 5 — Specialty knowledge domains

Built on the Phase 2 plumbing. All sources are free, public APIs — no scraping.

| Domain | Source | Notes |
|---|---|---|
| Medications | RxNorm + openFDA labels | Normalization + label content |
| Interactions | openFDA `drug_interactions` sections | NLM retired its interaction API; label-derived checking chosen over licensed DBs (DrugBank etc. declined) |
| Allergies | Patient profile + curated cross-reactivity table | Safety behavior, not an API: every med lookup auto-warns on profile allergy conflicts, incl. classes like penicillins→cephalosporins |
| Viruses / infectious disease | StatPearls + MedlinePlus | Mostly a search-routing improvement, not a new source |
| Genetic conditions | MedlinePlus Genetics | Same source family as existing scraper |
| Rare diseases | NIH GARD, Orphanet | Orphanet for structured data (prevalence, inheritance, phenotypes); OMIM skipped (registration/licensing) |

## Architecture

- **Data-source clients** in `src/sources/` — one module per backend
  (`pubmed.ts`, `rxnorm.ts`, `openfda.ts`, `gard.ts`, `orphanet.ts`; existing
  scrapers re-home here unchanged). Each client owns its rate limiting
  (NCBI ≤3 req/s without a key) and caching.
- **Tool surface stays small** — three intent-shaped tools instead of one per
  source:
  - `lookupDrug` — name/dose/warnings/interactions (RxNorm + openFDA behind it)
  - `checkInteractions` — explicit med list *or* patient profile; pairwise
    findings + allergy cross-reactivity warnings
  - `lookupCondition` — routes across MedlinePlus, MedlinePlus Genetics, GARD,
    Orphanet, StatPearls by condition type

## Error handling as a contract

Every tool returns structured errors rather than throwing:

- Source unavailable → "couldn't reach X, try Y" with the alternative named.
- Ambiguous drug name → return RxNorm's candidate list for disambiguation.
- Profile missing fields needed by `checkInteractions` → name the exact fields;
  never silently check a partial med list (a half-checked interaction list
  reads as "all clear" and is worse than none).

## Safety framing

Every drug/interaction response carries the server's educational-use
disclaimer, and interaction findings are worded as "discuss with your
pharmacist/physician" — never dosing advice.
