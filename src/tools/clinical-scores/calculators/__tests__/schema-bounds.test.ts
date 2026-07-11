import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Physiologic-plausibility guards (deliberately WIDE, not clinical judgments):
//   age .min(0).max(120), respiratoryRate .min(0).max(100),
//   systolic BP .min(0).max(300), diastolic BP .min(0).max(200),
//   heartRate/pulse .min(0).max(300), oxygenSaturation .min(0).max(100).
// These tests prove the schema fails closed on impossible input, routed through
// the public calculateClinicalScore dispatch for a few representative calculators.

describe('schema physiologic-range rejection', () => {
  it('CURB-65 rejects an impossibly high age (200)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'curb65',
        inputs: {
          confusion: false,
          respiratoryRate: 18,
          bloodPressure: { systolic: 120, diastolic: 80 },
          age: 200,
        },
      } as any)
    ).toThrow();
  });

  it('CURB-65 rejects a negative age', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'curb65',
        inputs: {
          confusion: false,
          respiratoryRate: 18,
          bloodPressure: { systolic: 120, diastolic: 80 },
          age: -5,
        },
      } as any)
    ).toThrow();
  });

  it('CURB-65 rejects an impossibly high respiratoryRate (5000)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'curb65',
        inputs: {
          confusion: false,
          respiratoryRate: 5000,
          bloodPressure: { systolic: 120, diastolic: 80 },
          age: 50,
        },
      } as any)
    ).toThrow();
  });

  it('CURB-65 rejects an impossible systolic BP (400)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'curb65',
        inputs: {
          confusion: false,
          respiratoryRate: 18,
          bloodPressure: { systolic: 400, diastolic: 80 },
          age: 50,
        },
      } as any)
    ).toThrow();
  });

  it('PERC rejects an oxygenSaturation above 100 (150)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'perc',
        inputs: {
          age: 40,
          heartRate: 80,
          oxygenSaturation: 150,
          unilateralLegSwelling: false,
          hemoptysis: false,
          recentSurgeryOrTrauma: false,
          priorPEorDVT: false,
          hormoneUse: false,
        },
      } as any)
    ).toThrow();
  });

  it('PERC rejects an impossible heartRate (9000)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'perc',
        inputs: {
          age: 40,
          heartRate: 9000,
          oxygenSaturation: 98,
          unilateralLegSwelling: false,
          hemoptysis: false,
          recentSurgeryOrTrauma: false,
          priorPEorDVT: false,
          hormoneUse: false,
        },
      } as any)
    ).toThrow();
  });

  it('qSOFA rejects an impossible systolic BP (350)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'qsofa',
        inputs: {
          respiratoryRate: 20,
          alteredMentalStatus: false,
          systolicBloodPressure: 350,
        },
      } as any)
    ).toThrow();
  });

  it('HEART rejects riskFactors above the cap (50)', () => {
    expect(() =>
      calculateClinicalScore({
        calculator: 'heart',
        inputs: {
          history: 'slightly_suspicious',
          ecg: 'normal',
          age: 55,
          riskFactors: 50,
          troponin: 'normal',
        },
      } as any)
    ).toThrow();
  });

  it('accepts in-range values at the boundary (sanity check)', () => {
    const r = calculateClinicalScore({
      calculator: 'curb65',
      inputs: {
        confusion: false,
        respiratoryRate: 18,
        bloodPressure: { systolic: 120, diastolic: 80 },
        age: 120,
      },
    } as any);
    expect(r.score).toBeGreaterThanOrEqual(0);
  });
});
