import { getRiskGuidance, formatEnumLabel } from '../utils.js';
export function calculateNIHSS(inputs) {
    let score = 0;
    const details = [];
    const locScores = {
        alert: 0,
        arouses_minor: 1,
        arouses_repeated: 2,
        coma: 3,
    };
    score += locScores[inputs.levelOfConsciousness];
    details.push(`LOC: ${formatEnumLabel(inputs.levelOfConsciousness)} = ${locScores[inputs.levelOfConsciousness]}`);
    const questionScores = {
        both_correct: 0,
        one_correct: 1,
        neither_correct: 2,
    };
    score += questionScores[inputs.locQuestions];
    details.push(`LOC Questions: ${formatEnumLabel(inputs.locQuestions)} = ${questionScores[inputs.locQuestions]}`);
    score += questionScores[inputs.locCommands];
    details.push(`LOC Commands: ${formatEnumLabel(inputs.locCommands)} = ${questionScores[inputs.locCommands]}`);
    const gazeScores = {
        normal: 0,
        partial_palsy: 1,
        forced_deviation: 2,
    };
    score += gazeScores[inputs.bestGaze];
    details.push(`Best Gaze: ${formatEnumLabel(inputs.bestGaze)} = ${gazeScores[inputs.bestGaze]}`);
    const visualScores = {
        no_loss: 0,
        partial_hemianopia: 1,
        complete_hemianopia: 2,
        bilateral_hemianopia: 3,
    };
    score += visualScores[inputs.visual];
    details.push(`Visual Fields: ${formatEnumLabel(inputs.visual)} = ${visualScores[inputs.visual]}`);
    const facialScores = {
        normal: 0,
        minor: 1,
        partial: 2,
        complete: 3,
    };
    score += facialScores[inputs.facialPalsy];
    details.push(`Facial Palsy: ${inputs.facialPalsy} = ${facialScores[inputs.facialPalsy]}`);
    const motorScores = {
        no_drift: 0,
        drift: 1,
        some_effort: 2,
        no_effort: 3,
        no_movement: 4,
        amputation: 0,
    };
    const leftArmScore = motorScores[inputs.motorArmLeft];
    score += leftArmScore;
    details.push(`Motor Left Arm: ${formatEnumLabel(inputs.motorArmLeft)} = ${leftArmScore}`);
    const rightArmScore = motorScores[inputs.motorArmRight];
    score += rightArmScore;
    details.push(`Motor Right Arm: ${formatEnumLabel(inputs.motorArmRight)} = ${rightArmScore}`);
    const leftLegScore = motorScores[inputs.motorLegLeft];
    score += leftLegScore;
    details.push(`Motor Left Leg: ${formatEnumLabel(inputs.motorLegLeft)} = ${leftLegScore}`);
    const rightLegScore = motorScores[inputs.motorLegRight];
    score += rightLegScore;
    details.push(`Motor Right Leg: ${formatEnumLabel(inputs.motorLegRight)} = ${rightLegScore}`);
    const ataxiaScores = {
        absent: 0,
        present_one: 1,
        present_two: 2,
    };
    score += ataxiaScores[inputs.limbAtaxia];
    details.push(`Limb Ataxia: ${formatEnumLabel(inputs.limbAtaxia)} = ${ataxiaScores[inputs.limbAtaxia]}`);
    const sensoryScores = {
        normal: 0,
        mild_loss: 1,
        severe_loss: 2,
    };
    score += sensoryScores[inputs.sensory];
    details.push(`Sensory: ${formatEnumLabel(inputs.sensory)} = ${sensoryScores[inputs.sensory]}`);
    const languageScores = {
        no_aphasia: 0,
        mild_aphasia: 1,
        severe_aphasia: 2,
        mute: 3,
    };
    score += languageScores[inputs.bestLanguage];
    details.push(`Best Language: ${formatEnumLabel(inputs.bestLanguage)} = ${languageScores[inputs.bestLanguage]}`);
    const dysarthriaScores = {
        normal: 0,
        mild: 1,
        severe: 2,
        intubated: 0,
    };
    score += dysarthriaScores[inputs.dysarthria];
    details.push(`Dysarthria: ${inputs.dysarthria} = ${dysarthriaScores[inputs.dysarthria]}`);
    const extinctionScores = {
        no_abnormality: 0,
        visual_tactile_spatial: 1,
        profound_hemi_inattention: 2,
    };
    score += extinctionScores[inputs.extinctionInattention];
    details.push(`Extinction/Inattention: ${formatEnumLabel(inputs.extinctionInattention)} = ${extinctionScores[inputs.extinctionInattention]}`);
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('nihss', score);
    return {
        score,
        maxScore: 42,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
