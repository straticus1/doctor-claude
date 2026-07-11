import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Modified Centor (McIsaac) score (McIsaac et al., CMAJ 1998; JAMA 2004):
//   +1 each for fever >38°C, tonsillar exudate, tender anterior cervical
//   nodes, and absence of cough. Age modifier: 3-14 → +1, 15-44 → 0,
//   ≥45 → -1.  Total score ranges from -1 to 5.
// A score of -1 or 0 is very low risk (no testing/antibiotics); the code's
// risk-guidance interpretation itself branches on `score <= 0`, confirming
// negative totals are expected and must NOT be clamped to 0.
const base = {
  fever: false,
  tonsillarExudate: false,
  tenderAnteriorNodes: false,
  noCough: false,
  age: 30, // middle band → +0
};

const allCriteria = {
  fever: true,
  tonsillarExudate: true,
  tenderAnteriorNodes: true,
  noCough: true,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'centor', inputs } as any);
}

describe('Centor (McIsaac) worked examples', () => {
  it('scores 5 for all four criteria + age 10 (child +1)', () => {
    const r = run({ ...allCriteria, age: 10 });
    expect(r.score).toBe(5);
    expect(r.maxScore).toBe(4);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('scores 3 for all four criteria + age 50 (adult -1)', () => {
    const r = run({ ...allCriteria, age: 50 });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('scores -1 for no criteria + age 50 (adult -1)', () => {
    const r = run({ ...base, age: 50 });
    expect(r.score).toBe(-1);
    expect(r.riskCategory).toMatch(/very low/i);
  });
});

describe('Centor (McIsaac) boundaries', () => {
  it('age 14 adds +1 but age 15 adds +0', () => {
    expect(run({ ...base, age: 14 }).score).toBe(1);
    expect(run({ ...base, age: 15 }).score).toBe(0);
  });

  it('age 44 adds +0 but age 45 subtracts 1', () => {
    expect(run({ ...base, age: 44 }).score).toBe(0);
    expect(run({ ...base, age: 45 }).score).toBe(-1);
  });

  it('age 3 adds +1 but age 2 adds +0 (below the young band)', () => {
    expect(run({ ...base, age: 3 }).score).toBe(1);
    expect(run({ ...base, age: 2 }).score).toBe(0);
  });
});

describe('Centor (McIsaac) rejection', () => {
  it('rejects a missing required field', () => {
    const { age, ...missing } = base;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...base, age: 'forty' })).toThrow();
  });
});
