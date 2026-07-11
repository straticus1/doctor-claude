import { z } from 'zod';
import { GlasgowBlatchfordInputSchema } from '../schemas.js';
import type { ScoreResult } from '../types.js';
import { getRiskGuidance, ureaToBUN } from '../utils.js';
import {
  GLASGOW_BUN_THRESHOLD_HIGH,
  GLASGOW_BUN_THRESHOLD_MEDIUM_HIGH,
  GLASGOW_BUN_THRESHOLD_MEDIUM,
  GLASGOW_BUN_THRESHOLD_LOW,
  GLASGOW_HGB_THRESHOLD_LOW,
  GLASGOW_HGB_THRESHOLD_MEDIUM_MALE,
  GLASGOW_HGB_THRESHOLD_HIGH_MALE,
  GLASGOW_BP_THRESHOLD_LOW,
  GLASGOW_BP_THRESHOLD_MEDIUM,
  GLASGOW_BP_THRESHOLD_HIGH,
  GLASGOW_PULSE_THRESHOLD,
} from '../constants.js';

export function calculateGlasgowBlatchford(inputs: z.infer<typeof GlasgowBlatchfordInputSchema>): ScoreResult {
  let score = 0;
  const details: string[] = [];

  if (inputs.bun !== undefined && inputs.bunUnit !== undefined) {
    const bunMgDl = ureaToBUN(inputs.bun, inputs.bunUnit);
    if (bunMgDl >= GLASGOW_BUN_THRESHOLD_HIGH) {
      score += 6;
      details.push(`BUN ≥${GLASGOW_BUN_THRESHOLD_HIGH} mg/dL: +6`);
    } else if (bunMgDl >= GLASGOW_BUN_THRESHOLD_MEDIUM_HIGH) {
      score += 4;
      details.push(`BUN ${GLASGOW_BUN_THRESHOLD_MEDIUM_HIGH}-${GLASGOW_BUN_THRESHOLD_HIGH - 0.1} mg/dL: +4`);
    } else if (bunMgDl >= GLASGOW_BUN_THRESHOLD_MEDIUM) {
      score += 3;
      details.push(`BUN ${GLASGOW_BUN_THRESHOLD_MEDIUM}-${GLASGOW_BUN_THRESHOLD_MEDIUM_HIGH - 0.1} mg/dL: +3`);
    } else if (bunMgDl >= GLASGOW_BUN_THRESHOLD_LOW) {
      score += 2;
      details.push(`BUN ${GLASGOW_BUN_THRESHOLD_LOW}-${GLASGOW_BUN_THRESHOLD_MEDIUM - 0.1} mg/dL: +2`);
    }
  }

  if (inputs.sex === 'male') {
    if (inputs.hemoglobin < GLASGOW_HGB_THRESHOLD_LOW) {
      score += 6;
      details.push(`Hemoglobin <${GLASGOW_HGB_THRESHOLD_LOW} g/dL (male): +6`);
    } else if (inputs.hemoglobin < GLASGOW_HGB_THRESHOLD_MEDIUM_MALE) {
      score += 3;
      details.push(`Hemoglobin ${GLASGOW_HGB_THRESHOLD_LOW}-${GLASGOW_HGB_THRESHOLD_MEDIUM_MALE - 0.1} g/dL (male): +3`);
    } else if (inputs.hemoglobin >= GLASGOW_HGB_THRESHOLD_MEDIUM_MALE && inputs.hemoglobin < GLASGOW_HGB_THRESHOLD_HIGH_MALE) {
      score += 1;
      details.push(`Hemoglobin ${GLASGOW_HGB_THRESHOLD_MEDIUM_MALE}-${GLASGOW_HGB_THRESHOLD_HIGH_MALE - 0.1} g/dL (male): +1`);
    }
  } else {
    if (inputs.hemoglobin < GLASGOW_HGB_THRESHOLD_LOW) {
      score += 6;
      details.push(`Hemoglobin <${GLASGOW_HGB_THRESHOLD_LOW} g/dL (female): +6`);
    } else if (inputs.hemoglobin >= GLASGOW_HGB_THRESHOLD_LOW && inputs.hemoglobin < GLASGOW_HGB_THRESHOLD_MEDIUM_MALE) {
      score += 1;
      details.push(`Hemoglobin ${GLASGOW_HGB_THRESHOLD_LOW}-${GLASGOW_HGB_THRESHOLD_MEDIUM_MALE - 0.1} g/dL (female): +1`);
    }
  }

  if (inputs.systolicBloodPressure < GLASGOW_BP_THRESHOLD_LOW) {
    score += 3;
    details.push(`Systolic BP <${GLASGOW_BP_THRESHOLD_LOW} mmHg: +3`);
  } else if (inputs.systolicBloodPressure >= GLASGOW_BP_THRESHOLD_LOW && inputs.systolicBloodPressure < GLASGOW_BP_THRESHOLD_MEDIUM) {
    score += 2;
    details.push(`Systolic BP ${GLASGOW_BP_THRESHOLD_LOW}-${GLASGOW_BP_THRESHOLD_MEDIUM - 1} mmHg: +2`);
  } else if (inputs.systolicBloodPressure >= GLASGOW_BP_THRESHOLD_MEDIUM && inputs.systolicBloodPressure < GLASGOW_BP_THRESHOLD_HIGH) {
    score += 1;
    details.push(`Systolic BP ${GLASGOW_BP_THRESHOLD_MEDIUM}-${GLASGOW_BP_THRESHOLD_HIGH - 1} mmHg: +1`);
  }

  if (inputs.pulse >= GLASGOW_PULSE_THRESHOLD) {
    score += 1;
    details.push(`Pulse ≥${GLASGOW_PULSE_THRESHOLD} bpm: +1`);
  }

  if (inputs.melena) {
    score += 1;
    details.push('Melena present: +1');
  }

  if (inputs.syncope) {
    score += 2;
    details.push('Syncope: +2');
  }

  if (inputs.hepaticDisease) {
    score += 2;
    details.push('Hepatic disease: +2');
  }

  if (inputs.cardiacFailure) {
    score += 2;
    details.push('Cardiac failure: +2');
  }

  const { riskCategory, interpretation, recommendation } = getRiskGuidance('glasgow_blatchford', score);

  return {
    score,
    maxScore: 23,
    interpretation,
    recommendation,
    riskCategory,
    details: details.join('\n'),
  };
}
