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
// The urea value carries an explicit `bunUnit` ('mg/dL' or 'mmol/L'); the calculator
// never infers the unit. Both paths are tested at the published band edges below.

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
    // urea 5 mmol/L ≈ BUN 14 (<18.2) → 0; everything else at its 0-point value.
    const r = run({ ...base, bun: 5, bunUnit: 'mmol/L' });
    expect(r.score).toBe(0);
    expect(r.riskCategory).toMatch(/very low/i);
  });

  it('scores the maximum 23 by summing every band (worked example)', () => {
    // BUN 80 mg/dL (≥70) = 6; Hgb 9 male (<10) = 6; SBP 85 (<90) = 3; pulse 110 = 1;
    // melena 1; syncope 2; hepatic 2; cardiac 2  -> 23 (max)
    const r = run({
      bun: 80,
      bunUnit: 'mg/dL',
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
    const r = run({ ...base, hemoglobin: 9, systolicBloodPressure: 95 });
    expect(r.score).toBe(8);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('Glasgow-Blatchford BUN bands', () => {
  it('urea in mmol/L: 6→0, 7→2, 8→3, 10→4, 30→6', () => {
    expect(run({ ...base, bun: 6, bunUnit: 'mmol/L' }).score).toBe(0);  // BUN 16.8
    expect(run({ ...base, bun: 7, bunUnit: 'mmol/L' }).score).toBe(2);  // BUN 19.6
    expect(run({ ...base, bun: 8, bunUnit: 'mmol/L' }).score).toBe(3);  // BUN 22.4
    expect(run({ ...base, bun: 10, bunUnit: 'mmol/L' }).score).toBe(4); // BUN 28
    expect(run({ ...base, bun: 30, bunUnit: 'mmol/L' }).score).toBe(6); // BUN 84
  });

  it('BUN in mg/dL: 18.1→0, 18.2→2, 22.4→3, 28→4, 45→4, 70→6', () => {
    expect(run({ ...base, bun: 18.1, bunUnit: 'mg/dL' }).score).toBe(0);
    expect(run({ ...base, bun: 18.2, bunUnit: 'mg/dL' }).score).toBe(2);
    expect(run({ ...base, bun: 22.4, bunUnit: 'mg/dL' }).score).toBe(3);
    expect(run({ ...base, bun: 28, bunUnit: 'mg/dL' }).score).toBe(4);
    expect(run({ ...base, bun: 45, bunUnit: 'mg/dL' }).score).toBe(4);
    expect(run({ ...base, bun: 70, bunUnit: 'mg/dL' }).score).toBe(6);
  });

  it('the SAME numeric value scores differently by unit (the bug this guards against)', () => {
    // 20 as US BUN mg/dL → band 18.2-22.4 → 2; 20 as mmol/L urea ≈ BUN 56 → band 28-70 → 4.
    expect(run({ ...base, bun: 20, bunUnit: 'mg/dL' }).score).toBe(2);
    expect(run({ ...base, bun: 20, bunUnit: 'mmol/L' }).score).toBe(4);
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
  it('rejects bun provided without a unit (fails closed, never guesses)', () => {
    expect(() => run({ ...base, bun: 40 })).toThrow();
  });
  it('rejects an invalid bun unit', () => {
    expect(() => run({ ...base, bun: 40, bunUnit: 'mg/L' })).toThrow();
  });
  it('rejects missing required hemoglobin', () => {
    const { hemoglobin, ...noHgb } = base;
    expect(() => run(noHgb)).toThrow();
  });
  it('rejects wrong-typed input', () => {
    expect(() => run({ ...base, hemoglobin: 'low' })).toThrow();
  });
});
