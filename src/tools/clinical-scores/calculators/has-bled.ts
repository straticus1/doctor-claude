import { z } from 'zod';
import { HASBLEDInputSchema } from '../schemas.js';
import type { ScoreResult } from '../types.js';
import { getRiskGuidance } from '../utils.js';
import { HAS_BLED_AGE_THRESHOLD } from '../constants.js';

export function calculateHASBLED(inputs: z.infer<typeof HASBLEDInputSchema>): ScoreResult {
  let score = 0;
  const details: string[] = [];

  if (inputs.hypertension) {
    score += 1;
    details.push('Hypertension (uncontrolled SBP >160 mmHg): +1');
  }

  if (inputs.abnormalRenalFunction) {
    score += 1;
    details.push('Abnormal renal function (dialysis, transplant, Cr >2.26 mg/dL or >200 μmol/L): +1');
  }

  if (inputs.abnormalLiverFunction) {
    score += 1;
    details.push('Abnormal liver function (cirrhosis, bilirubin >2x normal, AST/ALT/ALP >3x normal): +1');
  }

  if (inputs.stroke) {
    score += 1;
    details.push('Stroke history: +1');
  }

  if (inputs.bleedingHistory) {
    score += 1;
    details.push('Bleeding history or predisposition (anemia, etc.): +1');
  }

  if (inputs.labileINR) {
    score += 1;
    details.push('Labile INR (unstable/high INRs, time in therapeutic range <60%): +1');
  }

  if (inputs.age > HAS_BLED_AGE_THRESHOLD) {
    score += 1;
    details.push(`Age >${HAS_BLED_AGE_THRESHOLD} years: +1`);
  }

  if (inputs.medications) {
    score += 1;
    details.push('Medications predisposing to bleeding (antiplatelet agents, NSAIDs): +1');
  }

  if (inputs.alcoholUse) {
    score += 1;
    details.push('Alcohol use (≥8 drinks/week): +1');
  }

  const { riskCategory, interpretation, recommendation } = getRiskGuidance('has_bled', score);

  return {
    score,
    maxScore: 9,
    interpretation,
    recommendation,
    riskCategory,
    details: details.join('\n'),
  };
}
