import { getRiskGuidance } from '../utils.js';
const AGE_THRESHOLD = 60;
const BP_SYSTOLIC_THRESHOLD = 140;
const BP_DIASTOLIC_THRESHOLD = 90;
const CLINICAL_FEATURES_POINTS = {
    unilateral_weakness: 2,
    speech_impairment: 1,
    neither: 0,
};
const DURATION_POINTS = {
    less_than_10: 0,
    '10_to_59': 1,
    '60_or_more': 2,
};
export function calculateABCD2(inputs) {
    let score = 0;
    const details = [];
    if (inputs.age >= AGE_THRESHOLD) {
        score += 1;
        details.push(`Age ${inputs.age} years (≥60): +1`);
    }
    else {
        details.push(`Age ${inputs.age} years (<60): 0`);
    }
    if (inputs.bloodPressure.systolic >= BP_SYSTOLIC_THRESHOLD || inputs.bloodPressure.diastolic >= BP_DIASTOLIC_THRESHOLD) {
        score += 1;
        details.push(`Blood pressure ${inputs.bloodPressure.systolic}/${inputs.bloodPressure.diastolic} mmHg (≥140/90): +1`);
    }
    else {
        details.push(`Blood pressure ${inputs.bloodPressure.systolic}/${inputs.bloodPressure.diastolic} mmHg (<140/90): 0`);
    }
    const clinicalPoints = CLINICAL_FEATURES_POINTS[inputs.clinicalFeatures];
    score += clinicalPoints;
    details.push(`Clinical features (${inputs.clinicalFeatures.replace(/_/g, ' ')}): +${clinicalPoints}`);
    const durationPoints = DURATION_POINTS[inputs.duration];
    score += durationPoints;
    details.push(`Duration (${inputs.duration.replace(/_/g, ' ')} minutes): +${durationPoints}`);
    if (inputs.diabetes) {
        score += 1;
        details.push('Diabetes: +1');
    }
    else {
        details.push('Diabetes: 0');
    }
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('abcd2', score);
    return {
        score,
        maxScore: 7,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
