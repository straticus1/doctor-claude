import { describe, it, expect } from 'vitest';
import { calculateClinicalScore } from '../../index.js';

// GAD-7 (Spitzer et al., Arch Intern Med 2006): 7 items scored
// not_at_all=0, several_days=1, more_than_half=2, nearly_every_day=3; max 21.
// Severity cut-points: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe.
const KEYS = [
  'nervous',
  'stopWorrying',
  'worryingTooMuch',
  'troubleRelaxing',
  'restless',
  'easilyAnnoyed',
  'feelingAfraid',
] as const;

function all(value: string) {
  return Object.fromEntries(KEYS.map((k) => [k, value]));
}

function run(inputs: object) {
  return calculateClinicalScore({ calculator: 'gad7', inputs } as any);
}

describe('GAD-7 worked examples', () => {
  it('scores 0 (Minimal) when every item is not_at_all', () => {
    const r = run(all('not_at_all'));
    expect(r.score).toBe(0);
    expect(r.maxScore).toBe(21);
    expect(r.riskCategory).toMatch(/minimal/i);
  });

  it('scores the maximum 21 (Severe) when every item is nearly_every_day', () => {
    const r = run(all('nearly_every_day'));
    expect(r.score).toBe(21);
    expect(r.riskCategory).toMatch(/severe/i);
  });
});

describe('GAD-7 boundaries', () => {
  it('a score of exactly 10 is Moderate', () => {
    // three items nearly_every_day (9) + one several_days (1) = 10
    const r = run({
      ...all('not_at_all'),
      nervous: 'nearly_every_day',
      stopWorrying: 'nearly_every_day',
      worryingTooMuch: 'nearly_every_day',
      troubleRelaxing: 'several_days',
    });
    expect(r.score).toBe(10);
    expect(r.riskCategory).toMatch(/moderate/i);
  });

  it('a score of exactly 9 is Mild', () => {
    // three items nearly_every_day = 9
    const r = run({
      ...all('not_at_all'),
      nervous: 'nearly_every_day',
      stopWorrying: 'nearly_every_day',
      worryingTooMuch: 'nearly_every_day',
    });
    expect(r.score).toBe(9);
    expect(r.riskCategory).toMatch(/mild/i);
  });

  it('a score of 5 is Mild and 4 is Minimal (cut-point at 5)', () => {
    // 5 = five items at several_days; 4 = four items at several_days
    const mild = run({
      ...all('not_at_all'),
      nervous: 'several_days',
      stopWorrying: 'several_days',
      worryingTooMuch: 'several_days',
      troubleRelaxing: 'several_days',
      restless: 'several_days',
    });
    expect(mild.score).toBe(5);
    expect(mild.riskCategory).toMatch(/mild/i);

    const minimal = run({
      ...all('not_at_all'),
      nervous: 'several_days',
      stopWorrying: 'several_days',
      worryingTooMuch: 'several_days',
      troubleRelaxing: 'several_days',
    });
    expect(minimal.score).toBe(4);
    expect(minimal.riskCategory).toMatch(/minimal/i);
  });

  it('a score of 15 is Severe (cut-point at 15)', () => {
    // five items nearly_every_day = 15
    const r = run({
      ...all('not_at_all'),
      nervous: 'nearly_every_day',
      stopWorrying: 'nearly_every_day',
      worryingTooMuch: 'nearly_every_day',
      troubleRelaxing: 'nearly_every_day',
      restless: 'nearly_every_day',
    });
    expect(r.score).toBe(15);
    expect(r.riskCategory).toMatch(/severe/i);
  });
});

describe('GAD-7 rejection', () => {
  it('rejects a missing required item', () => {
    const inputs = all('not_at_all');
    delete (inputs as any).feelingAfraid;
    expect(() => run(inputs)).toThrow();
  });

  it('rejects an out-of-enum answer', () => {
    expect(() => run({ ...all('not_at_all'), nervous: 'sometimes' })).toThrow();
  });
});
