import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// qSOFA (Singer et al., Sepsis-3, JAMA 2016): 1 point each for
// respiratory rate ≥22/min, altered mentation, and systolic BP ≤100 mmHg.
// Max 3. Score ≥2 identifies patients at high risk of poor outcome.
const base = {
  respiratoryRate: 18,
  alteredMentalStatus: false,
  systolicBloodPressure: 120,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'qsofa', inputs } as any);
}

describe('qSOFA worked examples', () => {
  it('scores 0 for an all-normal presentation (RR 18, SBP 120, no AMS)', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(3);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores 3 for RR 24 + SBP 90 + altered mental status', () => {
    const r = run({ respiratoryRate: 24, alteredMentalStatus: true, systolicBloodPressure: 90 });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('scores 2 (high risk) for RR 22 + AMS only', () => {
    const r = run({ ...base, respiratoryRate: 22, alteredMentalStatus: true });
    expect(r.score).toBe(2);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('qSOFA boundaries', () => {
  it('RR 22 scores the respiratory point; RR 21 does not', () => {
    expect(run({ ...base, respiratoryRate: 22 }).score).toBe(1);
    expect(run({ ...base, respiratoryRate: 21 }).score).toBe(0);
  });

  it('SBP 100 scores the hypotension point; SBP 101 does not', () => {
    expect(run({ ...base, systolicBloodPressure: 100 }).score).toBe(1);
    expect(run({ ...base, systolicBloodPressure: 101 }).score).toBe(0);
  });

  it('score <2 is Low risk, ≥2 is High risk', () => {
    expect(run({ ...base, respiratoryRate: 22 }).riskCategory).toMatch(/low/i); // score 1
    expect(run({ ...base, respiratoryRate: 22, systolicBloodPressure: 100 }).riskCategory).toMatch(/high/i); // score 2
  });
});

describe('qSOFA rejection', () => {
  it('rejects a missing required field', () => {
    const { systolicBloodPressure, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...base, respiratoryRate: 'fast' })).toThrow();
  });

  it('rejects a wrong-typed boolean field', () => {
    expect(() => run({ ...base, alteredMentalStatus: 'yes' })).toThrow();
  });
});
