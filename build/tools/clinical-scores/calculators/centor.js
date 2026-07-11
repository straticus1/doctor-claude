import { getRiskGuidance } from '../utils.js';
import { CENTOR_AGE_YOUNG_MIN, CENTOR_AGE_YOUNG_MAX, CENTOR_AGE_MIDDLE_MIN, CENTOR_AGE_MIDDLE_MAX, CENTOR_AGE_OLD_MIN, } from '../constants.js';
export function calculateCentor(inputs) {
    let score = 0;
    const details = [];
    if (inputs.fever) {
        score += 1;
        details.push('Fever >38°C: +1');
    }
    if (inputs.tonsillarExudate) {
        score += 1;
        details.push('Tonsillar exudate: +1');
    }
    if (inputs.tenderAnteriorNodes) {
        score += 1;
        details.push('Tender anterior cervical nodes: +1');
    }
    if (inputs.noCough) {
        score += 1;
        details.push('Absence of cough: +1');
    }
    if (inputs.age >= CENTOR_AGE_YOUNG_MIN && inputs.age <= CENTOR_AGE_YOUNG_MAX) {
        score += 1;
        details.push(`Age ${CENTOR_AGE_YOUNG_MIN}-${CENTOR_AGE_YOUNG_MAX}: +1`);
    }
    else if (inputs.age >= CENTOR_AGE_MIDDLE_MIN && inputs.age <= CENTOR_AGE_MIDDLE_MAX) {
        details.push(`Age ${CENTOR_AGE_MIDDLE_MIN}-${CENTOR_AGE_MIDDLE_MAX}: +0`);
    }
    else if (inputs.age >= CENTOR_AGE_OLD_MIN) {
        score -= 1;
        details.push(`Age ≥${CENTOR_AGE_OLD_MIN}: -1`);
    }
    const maxScore = 4;
    // The Modified Centor (McIsaac) score ranges from -1 to 5: a patient with no
    // clinical criteria and age >=45 scores -1. Do NOT clamp to 0 — the risk
    // guidance deliberately branches on `score <= 0`, and clamping would collapse
    // the very-low-risk -1 case into 0.
    const adjustedScore = score;
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('centor', adjustedScore);
    return {
        score: adjustedScore,
        maxScore,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
