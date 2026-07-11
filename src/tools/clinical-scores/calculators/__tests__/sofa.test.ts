import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// SOFA — Sequential Organ Failure Assessment (Vincent et al., Intensive Care Med 1996).
// Six organ systems, each 0-4, max 24. Published banding:
//   Respiration (PaO2/FiO2 mmHg): ≥400 → 0, <400 → 1, <300 → 2,
//     <200 with respiratory support → 3, <100 with respiratory support → 4
//   Coagulation (platelets ×10³/µL): ≥150 → 0, <150 → 1, <100 → 2, <50 → 3, <20 → 4
//   Liver (bilirubin mg/dL): <1.2 → 0, 1.2-1.9 → 1, 2.0-5.9 → 2, 6.0-11.9 → 3, ≥12 → 4
//   Cardiovascular: MAP ≥70 & no pressors → 0, MAP <70 → 1,
//     dopamine ≤5 or dobutamine → 2, dopamine >5-15 → 3, dopamine >15 or epi/norepi → 4
//   CNS (GCS): 15 → 0, 13-14 → 1, 10-12 → 2, 6-9 → 3, <6 → 4
//   Renal (creatinine mg/dL): <1.2 → 0, 1.2-1.9 → 1, 2.0-3.4 → 2, 3.5-4.9 → 3, ≥5 → 4
//     urine output override: <500 mL/day → 3, <200 mL/day → 4
//
// Strategy: hold every organ at its 0-point baseline and sweep one at a time.
// FiO2 is accepted as a decimal (0.21-1.0) or a percentage (21-100); normalizeFiO2
// divides values >1 by 100. Baseline PaO2/FiO2 = 100/0.21 ≈ 476 (≥400 → 0).

const base = {
  pao2: 100,
  fio2: 0.21, // ratio ≈ 476 → 0
  mechanicalVentilation: false,
  platelets: 200, // ≥150 → 0
  bilirubin: 0.5, // <1.2 → 0
  meanArterialPressure: 80, // ≥70, no pressors → 0
  vasopressors: 'none' as const,
  glasgowComaScale: 15, // → 0
  creatinine: 0.8, // <1.2 → 0
  // urineOutput omitted (optional)
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'sofa', inputs } as any);
}

describe('SOFA baseline', () => {
  it('all-normal organ values score 0 (Low Risk)', () => {
    const r = run(base);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(24);
    expect(r.riskCategory).toMatch(/low/i);
  });
});

describe('SOFA respiration (PaO2/FiO2)', () => {
  it('ratio ≥400 → 0', () => {
    // 400/1.0 = 400
    expect(run({ ...base, pao2: 400, fio2: 1.0 }).score).toBe(0);
  });
  it('ratio <400 (350) → 1', () => {
    expect(run({ ...base, pao2: 350, fio2: 1.0 }).score).toBe(1);
  });
  it('ratio <300 (250) → 2', () => {
    expect(run({ ...base, pao2: 250, fio2: 1.0 }).score).toBe(2);
  });
  it('ratio <200 with mechanical ventilation → 3', () => {
    expect(run({ ...base, pao2: 150, fio2: 1.0, mechanicalVentilation: true }).score).toBe(3);
  });
  it('ratio <200 without ventilation → 2 (support required for 3)', () => {
    expect(run({ ...base, pao2: 150, fio2: 1.0, mechanicalVentilation: false }).score).toBe(2);
  });
  it('ratio <100 with mechanical ventilation → 4', () => {
    expect(run({ ...base, pao2: 90, fio2: 1.0, mechanicalVentilation: true }).score).toBe(4);
  });
  it('ratio <100 WITHOUT ventilation → 2, not 4 (scores 3 and 4 require support)', () => {
    // Regression: a profoundly hypoxic but non-ventilated patient caps at 2,
    // because SOFA respiration scores 3 and 4 both require respiratory support.
    expect(run({ ...base, pao2: 90, fio2: 1.0, mechanicalVentilation: false }).score).toBe(2);
  });
  it('FiO2 given as a percentage (50) matches the decimal form (0.5)', () => {
    // 100/0.5 = 200 → not <200, <300 → 2, identical whether FiO2 is 50 or 0.5
    const pct = run({ ...base, pao2: 100, fio2: 50 }).score;
    const dec = run({ ...base, pao2: 100, fio2: 0.5 }).score;
    expect(pct).toBe(2);
    expect(dec).toBe(2);
  });
});

describe('SOFA coagulation (platelets ×10³)', () => {
  it('150 → 0, 149 → 1', () => {
    expect(run({ ...base, platelets: 150 }).score).toBe(0);
    expect(run({ ...base, platelets: 149 }).score).toBe(1);
  });
  it('100 → 1, 99 → 2', () => {
    expect(run({ ...base, platelets: 100 }).score).toBe(1);
    expect(run({ ...base, platelets: 99 }).score).toBe(2);
  });
  it('50 → 2, 49 → 3', () => {
    expect(run({ ...base, platelets: 50 }).score).toBe(2);
    expect(run({ ...base, platelets: 49 }).score).toBe(3);
  });
  it('20 → 3, 19 → 4', () => {
    expect(run({ ...base, platelets: 20 }).score).toBe(3);
    expect(run({ ...base, platelets: 19 }).score).toBe(4);
  });
});

