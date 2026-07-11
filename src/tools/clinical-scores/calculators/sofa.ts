import { z } from 'zod';
import { SOFAInputSchema } from '../schemas.js';
import type { ScoreResult } from '../types.js';
import { getRiskGuidance, normalizeFiO2, calculateRenalScore } from '../utils.js';
import {
  SOFA_PAO2_FIO2_THRESHOLD_CRITICAL,
  SOFA_PAO2_FIO2_THRESHOLD_SEVERE,
  SOFA_PAO2_FIO2_THRESHOLD_MODERATE,
  SOFA_PAO2_FIO2_THRESHOLD_MILD,
  SOFA_PLATELET_THRESHOLD_CRITICAL,
  SOFA_PLATELET_THRESHOLD_SEVERE,
  SOFA_PLATELET_THRESHOLD_MODERATE,
  SOFA_PLATELET_THRESHOLD_MILD,
  SOFA_BILIRUBIN_THRESHOLD_CRITICAL,
  SOFA_BILIRUBIN_THRESHOLD_SEVERE,
  SOFA_BILIRUBIN_THRESHOLD_MODERATE,
  SOFA_BILIRUBIN_THRESHOLD_MILD,
  SOFA_MAP_THRESHOLD,
  SOFA_GCS_THRESHOLD_CRITICAL,
  SOFA_GCS_THRESHOLD_SEVERE,
  SOFA_GCS_THRESHOLD_MODERATE,
  SOFA_GCS_THRESHOLD_MILD,
} from '../constants.js';

