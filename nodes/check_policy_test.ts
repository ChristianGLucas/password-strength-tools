import { PasswordPolicyInput } from '../gen/messages_pb';
import { checkPolicy } from './check_policy';
import { ctx } from './testkit';
import { MAX_PASSWORD_BYTES } from './zxcvbn_helper';

function req(password: string, minScore: number, userInputs: string[] = []): PasswordPolicyInput {
  const input = new PasswordPolicyInput();
  input.setPassword(password);
  input.setUserInputsList(userInputs);
  input.setMinScore(minScore);
  return input;
}

describe('CheckPolicy', () => {
  // GOLDEN/ORACLE — "password" is zxcvbn's own canonical score-0 example
  // (see EstimateStrength's test); any positive min_score must reject it.
  it('GOLDEN/ORACLE: "password" fails a min_score of 3 with a non-empty reason', async () => {
    const out = await checkPolicy(ctx, req('password', 3));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(0);
    expect(out.getMinScore()).toBe(3);
    expect(out.getMeetsPolicy()).toBe(false);
    expect(out.getReason().length).toBeGreaterThan(0);
  });

  // ORACLE — "correcthorsebatterystaple" is zxcvbn's own canonical score-4
  // example; it must meet even the strictest policy (min_score 4) with no
  // reason given, since meeting the policy needs no explanation.
  it('ORACLE: "correcthorsebatterystaple" meets the strictest policy (min_score 4)', async () => {
    const out = await checkPolicy(ctx, req('correcthorsebatterystaple', 4));
    expect(out.getError()).toBe('');
    expect(out.getScore()).toBe(4);
    expect(out.getMeetsPolicy()).toBe(true);
    expect(out.getReason()).toBe('');
  });

  it('a min_score of 0 accepts every password, even the weakest', async () => {
    const out = await checkPolicy(ctx, req('password', 0));
    expect(out.getError()).toBe('');
    expect(out.getMeetsPolicy()).toBe(true);
  });

  // ORACLE — meets_policy is exactly the boolean (score >= min_score); this
  // checks the boundary is inclusive rather than off-by-one in either
  // direction, against a password independently known to score 0.
  it('meets_policy is the score >= min_score boundary, inclusive', async () => {
    const exact = await checkPolicy(ctx, req('123456', 0));
    expect(exact.getScore()).toBe(0);
    expect(exact.getMeetsPolicy()).toBe(true); // 0 >= 0
    const oneAbove = await checkPolicy(ctx, req('123456', 1));
    expect(oneAbove.getMeetsPolicy()).toBe(false); // 0 >= 1 is false
  });

  it('DETERMINISM: repeated calls with the same input agree', async () => {
    const a = await checkPolicy(ctx, req('Sup3r$ecure!Passphrase#7', 3));
    const b = await checkPolicy(ctx, req('Sup3r$ecure!Passphrase#7', 3));
    expect(a.getMeetsPolicy()).toBe(b.getMeetsPolicy());
    expect(a.getScore()).toBe(b.getScore());
  });

  // ── Error path ─────────────────────────────────────────────────────────

  it('ERROR PATH: an empty password returns EMPTY_PASSWORD, not a crash', async () => {
    const out = await checkPolicy(ctx, req('', 3));
    expect(out.getError()).toBe('EMPTY_PASSWORD');
    expect(out.getMeetsPolicy()).toBe(false);
  });

  it('ERROR PATH: an over-bound password returns PASSWORD_TOO_LONG', async () => {
    const out = await checkPolicy(ctx, req('a'.repeat(MAX_PASSWORD_BYTES + 1), 3));
    expect(out.getError()).toBe('PASSWORD_TOO_LONG');
  });

  it('ERROR PATH: min_score above 4 returns INVALID_MIN_SCORE', async () => {
    const out = await checkPolicy(ctx, req('SomeReasonable#Passphrase9', 5));
    expect(out.getError()).toBe('INVALID_MIN_SCORE');
  });

  it('ERROR PATH: a negative min_score returns INVALID_MIN_SCORE', async () => {
    const out = await checkPolicy(ctx, req('SomeReasonable#Passphrase9', -1));
    expect(out.getError()).toBe('INVALID_MIN_SCORE');
  });
});
