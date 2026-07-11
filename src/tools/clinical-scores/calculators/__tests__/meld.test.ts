import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'meld', inputs } as any);
}

describe('MELD worked examples', () => {
  it('all-normal labs clamp to minimum score 6', () => {
    const r = run({ bilirubin: 1.0, inr: 1.0, creatinine: 1.0, dialysis: false });
    expect(r.score).toBe(6); // ln(1)=0 → 6.43 → rounds to 6
  });

  it('bilirubin 3.0, INR 1.5, creatinine 2.0 → 22', () => {
    // 3.78×ln(3) + 11.2×ln(1.5) + 9.57×ln(2) + 6.43 = 4.153+4.541+6.633+6.43 = 21.76 → 22
    const r = run({ bilirubin: 3.0, inr: 1.5, creatinine: 2.0, dialysis: false });
    expect(r.score).toBe(22);
  });

  it('extreme labs clamp to maximum 40', () => {
    const r = run({ bilirubin: 30, inr: 5, creatinine: 4, dialysis: false });
    expect(r.score).toBe(40);
  });
});

describe('MELD boundaries', () => {
  it('labs below 1.0 are floored at 1.0', () => {
    const low = run({ bilirubin: 0.5, inr: 0.8, creatinine: 0.6, dialysis: false });
    const floored = run({ bilirubin: 1.0, inr: 1.0, creatinine: 1.0, dialysis: false });
    expect(low.score).toBe(floored.score);
  });

  it('dialysis forces creatinine to 4.0', () => {
    const dialysis = run({ bilirubin: 2.0, inr: 1.5, creatinine: 1.0, dialysis: true });
    const cr4 = run({ bilirubin: 2.0, inr: 1.5, creatinine: 4.0, dialysis: false });
    expect(dialysis.score).toBe(cr4.score);
  });

  it('creatinine above 4.0 is capped at 4.0', () => {
    const high = run({ bilirubin: 2.0, inr: 1.5, creatinine: 6.0, dialysis: false });
    const capped = run({ bilirubin: 2.0, inr: 1.5, creatinine: 4.0, dialysis: false });
    expect(high.score).toBe(capped.score);
  });
});

describe('MELD rejection', () => {
  it('rejects zero/negative lab values (schema requires positive)', () => {
    expect(() => run({ bilirubin: 0, inr: 1.0, creatinine: 1.0, dialysis: false })).toThrow();
    expect(() => run({ bilirubin: 1.0, inr: -1, creatinine: 1.0, dialysis: false })).toThrow();
  });
});
