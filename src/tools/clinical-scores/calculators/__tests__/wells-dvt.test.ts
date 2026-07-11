import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Wells DVT score (Wells et al., Lancet 1997 / NEJM 2003): +1 for each of nine
// clinical items, and -2 if an alternative diagnosis is at least as likely.
// Risk (three-tier): <1 Low (~5%), 1-2 Moderate (~17%), ≥3 High (~53%).
const allFalse = {
  activeCancer: false,
  paralysisOrImmobilization: false,
  recentlyBedridden: false,
  localizedTenderness: false,
  entireLegSwollen: false,
  calfSwelling: false,
  pittingEdema: false,
  collateralVeins: false,
  previousDVT: false,
  alternativeDiagnosis: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'wells_dvt', inputs } as any);
}

describe('Wells DVT worked examples', () => {
  it('scores 0 (Low) when no criteria are present', () => {
    const r = run(allFalse);
    expect(r.score).toBe(0);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 3 (High) for active cancer + localized tenderness + entire leg swollen', () => {
    const r = run({
      ...allFalse,
      activeCancer: true,
      localizedTenderness: true,
      entireLegSwollen: true,
    });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('yields a negative total when only an alternative diagnosis is present', () => {
    const r = run({ ...allFalse, alternativeDiagnosis: true });
    expect(r.score).toBe(-2);
    expect(r.riskCategory).toMatch(/low/i);
  });
});

describe('Wells DVT boundaries', () => {
  it('the alternative-diagnosis modifier subtracts exactly 2', () => {
    // two +1 items (=2) minus alternative diagnosis (-2) = 0
    const r = run({
      ...allFalse,
      activeCancer: true,
      localizedTenderness: true,
      alternativeDiagnosis: true,
    });
    expect(r.score).toBe(0);
  });

  it('a single positive item scores 1 → Moderate (three-tier: 1-2 is moderate)', () => {
    // Published Wells DVT three-tier: <=0 Low, 1-2 Moderate, >=3 High.
    const r = run({ ...allFalse, activeCancer: true });
    expect(r.score).toBe(1);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('two positive items score 2 (Moderate, cut-point at 3)', () => {
    const r = run({ ...allFalse, activeCancer: true, previousDVT: true });
    expect(r.score).toBe(2);
    expect(r.riskCategory).toMatch(/moderate/i);
  });
});

describe('Wells DVT rejection', () => {
  it('rejects a missing required field', () => {
    const { previousDVT, ...missing } = allFalse;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...allFalse, activeCancer: 1 })).toThrow();
  });
});
