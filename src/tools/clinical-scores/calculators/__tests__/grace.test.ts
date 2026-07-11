import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// GRACE 1.0 IN-HOSPITAL mortality nomogram (Granger CB et al., Arch Intern Med.
// 2003;163(19):2345-2353). Point tables (verified against the published
// Granger 2003 in-hospital nomogram):
//
//  Age (yr):    <30→0, 30–39→8, 40–49→25, 50–59→41, 60–69→58, 70–79→75,
//               80–89→91, ≥90→100
//  HR (bpm):    <50→0, 50–69→3, 70–89→9, 90–109→15, 110–149→24, 150–199→38,
//               ≥200→46
//  SBP (mmHg):  <80→58, 80–99→53, 100–119→43, 120–139→34, 140–159→24,
//               160–199→10, ≥200→0
//  Creat(mg/dL):0–0.39→1, 0.4–0.79→4, 0.8–1.19→7, 1.2–1.59→10, 1.6–1.99→13,
//               2.0–3.99→21, ≥4.0→28
//  Killip:      I→0, II→20, III→39, IV→59
//  Cardiac arrest at admission +39, ST-segment deviation +28,
//  Elevated cardiac markers +14
//
// Risk bands (in-hospital; getRiskGuidance first-matches score < threshold):
//   <109 Low, 109–140 Intermediate, >140 High.
// Max achievable = 100+46+58+28+59+39+28+14 = 372.

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'grace', inputs } as any);
}

describe('GRACE worked example', () => {
  it('hand-summed 65yo NSTEMI → 179, High', () => {
    // Age 65      → 60–69   → 58
    // HR 95       → 90–109  → 15
    // SBP 130     → 120–139 → 34
    // Creat 1.3   → 1.2–1.59→ 10
    // Killip II            → 20
    // cardiac arrest false → 0
    // ST deviation true    → 28
    // elevated markers true→ 14
    // Sum: 58+15+34+10+20+0+28+14 = 179
    const r = run({
      age: 65,
      heartRate: 95,
      systolicBloodPressure: 130,
      creatinine: 1.3,
      killipClass: 2,
      cardiacArrest: false,
      stDeviation: true,
      elevatedCardiacMarkers: true,
    });
    expect(r.score).toBe(179);
    expect(r.maxScore).toBe(372);
    expect(r.riskCategory).toMatch(/high/i);
  });

  it('reaches the published maximum of 372', () => {
    // Age ≥90 100 + HR ≥200 46 + SBP <80 58 + Creat ≥4 28 + Killip IV 59
    //   + arrest 39 + ST 28 + markers 14 = 372
    const r = run({
      age: 95,
      heartRate: 210,
      systolicBloodPressure: 70,
      creatinine: 5.0,
      killipClass: 4,
      cardiacArrest: true,
      stDeviation: true,
      elevatedCardiacMarkers: true,
    });
    expect(r.score).toBe(372);
    expect(r.maxScore).toBe(372);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('GRACE risk bands', () => {
  it('low-risk young stable patient → 69, Low (<109)', () => {
    // Age 45 → 25, HR 60 → 3, SBP 130 → 34, Creat 0.9 → 7, Killip I → 0
    // Sum: 25+3+34+7+0 = 69
    const r = run({
      age: 45,
      heartRate: 60,
      systolicBloodPressure: 130,
      creatinine: 0.9,
      killipClass: 1,
      cardiacArrest: false,
      stDeviation: false,
      elevatedCardiacMarkers: false,
    });
    expect(r.score).toBe(69);
    expect(r.riskCategory).toMatch(/low/i);
  });

  it('severe hypotension (SBP <80 → +58) drives a High score', () => {
    // Age 82 → 91, HR 130 → 24, SBP 70 → 58, Creat 2.5 → 21, Killip IV → 59,
    // arrest → 39, ST → 28, markers → 14. Sum: 91+24+58+21+59+39+28+14 = 334
    const r = run({
      age: 82,
      heartRate: 130,
      systolicBloodPressure: 70,
      creatinine: 2.5,
      killipClass: 4,
      cardiacArrest: true,
      stDeviation: true,
      elevatedCardiacMarkers: true,
    });
    expect(r.score).toBe(334);
    expect(r.riskCategory).toMatch(/high/i);
    // The SBP <80 bucket must contribute the full 58 (previously under-scored).
    expect(r.details).toContain('Systolic BP 70 mmHg: +58');
  });

  it('places the Intermediate band between 109 and 140', () => {
    // Age 70 → 75, HR 75 → 9, SBP 150 → 24, Creat 1.0 → 7, Killip I → 0
    // Sum: 75+9+24+7 = 115 → Intermediate
    const r = run({
      age: 70,
      heartRate: 75,
      systolicBloodPressure: 150,
      creatinine: 1.0,
      killipClass: 1,
      cardiacArrest: false,
      stDeviation: false,
      elevatedCardiacMarkers: false,
    });
    expect(r.score).toBe(115);
    expect(r.riskCategory).toMatch(/intermediate/i);
  });
});

describe('GRACE input validation', () => {
  const valid = {
    age: 65,
    heartRate: 80,
    systolicBloodPressure: 120,
    creatinine: 1.0,
    killipClass: 2,
    cardiacArrest: false,
    stDeviation: false,
    elevatedCardiacMarkers: false,
  };

  it('rejects Killip class 0 (below min of 1)', () => {
    expect(() => run({ ...valid, killipClass: 0 })).toThrow();
  });

  it('rejects Killip class 5 (above max of 4)', () => {
    expect(() => run({ ...valid, killipClass: 5 })).toThrow();
  });

  it('rejects creatinine of 0 (must be positive)', () => {
    expect(() => run({ ...valid, creatinine: 0 })).toThrow();
  });

  it('rejects negative creatinine', () => {
    expect(() => run({ ...valid, creatinine: -1 })).toThrow();
  });
});
