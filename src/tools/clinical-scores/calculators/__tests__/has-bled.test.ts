import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// HAS-BLED (Pisters et al., Chest 2010), max 9, 1 point each:
//   Hypertension, Abnormal renal function, Abnormal liver function, Stroke,
//   Bleeding history/predisposition, Labile INR, Elderly age, Drugs/medications,
//   Alcohol use.
// Risk categories (guidance.ts, first threshold with score < threshold):
//   0 Low, 1 Low-Moderate, 2 Moderate, 3–4 High, 5–9 Very High.
//
// AGE NOTE: the HAS-BLED "Elderly" criterion is age > 65 (strict), so a 65-year-old
// scores 0 and only age ≥66 scores the point. The boundary tests below assert this
// published rule.
const base = {
  hypertension: false,
  abnormalRenalFunction: false,
  abnormalLiverFunction: false,
  stroke: false,
  bleedingHistory: false,
  labileINR: false,
  age: 50,
  medications: false,
  alcoholUse: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'has_bled', inputs } as any);
}

describe('HAS-BLED worked examples', () => {
  it('scores 0 (Low) for a young patient with no risk factors', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(9);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores the maximum 9 (Very High) when every factor is present (age 70)', () => {
    const r = run({
      hypertension: true,
      abnormalRenalFunction: true,
      abnormalLiverFunction: true,
      stroke: true,
      bleedingHistory: true,
      labileINR: true,
      age: 70,
      medications: true,
      alcoholUse: true,
    });
    expect(r.score).toBe(9);
    expect(r.riskCategory).toMatch(/very high/i);
  });
});

describe('HAS-BLED boundaries', () => {
  // Published HAS-BLED "Elderly" is age > 65 (strict): 65 does NOT score, 66 does.
  it('age 65 scores +0 (criterion is strictly >65)', () => {
    expect(run({ ...base, age: 65 }).score).toBe(0);
  });

  it('age 66 scores +1', () => {
    expect(run({ ...base, age: 66 }).score).toBe(1);
  });

  it('age 64 scores +0', () => {
    expect(run({ ...base, age: 64 }).score).toBe(0);
  });

  it('a score of exactly 1 is Low-Moderate (cut-point at 1)', () => {
    const r = run({ ...base, hypertension: true });
    expect(r.score).toBe(1);
    expect(r.riskCategory).toMatch(/low-moderate/i);
  });

  it('a score of exactly 2 is Moderate (cut-point at 2)', () => {
    const r = run({ ...base, hypertension: true, stroke: true });
    expect(r.score).toBe(2);
    expect(r.riskCategory).toMatch(/moderate/i);
    expect(r.riskCategory).not.toMatch(/low-moderate/i);
  });

  it('a score of exactly 3 is High (cut-point at 3)', () => {
    const r = run({ ...base, hypertension: true, stroke: true, bleedingHistory: true });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/high/i);
    expect(r.riskCategory).not.toMatch(/very high/i);
  });

  it('a score of exactly 5 is Very High (cut-point at 5)', () => {
    const r = run({
      ...base,
      hypertension: true,
      stroke: true,
      bleedingHistory: true,
      labileINR: true,
      alcoholUse: true,
    });
    expect(r.score).toBe(5);
    expect(r.riskCategory).toMatch(/very high/i);
  });
});

describe('HAS-BLED rejection', () => {
  it('rejects a missing required field', () => {
    const { alcoholUse, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed boolean field', () => {
    expect(() => run({ ...base, hypertension: 'yes' })).toThrow();
  });

  it('rejects a wrong-typed age field', () => {
    expect(() => run({ ...base, age: 'old' })).toThrow();
  });
});
