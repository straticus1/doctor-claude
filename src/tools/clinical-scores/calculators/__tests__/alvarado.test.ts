import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// Alvarado score (Alvarado A, Ann Emerg Med 1986) — MANTRELS mnemonic, max 10:
//   Migration of pain (1), Anorexia (1), Nausea/vomiting (1),
//   Tenderness RLQ (2), Rebound tenderness (1), Elevated temperature (1),
//   Leukocytosis (2), Shift of WBC to the left (1).
// Tenderness RLQ and Leukocytosis are the two 2-point items.
// (The schema also carries an rlqPain flag; it is NOT a scored MANTRELS
// component and must not contribute points.)
const allFalse = {
  migrationPain: false,
  anorexia: false,
  nauseaVomiting: false,
  rlqPain: false,
  rlqTenderness: false,
  reboundTenderness: false,
  elevatedTemperature: false,
  leukocytosis: false,
  leftShift: false,
};

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'alvarado', inputs } as any);
}

describe('Alvarado worked examples', () => {
  it('scores 0 when every component is absent', () => {
    const r = run(allFalse);
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(10);
  });

  it('scores the maximum 10 when every MANTRELS component is present', () => {
    const r = run({
      migrationPain: true,
      anorexia: true,
      nauseaVomiting: true,
      rlqPain: true,
      rlqTenderness: true,
      reboundTenderness: true,
      elevatedTemperature: true,
      leukocytosis: true,
      leftShift: true,
    });
    expect(r.score).toBe(10);
  });

  it('scores 7 (intermediate) for a classic presentation', () => {
    // migration(1) + anorexia(1) + RLQ tenderness(2) + rebound(1) + leukocytosis(2) = 7
    const r = run({
      ...allFalse,
      migrationPain: true,
      anorexia: true,
      rlqTenderness: true,
      reboundTenderness: true,
      leukocytosis: true,
    });
    expect(r.score).toBe(7);
  });
});

describe('Alvarado boundaries', () => {
  it('RLQ tenderness contributes exactly 2 points', () => {
    expect(run({ ...allFalse, rlqTenderness: true }).score).toBe(2);
  });

  it('leukocytosis contributes exactly 2 points', () => {
    expect(run({ ...allFalse, leukocytosis: true }).score).toBe(2);
  });

  it('each single-point item contributes exactly 1 point', () => {
    for (const key of [
      'migrationPain',
      'anorexia',
      'nauseaVomiting',
      'reboundTenderness',
      'elevatedTemperature',
      'leftShift',
    ]) {
      expect(run({ ...allFalse, [key]: true }).score).toBe(1);
    }
  });

  it('rlqPain is not a scored MANTRELS component', () => {
    expect(run({ ...allFalse, rlqPain: true }).score).toBe(0);
  });
});

describe('Alvarado rejection', () => {
  it('rejects a missing required field', () => {
    const { leukocytosis, ...missing } = allFalse;
    expect(() => run(missing)).toThrow();
  });

  it('rejects a wrong-typed field', () => {
    expect(() => run({ ...allFalse, rlqTenderness: 'severe' })).toThrow();
  });
});
