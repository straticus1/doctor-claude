import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// NIH Stroke Scale (Brott et al., Stroke 1989; NINDS). 15 items, total 0-42.
// Point values per item (from the published scale):
//  1a LOC: alert 0 / arouses_minor 1 / arouses_repeated 2 / coma 3
//  1b LOC questions: both 0 / one 1 / neither 2
//  1c LOC commands: both 0 / one 1 / neither 2
//  2 Best gaze: normal 0 / partial 1 / forced 2
//  3 Visual: no_loss 0 / partial_hemianopia 1 / complete_hemianopia 2 / bilateral_hemianopia 3
//  4 Facial palsy: normal 0 / minor 1 / partial 2 / complete 3
//  5a/5b Motor arm: 0/1/2/3/4, amputation 0 (untestable → not scored)
//  6a/6b Motor leg: 0/1/2/3/4, amputation 0
//  7 Limb ataxia: absent 0 / one 1 / two 2
//  8 Sensory: normal 0 / mild 1 / severe 2
//  9 Best language: none 0 / mild 1 / severe 2 / mute (global aphasia) 3
//  10 Dysarthria: normal 0 / mild 1 / severe 2, intubated 0 (untestable)
//  11 Extinction/inattention: none 0 / one modality 1 / profound 2
// Severity bands (as implemented): 0 No Stroke, 1-4 Minor, 5-15 Moderate,
// 16-20 Moderate-Severe, 21-42 Severe.

const normal = {
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
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'nihss', inputs } as any);
}

describe('NIHSS worked examples', () => {
  it('scores 0 for a fully normal exam → No Stroke', () => {
    const r = run(normal);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(42);
    expect(r.riskCategory).toMatch(/no stroke/i);
  });

  it('scores 42 for the maximal (all-worst) exam → Severe', () => {
    const r = run({
      levelOfConsciousness: 'coma', // 3
      locQuestions: 'neither_correct', // 2
      locCommands: 'neither_correct', // 2
      bestGaze: 'forced_deviation', // 2
      visual: 'bilateral_hemianopia', // 3 (blindness — the true 3-point level)
      facialPalsy: 'complete', // 3
      motorArmLeft: 'no_movement', // 4
      motorArmRight: 'no_movement', // 4
      motorLegLeft: 'no_movement', // 4
      motorLegRight: 'no_movement', // 4
      limbAtaxia: 'present_two', // 2
      sensory: 'severe_loss', // 2
      bestLanguage: 'mute', // 3
      dysarthria: 'severe', // 2
      extinctionInattention: 'profound_hemi_inattention', // 2
    });
    // 3+2+2+2+3+3 + 4+4+4+4 + 2+2+3+2+2 = 42
    expect(r.score).toBe(42);
    expect(r.riskCategory).toMatch(/severe/i);
  });

  it('scores 10 for a documented mid-range example → Moderate', () => {
    const r = run({
      ...normal,
      locQuestions: 'one_correct', // 1
      bestGaze: 'partial_palsy', // 1
      visual: 'partial_hemianopia', // 1
      facialPalsy: 'partial', // 2
      motorArmLeft: 'drift', // 1
      motorLegLeft: 'drift', // 1
      sensory: 'mild_loss', // 1
      bestLanguage: 'mild_aphasia', // 1
      dysarthria: 'mild', // 1
    });
    // 1+1+1+2+1+1+1+1+1 = 10
    expect(r.score).toBe(10);
    expect(r.riskCategory).toMatch(/moderate/i);
  });
});

describe('NIHSS special cases and boundaries', () => {
  it('motor arm/leg amputation scores 0, not 4', () => {
    const r = run({ ...normal, motorArmLeft: 'amputation', motorLegRight: 'amputation' });
    expect(r.score).toBe(0);
  });

  it('motor no_movement scores the full 4 points', () => {
    const r = run({ ...normal, motorArmLeft: 'no_movement' });
    expect(r.score).toBe(4);
  });

  it('dysarthria intubated scores 0 (untestable)', () => {
    const r = run({ ...normal, dysarthria: 'intubated' });
    expect(r.score).toBe(0);
  });

  it('visual field scoring matches the official 4-level scale', () => {
    // NIH Stroke Scale Item 3: 0 no loss, 1 partial hemianopia,
    // 2 complete hemianopia, 3 bilateral hemianopia / blindness.
    expect(run({ ...normal, visual: 'partial_hemianopia' }).score).toBe(1);
    expect(run({ ...normal, visual: 'complete_hemianopia' }).score).toBe(2);
    expect(run({ ...normal, visual: 'bilateral_hemianopia' }).score).toBe(3);
  });

  it('facial palsy complete scores 3 and language mute scores 3', () => {
    expect(run({ ...normal, facialPalsy: 'complete' }).score).toBe(3);
    expect(run({ ...normal, bestLanguage: 'mute' }).score).toBe(3);
  });

  it('LOC questions and commands cap at 2', () => {
    expect(run({ ...normal, locQuestions: 'neither_correct' }).score).toBe(2);
    expect(run({ ...normal, locCommands: 'neither_correct' }).score).toBe(2);
  });

  it('category threshold: score 4 is Minor, score 5 is Moderate', () => {
    // 4 = motorArmLeft no_effort(3) + facial minor(1)
    const four = run({ ...normal, motorArmLeft: 'no_effort', facialPalsy: 'minor' });
    expect(four.score).toBe(4);
    expect(four.riskCategory).toMatch(/minor/i);
    // 5 = motorArmLeft no_movement(4) + facial minor(1)
    const five = run({ ...normal, motorArmLeft: 'no_movement', facialPalsy: 'minor' });
    expect(five.score).toBe(5);
    expect(five.riskCategory).toMatch(/moderate/i);
  });
});

describe('NIHSS rejection', () => {
  it('rejects a missing item', () => {
    const { sensory, ...missing } = normal;
    expect(() => run(missing)).toThrow();
  });

  it('rejects an invalid enum value', () => {
    expect(() => run({ ...normal, levelOfConsciousness: 'drowsy' })).toThrow();
  });
});