export function calculateSOFA(inputs: z.infer<typeof SOFAInputSchema>): ScoreResult {
  let score = 0;
  const details: string[] = [];

  let respirationScore = 0;
  if (inputs.pao2 !== undefined && inputs.fio2 !== undefined) {
    const fio2Normalized = normalizeFiO2(inputs.fio2);
    const pao2Fio2Ratio = inputs.pao2 / fio2Normalized;

    if (pao2Fio2Ratio < SOFA_PAO2_FIO2_THRESHOLD_CRITICAL && inputs.mechanicalVentilation) {
      respirationScore = 4;
      details.push(`Respiration: PaO2/FiO2 <${SOFA_PAO2_FIO2_THRESHOLD_CRITICAL} with mechanical ventilation = 4`);
    } else if (pao2Fio2Ratio < SOFA_PAO2_FIO2_THRESHOLD_SEVERE && inputs.mechanicalVentilation) {
      respirationScore = 3;
      details.push(`Respiration: PaO2/FiO2 <${SOFA_PAO2_FIO2_THRESHOLD_SEVERE} with mechanical ventilation = 3`);
    } else if (pao2Fio2Ratio < SOFA_PAO2_FIO2_THRESHOLD_MODERATE) {
      respirationScore = 2;
      details.push(`Respiration: PaO2/FiO2 <${SOFA_PAO2_FIO2_THRESHOLD_MODERATE} = 2`);
    } else if (pao2Fio2Ratio < SOFA_PAO2_FIO2_THRESHOLD_MILD) {
      respirationScore = 1;
      details.push(`Respiration: PaO2/FiO2 <${SOFA_PAO2_FIO2_THRESHOLD_MILD} = 1`);
    } else {
      details.push(`Respiration: PaO2/FiO2 ≥${SOFA_PAO2_FIO2_THRESHOLD_MILD} = 0`);
    }
  } else {
    details.push(`Respiration: Unable to calculate (PaO2 or FiO2 not provided) = 0`);
  }
  score += respirationScore;

  let coagulationScore = 0;
  if (inputs.platelets < SOFA_PLATELET_THRESHOLD_CRITICAL) {
    coagulationScore = 4;
    details.push(`Coagulation: Platelets <${SOFA_PLATELET_THRESHOLD_CRITICAL} = 4`);
  } else if (inputs.platelets < SOFA_PLATELET_THRESHOLD_SEVERE) {
    coagulationScore = 3;
    details.push(`Coagulation: Platelets <${SOFA_PLATELET_THRESHOLD_SEVERE} = 3`);
  } else if (inputs.platelets < SOFA_PLATELET_THRESHOLD_MODERATE) {
    coagulationScore = 2;
    details.push(`Coagulation: Platelets <${SOFA_PLATELET_THRESHOLD_MODERATE} = 2`);
  } else if (inputs.platelets < SOFA_PLATELET_THRESHOLD_MILD) {
    coagulationScore = 1;
    details.push(`Coagulation: Platelets <${SOFA_PLATELET_THRESHOLD_MILD} = 1`);
  } else {
    details.push(`Coagulation: Platelets ≥${SOFA_PLATELET_THRESHOLD_MILD} = 0`);
  }
  score += coagulationScore;

  let liverScore = 0;
  if (inputs.bilirubin >= SOFA_BILIRUBIN_THRESHOLD_CRITICAL) {
    liverScore = 4;
    details.push(`Liver: Bilirubin ≥${SOFA_BILIRUBIN_THRESHOLD_CRITICAL} mg/dL = 4`);
  } else if (inputs.bilirubin >= SOFA_BILIRUBIN_THRESHOLD_SEVERE) {
    liverScore = 3;
    details.push(`Liver: Bilirubin ≥${SOFA_BILIRUBIN_THRESHOLD_SEVERE} mg/dL = 3`);
  } else if (inputs.bilirubin >= SOFA_BILIRUBIN_THRESHOLD_MODERATE) {
    liverScore = 2;
    details.push(`Liver: Bilirubin ≥${SOFA_BILIRUBIN_THRESHOLD_MODERATE} mg/dL = 2`);
  } else if (inputs.bilirubin >= SOFA_BILIRUBIN_THRESHOLD_MILD) {
    liverScore = 1;
    details.push(`Liver: Bilirubin ≥${SOFA_BILIRUBIN_THRESHOLD_MILD} mg/dL = 1`);
  } else {
    details.push(`Liver: Bilirubin <${SOFA_BILIRUBIN_THRESHOLD_MILD} mg/dL = 0`);
  }
  score += liverScore;

  let cardiovascularScore = 0;
  if (inputs.vasopressors === 'dopamine_high_or_epi_norepi_high') {
    cardiovascularScore = 4;
    details.push(`Cardiovascular: Dopamine >15, or epinephrine >0.1, or norepinephrine >0.1 μg/kg/min = 4`);
  } else if (inputs.vasopressors === 'dopamine_medium_or_epi_norepi_low') {
    cardiovascularScore = 3;
    details.push(`Cardiovascular: Dopamine >5-15, or epinephrine ≤0.1, or norepinephrine ≤0.1 μg/kg/min = 3`);
  } else if (inputs.vasopressors === 'dopamine_low') {
    cardiovascularScore = 2;
    details.push(`Cardiovascular: Dopamine ≤5 or dobutamine any dose = 2`);
  } else if (inputs.meanArterialPressure !== undefined) {
    if (inputs.meanArterialPressure < SOFA_MAP_THRESHOLD) {
      cardiovascularScore = 1;
      details.push(`Cardiovascular: MAP <${SOFA_MAP_THRESHOLD} mmHg = 1`);
    } else {
      details.push(`Cardiovascular: MAP ≥${SOFA_MAP_THRESHOLD} mmHg, no vasopressors = 0`);
    }
  } else {
    details.push(`Cardiovascular: No vasopressors = 0`);
  }
  score += cardiovascularScore;

  let cnsScore = 0;
  if (inputs.glasgowComaScale < SOFA_GCS_THRESHOLD_CRITICAL) {
    cnsScore = 4;
    details.push(`CNS: Glasgow Coma Scale <${SOFA_GCS_THRESHOLD_CRITICAL} = 4`);
  } else if (inputs.glasgowComaScale < SOFA_GCS_THRESHOLD_SEVERE) {
    cnsScore = 3;
    details.push(`CNS: Glasgow Coma Scale ${SOFA_GCS_THRESHOLD_CRITICAL}-${SOFA_GCS_THRESHOLD_SEVERE - 1} = 3`);
  } else if (inputs.glasgowComaScale < SOFA_GCS_THRESHOLD_MODERATE) {
    cnsScore = 2;
    details.push(`CNS: Glasgow Coma Scale ${SOFA_GCS_THRESHOLD_SEVERE}-${SOFA_GCS_THRESHOLD_MODERATE - 1} = 2`);
  } else if (inputs.glasgowComaScale < SOFA_GCS_THRESHOLD_MILD) {
    cnsScore = 1;
    details.push(`CNS: Glasgow Coma Scale ${SOFA_GCS_THRESHOLD_MODERATE}-${SOFA_GCS_THRESHOLD_MILD - 1} = 1`);
  } else {
    details.push(`CNS: Glasgow Coma Scale ${SOFA_GCS_THRESHOLD_MILD} = 0`);
  }
  score += cnsScore;

  const renalResult = calculateRenalScore(inputs.creatinine, inputs.urineOutput);
  score += renalResult.score;
  details.push(renalResult.detail);

  const { riskCategory, interpretation, recommendation } = getRiskGuidance('sofa', score);

  return {
    score,
    maxScore: 24,
    interpretation,
    recommendation,
    riskCategory,
    details: details.join('\n'),
  };
}
