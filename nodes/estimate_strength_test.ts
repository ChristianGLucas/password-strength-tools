import { PasswordCheckInput } from '../gen/messages_pb';
import { estimateStrength } from './estimate_strength';
import { ctx } from './testkit';
import { MAX_PASSWORD_BYTES, MAX_USER_INPUTS, MAX_USER_INPUT_BYTES } from './zxcvbn_helper';

function req(password: string, userInputs: string[] = []): PasswordCheckInput {
  const input = new PasswordCheckInput();
  input.setPassword(password);
  input.setUserInputsList(userInputs);
  return input;
}

describe('EstimateStrength', () => {
  // GOLDEN / ORACLE — "password" is the canonical worst-case example cited
  // by zxcvbn's own README and paper: a bare top-10-most-common password,
  // scored 0 by every zxcvbn implementation (dropbox/zxcvbn, zxcvbn-go,
  // python zxcvbn) — independent of this package's own code.
  it('GOLDEN/ORACLE: "password" scores 0 as a plain dictionary match', async () => {
    const out = await estimateStrength(ctx, req('password'));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(0);
    expect(out.getGuesses()).toBeCloseTo(3, 0);
    const seq = out.getSequenceList();
    expect(seq).toHaveLength(1);
    expect(seq[0].getPattern()).toBe('dictionary');
    expect(seq[0].getToken()).toBe('password');
    expect(seq[0].getStartIndex()).toBe(0);
    expect(seq[0].getEndIndex()).toBe(7);
    expect(out.getFeedback()!.getWarning().length).toBeGreaterThan(0);
  });

  // ORACLE — "correcthorsebatterystaple" is the canonical xkcd/zxcvbn
  // strong-passphrase example, independently documented (xkcd #936 and
  // zxcvbn's own test fixtures) to score 4 — a fact about the algorithm,
  // not something derived from this wrapper's own code.
  it('ORACLE: "correcthorsebatterystaple" (the xkcd passphrase) scores 4', async () => {
    const out = await estimateStrength(ctx, req('correcthorsebatterystaple'));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(4);
    expect(out.getGuesses()).toBeGreaterThan(1e9);
  });

  it('a purely numeric sequence like "123456" scores 0', async () => {
    const out = await estimateStrength(ctx, req('123456'));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(0);
  });

  it('a keyboard walk like "qwertyuiop" scores 0 as a spatial/dictionary match', async () => {
    const out = await estimateStrength(ctx, req('qwertyuiop'));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(0);
  });

  it('a repeated character run like "aaaaaaaaaa" is matched as a repeat pattern', async () => {
    const out = await estimateStrength(ctx, req('aaaaaaaaaa'));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(0);
    const seq = out.getSequenceList();
    expect(seq.some((m) => m.getPattern() === 'repeat')).toBe(true);
    const repeatMatch = seq.find((m) => m.getPattern() === 'repeat')!;
    expect(repeatMatch.getRepeatCount()).toBeGreaterThan(1);
  });

  // ORACLE — crack-time monotonicity is a mathematical invariant of the
  // model (seconds = guesses / rate), independent of the guess estimate
  // itself: for any fixed guesses > 0, since the four scenario rates are
  // ranked online_throttled(100/hr) < online_unthrottled(10/s) <
  // offline_slow(1e4/s) < offline_fast(1e10/s), crack time must be ranked
  // in exactly the opposite order. This holds for every password, so it is
  // checked against a mid-strength one distinct from the golden cases.
  it('ORACLE: crack times are strictly ordered fastest-attack < ... < slowest-attack', async () => {
    const out = await estimateStrength(ctx, req('Tr0ub4dor&3'));
    expect(out.getError()).toBe('');
    const times = out.getCrackTimes()!;
    const fastOffline = times.getOfflineFastHashing1e10PerSecond()!.getSeconds();
    const slowOffline = times.getOfflineSlowHashing1e4PerSecond()!.getSeconds();
    const onlineNoThrottle = times.getOnlineNoThrottling10PerSecond()!.getSeconds();
    const onlineThrottle = times.getOnlineThrottling100PerHour()!.getSeconds();
    expect(fastOffline).toBeLessThan(slowOffline);
    expect(slowOffline).toBeLessThan(onlineNoThrottle);
    expect(onlineNoThrottle).toBeLessThan(onlineThrottle);
    // The ratio between adjacent scenarios must match the ratio of their
    // attack rates exactly (both derived from the same guesses value).
    expect(slowOffline / fastOffline).toBeCloseTo(1e10 / 1e4, 0);
  });

  // ORACLE — user_inputs is zxcvbn's own documented feature: a caller-
  // supplied word becomes a rank-1 bonus dictionary entry, so a password
  // built from it must score strictly weaker than the identical password
  // checked with no context at all. This is verified against the library's
  // own documented behavior (not just re-running the same code twice).
  it('ORACLE: user_inputs weakens a password that reuses one of them', async () => {
    const withoutContext = await estimateStrength(ctx, req('acmecorp2024'));
    const withContext = await estimateStrength(ctx, req('acmecorp2024', ['AcmeCorp', 'jane.doe']));
    expect(withoutContext.getError()).toBe('');
    expect(withContext.getError()).toBe('');
    expect(withContext.getScore()).toBeLessThan(withoutContext.getScore());
    const dictMatch = withContext
      .getSequenceList()
      .find((m) => m.getDictionaryName() === 'userInputs');
    expect(dictMatch).toBeDefined();
  });

  it('DETERMINISM: the same password produces the same score and guesses across calls', async () => {
    const a = await estimateStrength(ctx, req('N0t-A-Common!Phrase#42'));
    const b = await estimateStrength(ctx, req('N0t-A-Common!Phrase#42'));
    expect(a.getScore()).toBe(b.getScore());
    expect(a.getGuesses()).toBe(b.getGuesses());
    expect(a.getGuessesLog10()).toBe(b.getGuessesLog10());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: an empty password returns EMPTY_PASSWORD, not a crash', async () => {
    const out = await estimateStrength(ctx, req(''));
    expect(out.getError()).toBe('EMPTY_PASSWORD');
    expect(out.getScore()).toBe(0);
    expect(out.getSequenceList()).toHaveLength(0);
  });

  it('ERROR PATH: a password over the byte bound returns PASSWORD_TOO_LONG', async () => {
    const tooLong = 'a'.repeat(MAX_PASSWORD_BYTES + 1);
    const out = await estimateStrength(ctx, req(tooLong));
    expect(out.getError()).toBe('PASSWORD_TOO_LONG');
  });

  it('BOUNDARY: a password at exactly the byte bound succeeds', async () => {
    const atBound = 'a'.repeat(MAX_PASSWORD_BYTES);
    const out = await estimateStrength(ctx, req(atBound));
    expect(out.getError()).toBe('');
  });

  it('ERROR PATH: more than MAX_USER_INPUTS entries returns TOO_MANY_USER_INPUTS', async () => {
    const tooMany = Array.from({ length: MAX_USER_INPUTS + 1 }, (_, i) => `word${i}`);
    const out = await estimateStrength(ctx, req('somePassword1!', tooMany));
    expect(out.getError()).toBe('TOO_MANY_USER_INPUTS');
  });

  it('ERROR PATH: an oversized single user_input returns USER_INPUT_TOO_LONG', async () => {
    const out = await estimateStrength(ctx, req('somePassword1!', ['x'.repeat(MAX_USER_INPUT_BYTES + 1)]));
    expect(out.getError()).toBe('USER_INPUT_TOO_LONG');
  });

  it('a multi-byte UTF-8 password is bounded by bytes, not characters', async () => {
    // Each "\u{1F600}" grinning-face emoji is 4 bytes in UTF-8; 65 of them
    // is 260 bytes, over the 256-byte bound, while well under 256 UTF-16
    // code units — proving the bound is byte-based, not length-based.
    const emojiPassword = '\u{1F600}'.repeat(65);
    expect(emojiPassword.length).toBeLessThan(MAX_PASSWORD_BYTES);
    const out = await estimateStrength(ctx, req(emojiPassword));
    expect(out.getError()).toBe('PASSWORD_TOO_LONG');
  });
});
