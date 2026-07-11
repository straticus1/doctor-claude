import { getRiskGuidance } from '../utils.js';
import { MELD_MIN_LAB_VALUE, MELD_MAX_CREATININE, MELD_MIN_SCORE, MELD_MAX_SCORE, MELD_BILIRUBIN_COEFFICIENT, MELD_INR_COEFFICIENT, MELD_CREATININE_COEFFICIENT, MELD_CONSTANT, } from '../constants.js';
export function calculateMELD(inputs) {
    let bilirubin = Math.max(inputs.bilirubin, MELD_MIN_LAB_VALUE);
    let inr = Math.max(inputs.inr, MELD_MIN_LAB_VALUE);
    let creatinine = Math.max(inputs.creatinine, MELD_MIN_LAB_VALUE);
    if (inputs.dialysis || creatinine > MELD_MAX_CREATININE) {
        creatinine = MELD_MAX_CREATININE;
    }
    const rawScore = MELD_BILIRUBIN_COEFFICIENT * Math.log(bilirubin) +
        MELD_INR_COEFFICIENT * Math.log(inr) +
        MELD_CREATININE_COEFFICIENT * Math.log(creatinine) +
        MELD_CONSTANT;
    let score = Math.round(rawScore);
    score = Math.max(MELD_MIN_SCORE, Math.min(score, MELD_MAX_SCORE));
    const details = [];
    details.push(`Bilirubin: ${inputs.bilirubin.toFixed(1)} mg/dL (used: ${bilirubin.toFixed(1)})`);
    details.push(`INR: ${inputs.inr.toFixed(2)} (used: ${inr.toFixed(2)})`);
    details.push(`Creatinine: ${inputs.creatinine.toFixed(1)} mg/dL (used: ${creatinine.toFixed(1)})`);
    if (inputs.dialysis) {
        details.push('Patient on dialysis: creatinine set to 4.0');
    }
    details.push(`Formula: 3.78×ln[bilirubin] + 11.2×ln[INR] + 9.57×ln[creatinine] + 6.43`);
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('meld', score);
    return {
        score,
        maxScore: MELD_MAX_SCORE,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
