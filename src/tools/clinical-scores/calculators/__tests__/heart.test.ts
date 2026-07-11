import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// HEART score (Six et al., Neth Heart J 2008; Backus et al., 2013), max 10:
//   History: highly_suspicious=2, moderately_suspicious=1, slightly_suspicious=0
//   ECG: significant_st_depression=2, nonspecific_changes=1, normal=0
//   Age: ≥65=2, 45–64=1, <45=0
//   Risk factors: ≥3=2, 1–2=1, 0=0
//   Troponin: high(≥3x)=2, moderate(1–3x)=1, normal=0
// Risk categories: 0–3 Low, 4–6 Moderate, 7–10 High.
const base = {
  history: 'slightly_suspicious',
  ecg: 'normal',
  age: 30,
  riskFactors: 0,
  troponin: 'normal',
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'heart', inputs } as any);
}

describe('HEART worked examples', () => {
  it('scores 0 (Low) when every component is at its lowest', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(10);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 4 (Moderate) for a mixed intermediate presentation', () => {
    // moderately_suspicious(1) + nonspecific ECG(1) + age 55(1) + 2 risk factors(1) + troponin normal(0) = 4
    const r = run({
      history: 'moderately_suspicious',
      ecg: 'nonspecific_changes',
      age: 55,
      riskFactors: 2,
      troponin: 'normal',
    });
    expect(r.score).toBe(4);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('scores the maximum 10 (High) when every component is at its highest', () => {
    // highly(2) + ST depression(2) + age≥65(2) + ≥3 risk factors(2) + troponin high(2) = 10
    const r = run({
      history: 'highly_suspicious',
      ecg: 'significant_st_depression',
      age: 70,
      riskFactors: 3,
      troponin: 'high',
    });
    expect(r.score).toBe(10);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('HEART boundaries', () => {
  it('age 45 scores +1; age 44 scores +0', () => {
    expect(run({ ...base, age: 45 }).score).toBe(1);
    expect(run({ ...base, age: 44 }).score).toBe(0);
  });

  it('age 65 scores +2; age 64 scores +1', () => {
    expect(run({ ...base, age: 65 }).score).toBe(2);
    expect(run({ ...base, age: 64 }).score).toBe(1);
  });

  it('1 risk factor scores +1; 0 risk factors scores +0', () => {
    expect(run({ ...base, riskFactors: 1 }).score).toBe(1);
    expect(run({ ...base, riskFactors: 0 }).score).toBe(0);
  });

  it('3 risk factors score +2; 2 risk factors score +1', () => {
    expect(run({ ...base, riskFactors: 3 }).score).toBe(2);
    expect(run({ ...base, riskFactors: 2 }).score).toBe(1);
  });

  it('a score of exactly 4 is Moderate and 3 is Low (cut-point at 4)', () => {
    // 3 = age≥65(2) + 1 risk factor(1); 4 = age≥65(2) + nonspecific ECG(1) + 1 risk factor(1)
    expect(run({ ...base, age: 70, riskFactors: 1 }).riskCategory).toMatch(/low/i);
    expect(run({ ...base, age: 70, ecg: 'nonspecific_changes', riskFactors: 1 }).riskCategory).toMatch(/moderate/i);
  });

  it('a score of exactly 7 is High and 6 is Moderate (cut-point at 7)', () => {
    // 6 = highly(2) + ST depression(2) + age≥65(2); 7 adds troponin moderate(1)
    expect(run({ ...base, history: 'highly_suspicious', ecg: 'significant_st_depression', age: 70 }).riskCategory).toMatch(/moderate/i);
    expect(run({ ...base, history: 'highly_suspicious', ecg: 'significant_st_depression', age: 70, troponin: 'moderate' }).riskCategory).toMatch(/high/i);
  });
});

describe('HEART rejection', () => {
  it('rejects a missing required field', () => {
    const { troponin, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects an out-of-enum history value', () => {
    expect(() => run({ ...base, history: 'very_suspicious' })).toThrow();
  });

  it('rejects a negative risk-factor count', () => {
    expect(() => run({ ...base, riskFactors: -1 })).toThrow();
  });
});
