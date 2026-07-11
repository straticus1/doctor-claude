import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Glasgow-Blatchford Bleeding Score (Blatchford et al., Lancet 2000; MDCalc).
// Admission risk markers (max 23):
//   Blood urea (mmol/L):   6.5-7.9 → 2, 8.0-9.9 → 3, 10.0-24.9 → 4, ≥25 → 6
//     equivalently BUN mg/dL (×2.8): 18.2-<22.4 → 2, 22.4-<28 → 3, 28-<70 → 4, ≥70 → 6
//   Hemoglobin (g/dL) men:   12.0-12.9 → 1, 10.0-11.9 → 3, <10 → 6
//   Hemoglobin (g/dL) women: 10.0-11.9 → 1, <10 → 6
//   Systolic BP (mmHg): 100-109 → 1, 90-99 → 2, <90 → 3
//   Pulse ≥100 → 1, melena → 1, syncope → 2, hepatic disease → 2, cardiac failure → 2
//
// UNIT-HEURISTIC NOTE: the calculator feeds `bun` through convertUreaToBUN, which
// treats any value ≤ 40 as urea in mmol/L (×2.8) and any value > 40 as BUN in mg/dL
// (see utils.ts / UREA_MMOL_THRESHOLD = 40; the separate GLASGOW_UREA_MMOL_THRESHOLD=50
// constant is dead code and is NOT used). Because of this, mg/dL BUN values in the
// scored bands (18.2-70) are ≤40 and get mis-read as mmol/L, so the bands cannot be
// exercised with raw mg/dL numbers. They ARE cleanly testable by supplying urea in
// mmol/L (unambiguous, since a urea of e.g. 8 mmol/L is normal-range and a BUN of
// 8 mg/dL would be trivially low), and by supplying mg/dL values > 40. Both paths are
// used below and the intended unit is stated in each comment.

const base = {
  hemoglobin: 15, // male ≥13 → 0
  systolicBloodPressure: 120, // ≥110 → 0
  pulse: 80, // <100 → 0
  melena: false,
  syncope: false,
  hepaticDisease: false,
  cardiacFailure: false,
  sex: 'male' as const,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'glasgow_blatchford', inputs } as any);
}

