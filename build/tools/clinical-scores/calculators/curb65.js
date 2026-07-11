import { getRiskGuidance, ureaToBUN } from '../utils.js';
import { BUN_MG_DL_THRESHOLD, CURB65_RESPIRATORY_RATE_THRESHOLD, CURB65_SYSTOLIC_BP_THRESHOLD, CURB65_DIASTOLIC_BP_THRESHOLD, CURB65_AGE_THRESHOLD, } from '../constants.js';
export function calculateCURB65(inputs) {
    let score = 0;
    const details = [];
    if (inputs.confusion) {
        score += 1;
        details.push('Confusion: +1');
    }
    if (inputs.urea !== undefined && inputs.ureaUnit !== undefined) {
        const bunMgDl = ureaToBUN(inputs.urea, inputs.ureaUnit);
        if (bunMgDl > BUN_MG_DL_THRESHOLD) {
            score += 1;
            details.push('Elevated BUN/Urea: +1');
        }
    }
    if (inputs.respiratoryRate >= CURB65_RESPIRATORY_RATE_THRESHOLD) {
        score += 1;
        details.push(`Respiratory rate ≥${CURB65_RESPIRATORY_RATE_THRESHOLD}: +1`);
    }
    if (inputs.bloodPressure.systolic < CURB65_SYSTOLIC_BP_THRESHOLD || inputs.bloodPressure.diastolic <= CURB65_DIASTOLIC_BP_THRESHOLD) {
        score += 1;
        details.push('Low blood pressure: +1');
    }
    if (inputs.age >= CURB65_AGE_THRESHOLD) {
        score += 1;
        details.push(`Age ≥${CURB65_AGE_THRESHOLD}: +1`);
    }
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('curb65', score);
    return {
        score,
        maxScore: 5,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
