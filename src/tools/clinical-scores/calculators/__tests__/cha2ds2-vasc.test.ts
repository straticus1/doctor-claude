import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// CHA2DS2-VASc (Lip et al., Chest 2010), max 9:
//   Congestive heart failure 1, Hypertension 1, Age ≥75=2 / 65–74=1,
//   Diabetes 1, prior Stroke/TIA/thromboembolism 2, Vascular disease 1,
//   Sex category female 1.
// Risk categories (per guidance.ts, first threshold with score < threshold):
//   0 Very Low, 1 Low, 2 Low-Moderate, 3–4 Moderate, 5–6 Moderate-High, 7–9 High.
const base = {
  congestiveHeartFailure: false,
  hypertension: false,
  age: 50,
  diabetes: false,
  strokeTIAThrombus: false,
  vascularDisease: false,
  sex: 'male',
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'cha2ds2_vasc', inputs } as any);
}

describe('CHA2DS2-VASc worked examples', () => {
  it('scores 0 (Very Low) for a young man with no risk factors', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(9);
    expect(r.riskCategory).toMatch(/very low/i);
  });

  it('scores the maximum 9 (High) for a 76yo woman with all comorbidities', () => {
    // age≥75(2) + CHF(1) + HTN(1) + diabetes(1) + stroke(2) + vascular(1) + female(1) = 9
    const r = run({
      congestiveHeartFailure: true,
      hypertension: true,
      age: 76,
      diabetes: true,
      strokeTIAThrombus: true,
      vascularDisease: true,
      sex: 'female',
    });
    expect(r.score).toBe(9);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('CHA2DS2-VASc boundaries', () => {
  it('age 65 scores +1; age 64 scores +0', () => {
    expect(run({ ...base, age: 65 }).score).toBe(1);
    expect(run({ ...base, age: 64 }).score).toBe(0);
  });

  it('age 75 scores +2; age 74 scores +1', () => {
    expect(run({ ...base, age: 75 }).score).toBe(2);
    expect(run({ ...base, age: 74 }).score).toBe(1);
  });

  it('prior stroke/TIA/thromboembolism scores +2', () => {
    expect(run({ ...base, strokeTIAThrombus: true }).score).toBe(2);
  });

  it('female sex adds +1 over an otherwise-identical male', () => {
    expect(run({ ...base, sex: 'female' }).score).toBe(1);
    expect(run({ ...base, sex: 'male' }).score).toBe(0);
  });
});

describe('CHA2DS2-VASc rejection', () => {
  it('rejects a missing required field', () => {
    const { sex, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects an out-of-enum sex value', () => {
    expect(() => run({ ...base, sex: 'other' })).toThrow();
  });

  it('rejects a wrong-typed boolean field', () => {
    expect(() => run({ ...base, diabetes: 'yes' })).toThrow();
  });
});
