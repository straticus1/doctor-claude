import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Glasgow Coma Scale (Teasdale & Jennett, Lancet 1974): sum of three components,
// range 3-15. Eye opening: spontaneous 4 / to speech 3 / to pain 2 / none 1.
// Verbal: oriented 5 / confused 4 / inappropriate words 3 / incomprehensible 2 /
// none 1. Motor: obeys commands 6 / localizes pain 5 / withdraws 4 /
// abnormal flexion 3 / abnormal extension 2 / none 1.
// Severity (head-injury convention): GCS 13-15 Mild, 9-12 Moderate, 3-8 Severe.
function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'gcs', inputs } as any);
}

describe('GCS worked examples', () => {
  it('scores 15 (all best responses) → Mild', () => {
    const r = run({
      eyeOpening: 'spontaneous', // 4
      verbalResponse: 'oriented', // 5
      motorResponse: 'obeys_commands', // 6
    });
    expect(r.score).toBe(15);
    expect(r.maxScore).toBe(15);
    expect(r.riskCategory).toMatch(/mild/i);
  });

  it('scores 3 (all no response, minimum possible) → Severe', () => {
    const r = run({
      eyeOpening: 'none', // 1
      verbalResponse: 'none', // 1
      motorResponse: 'none', // 1
    });
    expect(r.score).toBe(3);
    expect(r.riskCategory).toMatch(/severe/i);
  });

  it('scores 12 (to_speech 3 + confused 4 + localizes_pain 5) → Moderate', () => {
    const r = run({
      eyeOpening: 'to_speech', // 3
      verbalResponse: 'confused', // 4
      motorResponse: 'localizes_pain', // 5
    });
    expect(r.score).toBe(12);
    expect(r.riskCategory).toMatch(/moderate/i);
  });
});

describe('GCS boundaries', () => {
  // Severity bands: 13-15 Mild, 9-12 Moderate, 3-8 Severe.
  it('GCS 13 is Mild; GCS 12 is Moderate', () => {
    // 13 = spontaneous(4) + confused(4) + localizes_pain(5)
    const thirteen = run({ eyeOpening: 'spontaneous', verbalResponse: 'confused', motorResponse: 'localizes_pain' });
    expect(thirteen.score).toBe(13);
    expect(thirteen.riskCategory).toMatch(/mild/i);
    // 12 = spontaneous(4) + inappropriate_words(3) + localizes_pain(5)
    const twelve = run({ eyeOpening: 'spontaneous', verbalResponse: 'inappropriate_words', motorResponse: 'localizes_pain' });
    expect(twelve.score).toBe(12);
    expect(twelve.riskCategory).toMatch(/moderate/i);
  });

  it('GCS 9 is Moderate; GCS 8 is Severe', () => {
    // 9 = to_pain(2) + inappropriate_words(3) + withdraws_from_pain(4)
    const nine = run({ eyeOpening: 'to_pain', verbalResponse: 'inappropriate_words', motorResponse: 'withdraws_from_pain' }); // 2+3+4=9
    expect(nine.score).toBe(9);
    expect(nine.riskCategory).toMatch(/moderate/i);
    // 8 = to_pain(2) + incomprehensible(2) + withdraws_from_pain(4)
    const eight = run({ eyeOpening: 'to_pain', verbalResponse: 'incomprehensible', motorResponse: 'withdraws_from_pain' }); // 2+2+4=8
    expect(eight.score).toBe(8);
    expect(eight.riskCategory).toMatch(/severe/i);
  });
});

describe('GCS rejection', () => {
  it('rejects a missing component', () => {
    expect(() => run({ eyeOpening: 'spontaneous', verbalResponse: 'oriented' })).toThrow();
  });

  it('rejects an invalid enum value', () => {
    expect(() =>
      run({ eyeOpening: 'blinking', verbalResponse: 'oriented', motorResponse: 'obeys_commands' })
    ).toThrow();
  });
});
