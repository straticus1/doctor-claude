import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// ABCD2 Score (Johnston et al., Lancet 2007): TIA stroke risk, total 0-7.
//  A - Age ≥60: 1
//  B - Blood pressure systolic ≥140 OR diastolic ≥90: 1
//  C - Clinical features: unilateral weakness 2 / speech impairment (no
//      weakness) 1 / neither 0
//  D - Duration: ≥60 min 2 / 10-59 min 1 / <10 min 0
//  D - Diabetes: 1
// Risk (first-match score < threshold): <4 Low, <6 Moderate, else High.
const base = {
  age: 50, // <60 → 0
  bloodPressure: { systolic: 120, diastolic: 80 }, // <140/90 → 0
  clinicalFeatures: 'neither', // 0
  duration: 'less_than_10', // 0
  diabetes: false, // 0
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'abcd2', inputs } as any);
}

describe('ABCD2 worked examples', () => {
  it('scores 0 for a minimal low-risk presentation → Low', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(7);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 7 for a maximal presentation → High', () => {
    const r = run({
      age: 70, // 1
      bloodPressure: { systolic: 150, diastolic: 95 }, // 1
      clinicalFeatures: 'unilateral_weakness', // 2
      duration: '60_or_more', // 2
      diabetes: true, // 1
    });
    expect(r.score).toBe(7);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('scores 4 (Moderate) for a mid-range presentation', () => {
    // age 70 (1) + speech_impairment (1) + 10_to_59 (1) + diabetes (1) = 4
    const r = run({
      age: 70,
      bloodPressure: { systolic: 120, diastolic: 80 },
      clinicalFeatures: 'speech_impairment',
      duration: '10_to_59',
      diabetes: true,
    });
    expect(r.score).toBe(4);
    expect(r.riskCategory).toMatch(/moderate/i);
  });
});

describe('ABCD2 boundaries', () => {
  it('age 60 scores the age point; age 59 does not', () => {
    expect(run({ ...base, age: 60 }).score).toBe(1);
    expect(run({ ...base, age: 59 }).score).toBe(0);
  });

  it('systolic 140 alone scores; systolic 139 does not', () => {
    expect(run({ ...base, bloodPressure: { systolic: 140, diastolic: 80 } }).score).toBe(1);
    expect(run({ ...base, bloodPressure: { systolic: 139, diastolic: 80 } }).score).toBe(0);
  });

  it('diastolic 90 alone scores; diastolic 89 does not', () => {
    expect(run({ ...base, bloodPressure: { systolic: 120, diastolic: 90 } }).score).toBe(1);
    expect(run({ ...base, bloodPressure: { systolic: 120, diastolic: 89 } }).score).toBe(0);
  });

  it('BP normal on both arms scores no BP point', () => {
    expect(run({ ...base, bloodPressure: { systolic: 139, diastolic: 89 } }).score).toBe(0);
  });

  it('clinical features: unilateral_weakness=2, speech_impairment=1, neither=0', () => {
    expect(run({ ...base, clinicalFeatures: 'unilateral_weakness' }).score).toBe(2);
    expect(run({ ...base, clinicalFeatures: 'speech_impairment' }).score).toBe(1);
    expect(run({ ...base, clinicalFeatures: 'neither' }).score).toBe(0);
  });

  it('duration: 60_or_more=2, 10_to_59=1, less_than_10=0', () => {
    expect(run({ ...base, duration: '60_or_more' }).score).toBe(2);
    expect(run({ ...base, duration: '10_to_59' }).score).toBe(1);
    expect(run({ ...base, duration: 'less_than_10' }).score).toBe(0);
  });

  it('category threshold: score 3 is Low, score 4 is Moderate', () => {
    // 3 = unilateral_weakness (2) + diabetes (1)
    const three = run({ ...base, clinicalFeatures: 'unilateral_weakness', diabetes: true });
    expect(three.score).toBe(3);
    expect(three.riskCategory).toMatch(/low/i);
    // 4 = unilateral_weakness (2) + duration 10_to_59 (1) + diabetes (1)
    const four = run({ ...base, clinicalFeatures: 'unilateral_weakness', duration: '10_to_59', diabetes: true });
    expect(four.score).toBe(4);
    expect(four.riskCategory).toMatch(/moderate/i);
  });

  it('category threshold: score 5 is Moderate, score 6 is High', () => {
    // 5 = age60 (1) + unilateral_weakness (2) + 10_to_59 (1) + diabetes (1)
    const five = run({ ...base, age: 60, clinicalFeatures: 'unilateral_weakness', duration: '10_to_59', diabetes: true });
    expect(five.score).toBe(5);
    expect(five.riskCategory).toMatch(/moderate/i);
    // 6 = age60 (1) + unilateral_weakness (2) + 60_or_more (2) + diabetes (1)
    const six = run({ ...base, age: 60, clinicalFeatures: 'unilateral_weakness', duration: '60_or_more', diabetes: true });
    expect(six.score).toBe(6);
    expect(six.riskCategory).toMatch(/high/i);
  });
});

describe('ABCD2 rejection', () => {
  it('rejects a missing field', () => {
    const { duration, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects an invalid enum value', () => {
    expect(() => run({ ...base, clinicalFeatures: 'headache' })).toThrow();
  });
});
