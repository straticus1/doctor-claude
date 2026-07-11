import { getRiskGuidance } from '../utils.js';
// GRACE 1.0 IN-HOSPITAL mortality nomogram (Granger CB et al., "Predictors of
// hospital mortality in the Global Registry of Acute Coronary Events",
// Arch Intern Med. 2003;163(19):2345-2353).
//
// These are the in-hospital point tables — NOT the 6-month tables. The risk-band
// cutoffs in guidance.ts (Low <109, Intermediate 109–140, High >140) are the
// published in-hospital cutoffs and match these weights.
//
// Ranges are evaluated low→high with getPointsFromRange returning the points of
// the first bucket whose `max` the value does not exceed. Buckets encode the
// inclusive upper bound of each published category (e.g. Age 30–39 → max 39).
const AGE_POINTS = [
    { max: 29, points: 0 }, // <30
    { max: 39, points: 8 }, // 30–39
    { max: 49, points: 25 }, // 40–49
    { max: 59, points: 41 }, // 50–59
    { max: 69, points: 58 }, // 60–69
    { max: 79, points: 75 }, // 70–79
    { max: 89, points: 91 }, // 80–89
    { max: Infinity, points: 100 }, // ≥90
];
const HEART_RATE_POINTS = [
    { max: 49, points: 0 }, // <50
    { max: 69, points: 3 }, // 50–69
    { max: 89, points: 9 }, // 70–89
    { max: 109, points: 15 }, // 90–109
    { max: 149, points: 24 }, // 110–149
    { max: 199, points: 38 }, // 150–199
    { max: Infinity, points: 46 }, // ≥200
];
const SYSTOLIC_BP_POINTS = [
    { max: 79, points: 58 }, // <80  (severe hypotension — highest weight)
    { max: 99, points: 53 }, // 80–99
    { max: 119, points: 43 }, // 100–119
    { max: 139, points: 34 }, // 120–139
    { max: 159, points: 24 }, // 140–159
    { max: 199, points: 10 }, // 160–199
    { max: Infinity, points: 0 }, // ≥200
];
const CREATININE_POINTS = [
    { max: 0.39, points: 1 }, // 0.0–0.39
    { max: 0.79, points: 4 }, // 0.4–0.79
    { max: 1.19, points: 7 }, // 0.8–1.19
    { max: 1.59, points: 10 }, // 1.2–1.59
    { max: 1.99, points: 13 }, // 1.6–1.99
    { max: 3.99, points: 21 }, // 2.0–3.99
    { max: Infinity, points: 28 }, // ≥4.0
];
// Killip class I–IV → index 0–3.
const KILLIP_CLASS_POINTS = [0, 20, 39, 59];
const CARDIAC_ARREST_POINTS = 39;
const ST_DEVIATION_POINTS = 28;
const ELEVATED_MARKERS_POINTS = 14;
// Maximum achievable score:
// 100 (age) + 46 (HR) + 58 (SBP) + 28 (creat) + 59 (Killip)
//   + 39 (arrest) + 28 (ST) + 14 (markers) = 372
const MAX_SCORE = 372;
function getPointsFromRange(value, ranges) {
    for (const range of ranges) {
        if (value <= range.max) {
            return range.points;
        }
    }
    return ranges[ranges.length - 1].points;
}
export function calculateGRACE(inputs) {
    let score = 0;
    const details = [];
    const agePoints = getPointsFromRange(inputs.age, AGE_POINTS);
    score += agePoints;
    details.push(`Age ${inputs.age} years: +${agePoints}`);
    const hrPoints = getPointsFromRange(inputs.heartRate, HEART_RATE_POINTS);
    score += hrPoints;
    details.push(`Heart rate ${inputs.heartRate} bpm: +${hrPoints}`);
    const bpPoints = getPointsFromRange(inputs.systolicBloodPressure, SYSTOLIC_BP_POINTS);
    score += bpPoints;
    details.push(`Systolic BP ${inputs.systolicBloodPressure} mmHg: +${bpPoints}`);
    const creatPoints = getPointsFromRange(inputs.creatinine, CREATININE_POINTS);
    score += creatPoints;
    details.push(`Creatinine ${inputs.creatinine.toFixed(2)} mg/dL: +${creatPoints}`);
    const killipPoints = KILLIP_CLASS_POINTS[inputs.killipClass - 1];
    score += killipPoints;
    details.push(`Killip class ${inputs.killipClass}: +${killipPoints}`);
    if (inputs.cardiacArrest) {
        score += CARDIAC_ARREST_POINTS;
        details.push(`Cardiac arrest at admission: +${CARDIAC_ARREST_POINTS}`);
    }
    if (inputs.stDeviation) {
        score += ST_DEVIATION_POINTS;
        details.push(`ST-segment deviation: +${ST_DEVIATION_POINTS}`);
    }
    if (inputs.elevatedCardiacMarkers) {
        score += ELEVATED_MARKERS_POINTS;
        details.push(`Elevated cardiac biomarkers: +${ELEVATED_MARKERS_POINTS}`);
    }
    const { riskCategory, interpretation, recommendation } = getRiskGuidance('grace', score);
    return {
        score,
        maxScore: MAX_SCORE,
        interpretation,
        recommendation,
        riskCategory,
        details: details.join('\n'),
    };
}
