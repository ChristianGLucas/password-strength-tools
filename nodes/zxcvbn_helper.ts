// Shared helper for both nodes: engine setup (loaded once, at module init, so
// dictionaries are compiled a single time per cold start — not per request)
// and the mapping from zxcvbn-ts's plain result object into the generated
// protobuf message types.
//
// This module never logs, transmits, or persists a password — it is passed
// straight into zxcvbn-ts's in-memory computation and the result is mapped
// into the response message.

import { ZxcvbnFactory, OptionsType, ZxcvbnResult } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import {
  CrackTimeEstimates,
  CrackTimeScenario,
  MatchedPattern,
  PasswordFeedback,
} from '../gen/messages_pb';

export type ValidationErrorToken = 'EMPTY_PASSWORD';

const options: OptionsType = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
};

// Built once per process; zxcvbn-ts's own recommended setup (see its README)
// — the ZxcvbnFactory constructor eagerly ranks every dictionary, so
// reusing one instance across invocations avoids redoing that work per call.
const zxcvbnEngine = new ZxcvbnFactory(options);

// The only domain-invalid input: an empty password has no strength to
// estimate. Everything else about size/resource cost is the platform's
// concern, not this node's.
export function validateInput(password: string): ValidationErrorToken | null {
  if (!password) {
    return 'EMPTY_PASSWORD';
  }
  return null;
}

export function checkPassword(password: string, userInputs: string[]): ZxcvbnResult {
  return zxcvbnEngine.check(password, userInputs);
}

function toCrackTimeScenario(seconds: number, display: string): CrackTimeScenario {
  const scenario = new CrackTimeScenario();
  scenario.setSeconds(seconds);
  scenario.setDisplay(display);
  return scenario;
}

export function toCrackTimeEstimates(result: ZxcvbnResult): CrackTimeEstimates {
  const estimates = new CrackTimeEstimates();
  const times = result.crackTimes;
  estimates.setOnlineThrottling100PerHour(
    toCrackTimeScenario(
      times.onlineThrottlingXPerHour.seconds,
      times.onlineThrottlingXPerHour.display,
    ),
  );
  estimates.setOnlineNoThrottling10PerSecond(
    toCrackTimeScenario(
      times.onlineNoThrottlingXPerSecond.seconds,
      times.onlineNoThrottlingXPerSecond.display,
    ),
  );
  estimates.setOfflineSlowHashing1e4PerSecond(
    toCrackTimeScenario(
      times.offlineSlowHashingXPerSecond.seconds,
      times.offlineSlowHashingXPerSecond.display,
    ),
  );
  estimates.setOfflineFastHashing1e10PerSecond(
    toCrackTimeScenario(
      times.offlineFastHashingXPerSecond.seconds,
      times.offlineFastHashingXPerSecond.display,
    ),
  );
  return estimates;
}

export function toFeedback(result: ZxcvbnResult): PasswordFeedback {
  const feedback = new PasswordFeedback();
  feedback.setWarning(result.feedback.warning ?? '');
  feedback.setSuggestionsList(result.feedback.suggestions ?? []);
  return feedback;
}

export function toMatchedPatterns(result: ZxcvbnResult): MatchedPattern[] {
  return result.sequence.map((match) => {
    // The union of possible match shapes (dictionary/spatial/repeat/
    // sequence/date/regex/bruteforce/separator/wordSequence) is only
    // distinguished at runtime by `pattern` — read the pattern-specific
    // extras defensively rather than narrowing the type.
    const m = match as unknown as Record<string, unknown>;
    const out = new MatchedPattern();
    out.setPattern(String(m.pattern ?? ''));
    out.setStartIndex(Number(m.i ?? 0));
    out.setEndIndex(Number(m.j ?? 0));
    out.setToken(String(m.token ?? ''));
    out.setGuesses(Number(m.guesses ?? 0));
    if (typeof m.dictionaryName === 'string') out.setDictionaryName(m.dictionaryName);
    if (typeof m.rank === 'number') out.setRank(m.rank);
    if (typeof m.l33t === 'boolean') out.setL33t(m.l33t);
    if (typeof m.reversed === 'boolean') out.setReversed(m.reversed);
    if (typeof m.matchedWord === 'string') out.setMatchedWord(m.matchedWord);
    if (typeof m.sequenceName === 'string') out.setSequenceName(m.sequenceName);
    if (typeof m.ascending === 'boolean') out.setAscending(m.ascending);
    if (typeof m.repeatCount === 'number') out.setRepeatCount(m.repeatCount);
    if (typeof m.year === 'number') out.setDateYear(m.year);
    if (typeof m.month === 'number') out.setDateMonth(m.month);
    if (typeof m.day === 'number') out.setDateDay(m.day);
    return out;
  });
}