describe('SOFA liver (bilirubin mg/dL)', () => {
  it('1.1 → 0, 1.2 → 1', () => {
    expect(run({ ...base, bilirubin: 1.1 }).score).toBe(0);
    expect(run({ ...base, bilirubin: 1.2 }).score).toBe(1);
  });
  it('1.9 → 1, 2.0 → 2', () => {
    expect(run({ ...base, bilirubin: 1.9 }).score).toBe(1);
    expect(run({ ...base, bilirubin: 2.0 }).score).toBe(2);
  });
  it('5.9 → 2, 6.0 → 3', () => {
    expect(run({ ...base, bilirubin: 5.9 }).score).toBe(2);
    expect(run({ ...base, bilirubin: 6.0 }).score).toBe(3);
  });
  it('11.9 → 3, 12.0 → 4', () => {
    expect(run({ ...base, bilirubin: 11.9 }).score).toBe(3);
    expect(run({ ...base, bilirubin: 12.0 }).score).toBe(4);
  });
});

describe('SOFA cardiovascular', () => {
  it('MAP ≥70, no pressors → 0', () => {
    expect(run({ ...base, meanArterialPressure: 70, vasopressors: 'none' }).score).toBe(0);
  });
  it('MAP <70 (69), no pressors → 1', () => {
    expect(run({ ...base, meanArterialPressure: 69, vasopressors: 'none' }).score).toBe(1);
  });
  it('dopamine_low → 2', () => {
    expect(run({ ...base, vasopressors: 'dopamine_low' }).score).toBe(2);
  });
  it('dopamine >5-15 OR low-dose epi/norepi (≤0.1) → 3', () => {
    expect(run({ ...base, vasopressors: 'dopamine_medium_or_epi_norepi_low' }).score).toBe(3);
  });
  it('dopamine >15 OR high-dose epi/norepi (>0.1) → 4', () => {
    expect(run({ ...base, vasopressors: 'dopamine_high_or_epi_norepi_high' }).score).toBe(4);
  });
  it('vasopressors take priority over MAP (pressor present, MAP normal)', () => {
    expect(run({ ...base, meanArterialPressure: 80, vasopressors: 'dopamine_high_or_epi_norepi_high' }).score).toBe(4);
  });
});

describe('SOFA CNS (Glasgow Coma Scale)', () => {
  it('15 → 0, 14 → 1', () => {
    expect(run({ ...base, glasgowComaScale: 15 }).score).toBe(0);
    expect(run({ ...base, glasgowComaScale: 14 }).score).toBe(1);
  });
  it('13 → 1, 12 → 2', () => {
    expect(run({ ...base, glasgowComaScale: 13 }).score).toBe(1);
    expect(run({ ...base, glasgowComaScale: 12 }).score).toBe(2);
  });
  it('10 → 2, 9 → 3', () => {
    expect(run({ ...base, glasgowComaScale: 10 }).score).toBe(2);
    expect(run({ ...base, glasgowComaScale: 9 }).score).toBe(3);
  });
  it('6 → 3, 5 → 4', () => {
    expect(run({ ...base, glasgowComaScale: 6 }).score).toBe(3);
    expect(run({ ...base, glasgowComaScale: 5 }).score).toBe(4);
  });
});

describe('SOFA renal (creatinine + urine output)', () => {
  it('creatinine 1.1 → 0, 1.2 → 1', () => {
    expect(run({ ...base, creatinine: 1.1 }).score).toBe(0);
    expect(run({ ...base, creatinine: 1.2 }).score).toBe(1);
  });
  it('creatinine 2.0 → 2', () => {
    expect(run({ ...base, creatinine: 2.0 }).score).toBe(2);
  });
  it('creatinine 3.5 → 3', () => {
    expect(run({ ...base, creatinine: 3.5 }).score).toBe(3);
  });
  it('creatinine 5.0 → 4', () => {
    expect(run({ ...base, creatinine: 5.0 }).score).toBe(4);
  });
  it('urine output <500 overrides normal creatinine → 3', () => {
    expect(run({ ...base, creatinine: 0.8, urineOutput: 400 }).score).toBe(3);
  });
  it('urine output <200 overrides normal creatinine → 4', () => {
    expect(run({ ...base, creatinine: 0.8, urineOutput: 150 }).score).toBe(4);
  });
  it('urine output ≥500 does not override (500 → 0 with normal creatinine)', () => {
    expect(run({ ...base, creatinine: 0.8, urineOutput: 500 }).score).toBe(0);
  });
});

describe('SOFA full worked example', () => {
  it('sums six organs to a known total of 10 (High Risk)', () => {
    // Respiration 250/1.0 = 250 (<300)      = 2
    // Coagulation platelets 99 (<100)       = 2
    // Liver bilirubin 2.0 (2.0-5.9)         = 2
    // Cardiovascular MAP 69, no pressors    = 1
    // CNS GCS 13 (13-14)                    = 1
    // Renal creatinine 2.0 (2.0-3.4)        = 2   -> total 10
    const r = run({
      pao2: 250,
      fio2: 1.0,
      mechanicalVentilation: false,
      platelets: 99,
      bilirubin: 2.0,
      meanArterialPressure: 69,
      vasopressors: 'none',
      glasgowComaScale: 13,
      creatinine: 2.0,
    });
    expect(r.score).toBe(10);
    expect(r.riskCategory).toMatch(/high/i);
  });
});

describe('SOFA rejection', () => {
  it('rejects Glasgow Coma Scale below the schema minimum of 3', () => {
    expect(() => run({ ...base, glasgowComaScale: 2 })).toThrow();
  });
  it('rejects Glasgow Coma Scale above the schema maximum of 15', () => {
    expect(() => run({ ...base, glasgowComaScale: 16 })).toThrow();
  });
  it('rejects missing required platelets', () => {
    const { platelets, ...noPlatelets } = base;
    expect(() => run(noPlatelets)).toThrow();
  });
  it('rejects wrong-typed input', () => {
    expect(() => run({ ...base, bilirubin: 'high' })).toThrow();
  });
});
