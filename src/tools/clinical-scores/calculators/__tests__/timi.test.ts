import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// TIMI Risk Score for UA/NSTEMI (Antman et al., JAMA 2000), max 7.
// Seven predictors, 1 point each:
//   Age ≥65; ≥3 CAD risk factors; known CAD (stenosis ≥50%); aspirin use in past 7 days;
//   ≥2 anginal episodes in 24h; ST changes ≥0.5mm; elevated cardiac markers.
// (riskFactors is a COUNT 0–5; it scores 1 only when ≥3.)
// Risk categories: 0–1 Low, 2 Low-Intermediate, 3–4 Intermediate, 5–7 High.
const base = {
  age: 50,
  riskFactors: 0,
  knownCAD: false,
  aspirinUse: false,
  severeAngina: false,
  stChanges: false,
  elevatedCardiacMarkers: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'timi', inputs } as any);
}

describe('TIMI worked examples', () => {
  it('scores 0 (Low) when no predictor is present', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(7);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores the maximum 7 (High) when every predictor is present', () => {
    const r = run({
      age: 70,
      riskFactors: 3,
      knownCAD: true,
      aspirinUse: true,
      severeAngina: true,
      stChanges: true,
      elevatedCardiacMarkers: true,
    });
    expect(r.score).toBe(7);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('TIMI boundaries', () => {
  it('age 65 scores +1; age 64 scores +0', () => {
    expect(run({ ...base, age: 65 }).score).toBe(1);
    expect(run({ ...base, age: 64 }).score).toBe(0);
  });

  it('3 risk factors score +1; 2 risk factors score +0', () => {
    expect(run({ ...base, riskFactors: 3 }).score).toBe(1);
    expect(run({ ...base, riskFactors: 2 }).score).toBe(0);
  });

  it('a score of exactly 2 is Low-Intermediate (cut-point at 2)', () => {
    // knownCAD(1) + stChanges(1) = 2
    const r = run({ ...base, knownCAD: true, stChanges: true });
    expect(r.score).toBe(2);
    expect(r.riskCategory).toMatch(/low-intermediate/i);
  });

  it('a score of exactly 3 is Intermediate (cut-point at 3)', () => {
    // knownCAD(1) + stChanges(1) + elevatedCardiacMarkers(1) = 3
    const r = run({ ...base, knownCAD: true, stChanges: true, elevatedCardiacMarkers: true });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/intermediate/i);
    expect(r.riskCategory).not.toMatch(/low-intermediate/i);
  });

  it('a score of exactly 5 is High (cut-point at 5)', () => {
    // age≥65(1) + 3 risk factors(1) + knownCAD(1) + stChanges(1) + elevatedCardiacMarkers(1) = 5
    const r = run({
      ...base,
      age: 70,
      riskFactors: 3,
      knownCAD: true,
      stChanges: true,
      elevatedCardiacMarkers: true,
    });
    expect(r.score).toBe(5);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('TIMI rejection', () => {
  it('rejects a missing required field', () => {
    const { knownCAD, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a risk-factor count above the 0–5 range', () => {
    expect(() => run({ ...base, riskFactors: 6 })).toThrow();
  });

  it('rejects a wrong-typed boolean field', () => {
    expect(() => run({ ...base, aspirinUse: 'yes' })).toThrow();
  });
});
