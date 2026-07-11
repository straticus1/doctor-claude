import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// GRACE ACS risk score — point table (as implemented in grace.ts; the module's
// own banding is the source of truth for these expectations):
//   Age:        ≤39=0, 40–49=18, 50–59=36, 60–69=55, 70–79=73, ≥80=91
//   Heart rate: ≤69=0, 70–89=7, 90–109=13, 110–149=23, 150–199=36, ≥200=46
//   Systolic BP:≤99=43, 100–119=34, 120–139=24, 140–159=15, 160–199=7, ≥200=0
//   Creatinine: ≤0.39=2, 0.40–0.79=5, 0.80–1.19=8, 1.20–1.59=11, 1.60–1.99=14,
//               2.00–3.99=23, ≥4.00=31
//   Killip:     1=0, 2=21, 3=43, 4=64
//   Cardiac arrest=+43, ST deviation=+30, elevated markers=+15
// Risk categories: <109 Low, 109–140 Intermediate, ≥141 High.
function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'grace', inputs } as any);
}

const lowRisk = {
  age: 30,               // ≤39 → 0
  heartRate: 60,         // ≤69 → 0
  systolicBloodPressure: 150, // 140–159 → 15
  creatinine: 0.9,       // 0.80–1.19 → 8
  killipClass: 1,        // → 0
  cardiacArrest: false,
  stDeviation: false,
  elevatedCardiacMarkers: false,
};

const highRisk = {
  age: 85,               // ≥80 → 91
  heartRate: 130,        // 110–149 → 23
  systolicBloodPressure: 90, // ≤99 → 43
  creatinine: 3.0,       // 2.00–3.99 → 23
  killipClass: 4,        // → 64
  cardiacArrest: true,   // +43
  stDeviation: true,     // +30
  elevatedCardiacMarkers: true, // +15
};

describe('GRACE worked examples', () => {
  it('scores a clearly-low-risk young patient as Low', () => {
    // 0 + 0 + 15 + 8 + 0 = 23
    const r = run(lowRisk);
    expect(r.score).toBe(23);
    expect(r.maxScore).toBe(372);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('scores a clearly-high-risk elderly arrest patient as High', () => {
    // 91 + 23 + 43 + 23 + 64 + 43 + 30 + 15 = 332
    const r = run(highRisk);
    expect(r.score).toBe(332);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('GRACE boundaries', () => {
  it('crosses from Low to Intermediate at 109', () => {
    // Age 60–69 (55) + HR 90–109 (13) + SBP 140–159 (15) + creat 0.8–1.19 (8)
    //   + Killip 2 (21) = 112 → Intermediate
    const intermediate = run({
      age: 65,
      heartRate: 100,
      systolicBloodPressure: 150,
      creatinine: 0.9,
      killipClass: 2,
      cardiacArrest: false,
      stDeviation: false,
      elevatedCardiacMarkers: false,
    });
    expect(intermediate.score).toBe(112);
    expect(intermediate.riskCategory).toMatch(/intermediate/i);
  });

  it('scores an intermediate-band patient (109–140) as Intermediate', () => {
    // Age 60–69 (55) + HR 90–109 (13) + SBP 140–159 (15) + creat 0.8–1.19 (8)
    //   + Killip 1 (0) + ST deviation (30) = 121
    const r = run({
      age: 65,
      heartRate: 100,
      systolicBloodPressure: 150,
      creatinine: 0.9,
      killipClass: 1,
      cardiacArrest: false,
      stDeviation: true,
      elevatedCardiacMarkers: false,
    });
    expect(r.score).toBe(121);
    expect(r.riskCategory).toMatch(/intermediate/i);
  });
});

describe('GRACE rejection', () => {
  it('rejects Killip class 0 (below schema minimum of 1)', () => {
    expect(() => run({ ...lowRisk, killipClass: 0 })).toThrow();
  });

  it('rejects Killip class 5 (above schema maximum of 4)', () => {
    expect(() => run({ ...lowRisk, killipClass: 5 })).toThrow();
  });

  it('rejects a non-positive creatinine', () => {
    expect(() => run({ ...lowRisk, creatinine: 0 })).toThrow();
    expect(() => run({ ...lowRisk, creatinine: -1 })).toThrow();
  });

  it('rejects a missing required field', () => {
    const { age, ...missing } = lowRisk;
    expect(() => run(missing)).toThrow();
  });
});
