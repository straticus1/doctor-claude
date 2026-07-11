import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// CURB-65 (Lim et al., Thorax 2003): confusion, BUN >19 mg/dL (urea >7 mmol/L),
// RR ≥30, SBP <90 or DBP ≤60, age ≥65 — 1 point each.
//
// The urea value carries an explicit `ureaUnit` ('mg/dL' for US BUN, 'mmol/L' for
// international urea). The calculator never infers the unit from the magnitude, so
// both unit paths are exercised directly at the published cut-points below.
const base = {
  confusion: false,
  urea: 5,
  ureaUnit: 'mmol/L' as const, // 5 mmol/L ≈ BUN 14 mg/dL, below the >19 threshold
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

  it('scores 5 for a maximal presentation', () => {
    const r = run({
      confusion: true,
      urea: 25,
      ureaUnit: 'mmol/L', // 25 mmol/L ≈ BUN 70 mg/dL, well above threshold
      respiratoryRate: 32,
      bloodPressure: { systolic: 85, diastolic: 55 },
      age: 80,
    });
    expect(r.score).toBe(5);
    expect(r.maxScore).toBe(5);
    expect(r.riskCategory).toMatch(/high|severe/i);
  });

  it('scores 2 for elderly patient with elevated urea only', () => {
    const r = run({ ...base, age: 70, urea: 24, ureaUnit: 'mmol/L' });
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

  it('BUN in mg/dL: 20 scores (>19); 19 does not', () => {
    expect(run({ ...base, urea: 20, ureaUnit: 'mg/dL' }).score).toBe(1);
    expect(run({ ...base, urea: 19, ureaUnit: 'mg/dL' }).score).toBe(0);
  });

  it('urea in mmol/L: 8 (≈BUN 22.4) scores; 6 (≈BUN 16.8) does not', () => {
    expect(run({ ...base, urea: 8, ureaUnit: 'mmol/L' }).score).toBe(1);
    expect(run({ ...base, urea: 6, ureaUnit: 'mmol/L' }).score).toBe(0);
  });

  it('the SAME numeric value scores differently by unit (the bug this guards against)', () => {
    // 15 as US BUN mg/dL is normal (no point); 15 as mmol/L urea ≈ BUN 42 (scores).
    expect(run({ ...base, urea: 15, ureaUnit: 'mg/dL' }).score).toBe(0);
    expect(run({ ...base, urea: 15, ureaUnit: 'mmol/L' }).score).toBe(1);
  });

  it('omitted urea contributes nothing rather than guessing', () => {
    const { urea, ureaUnit, ...noUrea } = base;
    expect(run(noUrea).score).toBe(0);
  });
});

describe('CURB-65 rejection', () => {
  it('rejects urea provided without a unit (fails closed, never guesses)', () => {
    const { ureaUnit, ...noUnit } = base;
    expect(() => run({ ...noUnit, urea: 20 })).toThrow();
  });

  it('rejects an invalid urea unit', () => {
    expect(() => run({ ...base, urea: 20, ureaUnit: 'mg/L' })).toThrow();
  });

  it('rejects missing required field', () => {
    const { age, ...missingAge } = base;
    expect(() => run(missingAge)).toThrow();
  });

  it('rejects wrong-typed input', () => {
    expect(() => run({ ...base, respiratoryRate: 'fast' })).toThrow();
  });
});
