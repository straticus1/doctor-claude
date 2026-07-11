import { describe, it, expect } from 'vitest';
import { calculateClinicalScore, CalculateClinicalScoreSchema } from '../index.js';

// A minimal, schema-valid input for every calculator. Values are chosen only to
// pass zod validation and produce a numeric score; correctness of the numbers is
// covered by the per-calculator test files.
const validInputs: Record<string, object> = {
  curb65: {
    confusion: false,
    respiratoryRate: 18,
    bloodPressure: { systolic: 120, diastolic: 80 },
    age: 50,
  },
  centor: {
    fever: false,
    tonsillarExudate: false,
    tenderAnteriorNodes: false,
    noCough: false,
    age: 30,
  },
  wells_dvt: {
    activeCancer: false,
    paralysisOrImmobilization: false,
    recentlyBedridden: false,
    localizedTenderness: false,
    entireLegSwollen: false,
    calfSwelling: false,
    pittingEdema: false,
    collateralVeins: false,
    previousDVT: false,
    alternativeDiagnosis: false,
  },
  wells_pe: {
    clinicalDVTSigns: false,
    peIsLikelyDiagnosis: false,
    heartRateOver100: false,
    immobilizationOrSurgery: false,
    previousPEorDVT: false,
    hemoptysis: false,
    malignancy: false,
  },
  heart: {
    history: 'slightly_suspicious',
    ecg: 'normal',
    age: 40,
    riskFactors: 0,
    troponin: 'normal',
  },
  cha2ds2_vasc: {
    congestiveHeartFailure: false,
    hypertension: false,
    age: 50,
    diabetes: false,
    strokeTIAThrombus: false,
    vascularDisease: false,
    sex: 'male',
  },
  gcs: {
    eyeOpening: 'spontaneous',
    verbalResponse: 'oriented',
    motorResponse: 'obeys_commands',
  },
  qsofa: {
    respiratoryRate: 18,
    alteredMentalStatus: false,
    systolicBloodPressure: 120,
  },
  alvarado: {
    rlqPain: false,
    anorexia: false,
    nauseaVomiting: false,
    rlqTenderness: false,
    reboundTenderness: false,
    elevatedTemperature: false,
    leukocytosis: false,
    leftShift: false,
    migrationPain: false,
  },
  glasgow_blatchford: {
    hemoglobin: 15,
    systolicBloodPressure: 120,
    pulse: 80,
    melena: false,
    syncope: false,
    hepaticDisease: false,
    cardiacFailure: false,
    sex: 'male',
  },
  nihss: {
    levelOfConsciousness: 'alert',
    locQuestions: 'both_correct',
    locCommands: 'both_correct',
    bestGaze: 'normal',
    visual: 'no_loss',
    facialPalsy: 'normal',
    motorArmLeft: 'no_drift',
    motorArmRight: 'no_drift',
    motorLegLeft: 'no_drift',
    motorLegRight: 'no_drift',
    limbAtaxia: 'absent',
    sensory: 'normal',
    bestLanguage: 'no_aphasia',
    dysarthria: 'normal',
    extinctionInattention: 'no_abnormality',
  },
  sofa: {
    mechanicalVentilation: false,
    platelets: 200,
    bilirubin: 0.5,
    vasopressors: 'none',
    glasgowComaScale: 15,
    creatinine: 0.8,
  },
  perc: {
    age: 40,
    heartRate: 80,
    oxygenSaturation: 98,
    unilateralLegSwelling: false,
    hemoptysis: false,
    recentSurgeryOrTrauma: false,
    priorPEorDVT: false,
    hormoneUse: false,
  },
  timi: {
    age: 50,
    riskFactors: 0,
    knownCAD: false,
    aspirinUse: false,
    severeAngina: false,
    stChanges: false,
    elevatedCardiacMarkers: false,
  },
  meld: {
    bilirubin: 1.0,
    inr: 1.0,
    creatinine: 1.0,
    dialysis: false,
  },
  gad7: {
    nervous: 'not_at_all',
    stopWorrying: 'not_at_all',
    worryingTooMuch: 'not_at_all',
    troubleRelaxing: 'not_at_all',
    restless: 'not_at_all',
    easilyAnnoyed: 'not_at_all',
    feelingAfraid: 'not_at_all',
  },
  grace: {
    age: 50,
    heartRate: 80,
    systolicBloodPressure: 120,
    creatinine: 1.0,
    killipClass: 1,
    cardiacArrest: false,
    stDeviation: false,
    elevatedCardiacMarkers: false,
  },
  has_bled: {
    hypertension: false,
    abnormalRenalFunction: false,
    abnormalLiverFunction: false,
    stroke: false,
    bleedingHistory: false,
    labileINR: false,
    age: 50,
    medications: false,
    alcoholUse: false,
  },
  abcd2: {
    age: 50,
    bloodPressure: { systolic: 120, diastolic: 80 },
    clinicalFeatures: 'neither',
    duration: 'less_than_10',
    diabetes: false,
  },
};

function run(calculator: string, inputs: object) {
  return calculateClinicalScore({ calculator, inputs } as any);
}

// The set of calculator ids advertised by the public schema enum.
const enumIds = CalculateClinicalScoreSchema.shape.calculator.options as readonly string[];

describe('clinical-score dispatch', () => {
  it('the valid-input map covers exactly the schema enum ids', () => {
    // Guards against a calculator being added to the enum without a dispatch test.
    expect([...enumIds].sort()).toEqual(Object.keys(validInputs).sort());
    expect(enumIds.length).toBe(19);
  });

  it.each(enumIds)('%s resolves and returns a numeric score', (id) => {
    const r = run(id, validInputs[id]);
    expect(r).toBeTypeOf('object');
    expect(typeof r.score).toBe('number');
    expect(Number.isNaN(r.score)).toBe(false);
    expect(typeof r.maxScore).toBe('number');
  });

  it('an unknown calculator name is rejected', () => {
    expect(() => run('bogus', {})).toThrow();
  });

  it('inputs valid for one calculator sent to another are rejected by schema validation', () => {
    // Valid CURB-65 inputs lack GCS required fields (eyeOpening/verbalResponse/motorResponse).
    expect(() => run('gcs', validInputs.curb65)).toThrow();
    // Valid GCS inputs lack SOFA required fields (platelets/bilirubin/creatinine/...).
    expect(() => run('sofa', validInputs.gcs)).toThrow();
  });
});
