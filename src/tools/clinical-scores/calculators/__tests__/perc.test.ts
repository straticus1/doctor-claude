import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// PERC — Pulmonary Embolism Rule-out Criteria (Kline et al., J Thromb Haemost
// 2004/2008). Rule-out semantics: the score is the NUMBER of criteria PRESENT
// (0-8). All 8 absent (score 0) = PERC negative → PE effectively ruled out.
// Any criterion present (≥1) = PERC positive → cannot rule out, further testing.
// The 8 criteria: age ≥50, heart rate ≥100, SpO2 <95% on room air,
// unilateral leg swelling, hemoptysis, recent surgery/trauma (≤4wk),
// prior PE/DVT, hormone use.
// Guidance (first-match score < threshold): <1 → PE Ruled Out; ≥1 → Further Testing.
const negative = {
  age: 40, // <50 → 0
  heartRate: 80, // <100 → 0
  oxygenSaturation: 98, // ≥95 → 0
  unilateralLegSwelling: false,
  hemoptysis: false,
  recentSurgeryOrTrauma: false,
  priorPEorDVT: false,
  hormoneUse: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'perc', inputs } as any);
}

describe('PERC worked examples', () => {
  it('scores 0 when all criteria are absent → PE Ruled Out', () => {
    const r = run(negative);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(8);
    expect(r.riskCategory).toMatch(/ruled out/i);
  });

  it('scores 8 when all criteria are present → Further Testing', () => {
    const r = run({
      age: 60,
      heartRate: 110,
      oxygenSaturation: 92,
      unilateralLegSwelling: true,
      hemoptysis: true,
      recentSurgeryOrTrauma: true,
      priorPEorDVT: true,
      hormoneUse: true,
    });
    expect(r.score).toBe(8);
    expect(r.riskCategory).not.toMatch(/ruled out/i);
  });

  it('any single criterion present flips PERC positive (not ruled out)', () => {
    for (const key of [
      'unilateralLegSwelling',
      'hemoptysis',
      'recentSurgeryOrTrauma',
      'priorPEorDVT',
      'hormoneUse',
    ] as const) {
      const r = run({ ...negative, [key]: true });
      expect(r.score).toBe(1);
      expect(r.riskCategory).not.toMatch(/ruled out/i);
    }
  });
});

describe('PERC boundaries', () => {
  it('age 50 scores; age 49 does not', () => {
    expect(run({ ...negative, age: 50 }).score).toBe(1);
    expect(run({ ...negative, age: 49 }).score).toBe(0);
  });

  it('heart rate 100 scores; 99 does not', () => {
    expect(run({ ...negative, heartRate: 100 }).score).toBe(1);
    expect(run({ ...negative, heartRate: 99 }).score).toBe(0);
  });

  it('SpO2 94 scores (<95); SpO2 95 does not (threshold is strictly <95)', () => {
    expect(run({ ...negative, oxygenSaturation: 94 }).score).toBe(1);
    expect(run({ ...negative, oxygenSaturation: 95 }).score).toBe(0);
  });
});

describe('PERC rejection', () => {
  it('rejects a missing field', () => {
    const { hormoneUse, ...missing } = negative;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...negative, heartRate: 'fast' })).toThrow();
  });
});