describe('Glasgow-Blatchford worked examples', () => {
  it('scores 0 for a very-low-risk presentation', () => {
    // BUN 5 read as mmol/L → 14 mg/dL (<18.2). Also <18.2 even if read as mg/dL, so
    // 0 points under either unit interpretation. Everything else at its 0-point value.
    const r = run({ ...base, bun: 5 });
    expect(r.score).toBe(0);
    expect(r.riskCategory).toMatch(/very low/i);
  });

  it('scores the maximum 23 by summing every band (worked example)', () => {
    // BUN 80 mg/dL (>40 → read as mg/dL, ≥70) = 6
    // Hgb 9 (male <10)                        = 6
    // SBP 85 (<90)                            = 3
    // Pulse 110 (≥100)                        = 1
    // Melena                                  = 1
    // Syncope                                 = 2
    // Hepatic disease                         = 2
    // Cardiac failure                         = 2   -> total 23 (max)
    const r = run({
      bun: 80,
      hemoglobin: 9,
      systolicBloodPressure: 85,
      pulse: 110,
      melena: true,
      syncope: true,
      hepaticDisease: true,
      cardiacFailure: true,
      sex: 'male',
    });
    expect(r.score).toBe(23);
    expect(r.maxScore).toBe(23);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('scores 8 (High Risk) for severe anemia with hypotension', () => {
    // Hgb 9 male (<10) = 6, SBP 95 (90-99) = 2 -> 8
    const r = run({ ...base, hemoglobin: 9, systolicBloodPressure: 95 });
    expect(r.score).toBe(8);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('Glasgow-Blatchford BUN bands', () => {
  // Exercised with urea in mmol/L (≤40, unambiguously mmol/L) so the whole scored
  // range is reachable. Expected points are the published mmol/L bands above.
  it('urea 6 mmol/L (BUN 16.8) → 0', () => {
    expect(run({ ...base, bun: 6 }).score).toBe(0);
  });
  it('urea 7 mmol/L (BUN 19.6, 6.5-7.9 band) → 2', () => {
    expect(run({ ...base, bun: 7 }).score).toBe(2);
  });
  it('urea 8 mmol/L (BUN 22.4, 8.0-9.9 band) → 3', () => {
    expect(run({ ...base, bun: 8 }).score).toBe(3);
  });
  it('urea 10 mmol/L (BUN 28, 10.0-24.9 band) → 4', () => {
    expect(run({ ...base, bun: 10 }).score).toBe(4);
  });
  it('urea 30 mmol/L (BUN 84, ≥25 band) → 6', () => {
    expect(run({ ...base, bun: 30 }).score).toBe(6);
  });
  it('BUN 45 mg/dL (>40, read as mg/dL; 28-<70 band) → 4', () => {
    expect(run({ ...base, bun: 45 }).score).toBe(4);
  });
  it('BUN 80 mg/dL (≥70 band) → 6', () => {
    expect(run({ ...base, bun: 80 }).score).toBe(6);
  });
  it('omitted BUN contributes nothing (field is optional)', () => {
    expect(run(base).score).toBe(0);
  });
});

describe('Glasgow-Blatchford hemoglobin bands (sex-dependent)', () => {
  // Male: ≥13 → 0, 12.0-12.9 → 1, 10.0-11.9 → 3, <10 → 6
  it('male Hgb 13.0 → 0, 12.9 → 1', () => {
    expect(run({ ...base, hemoglobin: 13.0 }).score).toBe(0);
    expect(run({ ...base, hemoglobin: 12.9 }).score).toBe(1);
  });
  it('male Hgb 12.0 → 1, 11.9 → 3', () => {
    expect(run({ ...base, hemoglobin: 12.0 }).score).toBe(1);
    expect(run({ ...base, hemoglobin: 11.9 }).score).toBe(3);
  });
  it('male Hgb 10.0 → 3, 9.9 → 6', () => {
    expect(run({ ...base, hemoglobin: 10.0 }).score).toBe(3);
    expect(run({ ...base, hemoglobin: 9.9 }).score).toBe(6);
  });

  // Female: ≥12 → 0, 10.0-11.9 → 1, <10 → 6 (no 12-12.9 → 1 band unlike men)
  it('female Hgb 12.0 → 0, 11.9 → 1', () => {
    expect(run({ ...base, sex: 'female', hemoglobin: 12.0 }).score).toBe(0);
    expect(run({ ...base, sex: 'female', hemoglobin: 11.9 }).score).toBe(1);
  });
  it('female Hgb 10.0 → 1, 9.9 → 6', () => {
    expect(run({ ...base, sex: 'female', hemoglobin: 10.0 }).score).toBe(1);
    expect(run({ ...base, sex: 'female', hemoglobin: 9.9 }).score).toBe(6);
  });
  it('female Hgb 12.5 → 0 where the same value scores 1 for a male', () => {
    expect(run({ ...base, sex: 'female', hemoglobin: 12.5 }).score).toBe(0);
    expect(run({ ...base, sex: 'male', hemoglobin: 12.5 }).score).toBe(1);
  });
});

describe('Glasgow-Blatchford systolic BP bands', () => {
  it('SBP 110 → 0, 109 → 1', () => {
    expect(run({ ...base, systolicBloodPressure: 110 }).score).toBe(0);
    expect(run({ ...base, systolicBloodPressure: 109 }).score).toBe(1);
  });
  it('SBP 100 → 1, 99 → 2', () => {
    expect(run({ ...base, systolicBloodPressure: 100 }).score).toBe(1);
    expect(run({ ...base, systolicBloodPressure: 99 }).score).toBe(2);
  });
  it('SBP 90 → 2, 89 → 3', () => {
    expect(run({ ...base, systolicBloodPressure: 90 }).score).toBe(2);
    expect(run({ ...base, systolicBloodPressure: 89 }).score).toBe(3);
  });
});

describe('Glasgow-Blatchford pulse and history flags', () => {
  it('pulse 100 → 1, 99 → 0', () => {
    expect(run({ ...base, pulse: 100 }).score).toBe(1);
    expect(run({ ...base, pulse: 99 }).score).toBe(0);
  });
  it('melena +1, syncope +2, hepatic +2, cardiac +2 individually', () => {
    expect(run({ ...base, melena: true }).score).toBe(1);
    expect(run({ ...base, syncope: true }).score).toBe(2);
    expect(run({ ...base, hepaticDisease: true }).score).toBe(2);
    expect(run({ ...base, cardiacFailure: true }).score).toBe(2);
  });
});

describe('Glasgow-Blatchford rejection', () => {
  it('rejects missing required hemoglobin', () => {
    const { hemoglobin, ...noHgb } = base;
    expect(() => run(noHgb)).toThrow();
  });
  it('rejects wrong-typed input', () => {
    expect(() => run({ ...base, hemoglobin: 'low' })).toThrow();
  });
});
