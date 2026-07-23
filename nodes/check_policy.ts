import { PasswordPolicyInput, PasswordPolicyResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkPassword, validateInput } from './zxcvbn_helper';

/**
 * Pass/fail password-policy gate for a signup or password-change form: runs
 * the same zxcvbn analysis as EstimateStrength and compares the resulting
 * score against min_score (0-4), returning one actionable reason instead of
 * the full pattern breakdown. See axiom.yaml for the full registry
 * description.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function checkPolicy(ax: AxiomContext, input: PasswordPolicyInput): Promise<PasswordPolicyResult> {
  const password = input.getPassword();
  const userInputs = input.getUserInputsList();
  const minScore = input.getMinScore();

  const result = new PasswordPolicyResult();
  result.setMinScore(minScore);

  const validationError = validateInput(password);
  if (validationError) {
    result.setError(validationError);
    return result;
  }
  if (minScore < 0 || minScore > 4) {
    result.setError('INVALID_MIN_SCORE');
    return result;
  }

  const zxcvbnResult = checkPassword(password, userInputs);
  result.setScore(zxcvbnResult.score);

  const meetsPolicy = zxcvbnResult.score >= minScore;
  result.setMeetsPolicy(meetsPolicy);

  if (!meetsPolicy) {
    const { warning, suggestions } = zxcvbnResult.feedback;
    result.setReason(warning || suggestions[0] || '');
  }

  return result;
}
