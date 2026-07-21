import { PasswordCheckInput, PasswordStrengthReport } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  checkPassword,
  toCrackTimeEstimates,
  toFeedback,
  toMatchedPatterns,
  validateInput,
} from './zxcvbn_helper';

/**
 * Full zxcvbn strength report for one password: a 0-4 score, the estimated
 * total guesses (and its log10), crack-time estimates across four attack
 * scenarios (online throttled, online unthrottled, offline slow-hash,
 * offline fast-hash), actionable feedback, and the ordered sequence of
 * matched patterns the score was built from. See axiom.yaml for the full
 * registry description.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export async function estimateStrength(ax: AxiomContext, input: PasswordCheckInput): Promise<PasswordStrengthReport> {
  const password = input.getPassword();
  const userInputs = input.getUserInputsList();

  const validationError = validateInput(password, userInputs);
  if (validationError) {
    const report = new PasswordStrengthReport();
    report.setError(validationError);
    return report;
  }

  const result = checkPassword(password, userInputs);

  const report = new PasswordStrengthReport();
  report.setScore(result.score);
  report.setGuesses(result.guesses);
  report.setGuessesLog10(result.guessesLog10);
  report.setCrackTimes(toCrackTimeEstimates(result));
  report.setFeedback(toFeedback(result));
  report.setSequenceList(toMatchedPatterns(result));
  report.setCalcTimeMs(result.calcTime);
  return report;
}
