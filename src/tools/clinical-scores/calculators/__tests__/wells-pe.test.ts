import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Wells PE score (Wells et al., Thromb Haemost 2000): weighted criteria —
//   clinical signs of DVT 3, PE most likely diagnosis 3,
//   heart rate >100 1.5, immobilization/surgery 1.5, previous PE/DVT 1.5,
//   hemoptysis 1, malignancy 1.  Max 12.5.
// Three-tier risk: <2 Low (~2%), 2 to 6 Moderate, >6 High (so 6.5 is High).
const allFalse = {
  clinicalDVTSigns: false,
  peIsLikelyDiagnosis: false,
  heartRateOver100: false,
  immobilizationOrSurgery: false,
  previousPEorDVT: false,
  hemoptysis: false,
  malignancy: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'wells_pe', inputs } as any);
}

describe('Wells PE worked examples', () => {
  it('scores 0 (Low) when no criteria are present', () => {
    const r = run(allFalse);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(12.5);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 6 (Moderate) for clinical DVT signs + PE most likely diagnosis', () => {
    const r = run({ ...allFalse, clinicalDVTSigns: true, peIsLikelyDiagnosis: true });
    expect(r.score).toBe(6);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('scores 6.5 as High (published cutoff is High >6; 6.5 must not be Moderate)', () => {
    // 3 (clinical DVT signs) + 1.5 (HR>100) + 1 (hemoptysis) + 1 (malignancy) = 6.5
    const r = run({ ...allFalse, clinicalDVTSigns: true, heartRateOver100: true, hemoptysis: true, malignancy: true });
    expect(r.score).toBeCloseTo(6.5, 5);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('scores the maximum 12.5 when every criterion is present', () => {
    const r = run({
      clinicalDVTSigns: true,
      peIsLikelyDiagnosis: true,
      heartRateOver100: true,
      immobilizationOrSurgery: true,
      previousPEorDVT: true,
      hemoptysis: true,
      malignancy: true,
    });
    expect(r.score).toBeCloseTo(12.5, 5);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('Wells PE boundaries', () => {
  it('two 1.5-point items sum to exactly 3.0', () => {
    const r = run({ ...allFalse, heartRateOver100: true, immobilizationOrSurgery: true });
    expect(r.score).toBeCloseTo(3.0, 5);
    expect(r.riskCategory).toMatch(/moderate/i); // 3 is in [2,7)
  });

  it('two 1-point items sum to exactly 2.0 (cut-point at 2, Moderate)', () => {
    const r = run({ ...allFalse, hemoptysis: true, malignancy: true });
    expect(r.score).toBeCloseTo(2.0, 5);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('a single 1.5-point item scores Low (below the cut-point at 2)', () => {
    const r = run({ ...allFalse, heartRateOver100: true });
    expect(r.score).toBeCloseTo(1.5, 5);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('a single 3-point item is Moderate; two are High (cut-point at 7 requires more)', () => {
    expect(run({ ...allFalse, clinicalDVTSigns: true }).riskCategory).toMatch(/moderate/i); // 3
    // 3 + 3 + 1.5 = 7.5 → High
    const r = run({ ...allFalse, clinicalDVTSigns: true, peIsLikelyDiagnosis: true, heartRateOver100: true });
    expect(r.score).toBeCloseTo(7.5, 5);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('Wells PE rejection', () => {
  it('rejects a missing required field', () => {
    const { malignancy, ...missing } = allFalse;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...allFalse, heartRateOver100: 'tachycardic' })).toThrow();
  });
});
