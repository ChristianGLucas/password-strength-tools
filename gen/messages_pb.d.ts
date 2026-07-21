// package: christiangeorgelucas.password_strength_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class PasswordCheckInput extends jspb.Message {
  getPassword(): string;
  setPassword(value: string): void;

  clearUserInputsList(): void;
  getUserInputsList(): Array<string>;
  setUserInputsList(value: Array<string>): void;
  addUserInputs(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordCheckInput.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordCheckInput): PasswordCheckInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PasswordCheckInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordCheckInput;
  static deserializeBinaryFromReader(message: PasswordCheckInput, reader: jspb.BinaryReader): PasswordCheckInput;
}

export namespace PasswordCheckInput {
  export type AsObject = {
    password: string,
    userInputsList: Array<string>,
  }
}

export class CrackTimeScenario extends jspb.Message {
  getSeconds(): number;
  setSeconds(value: number): void;

  getDisplay(): string;
  setDisplay(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CrackTimeScenario.AsObject;
  static toObject(includeInstance: boolean, msg: CrackTimeScenario): CrackTimeScenario.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CrackTimeScenario, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CrackTimeScenario;
  static deserializeBinaryFromReader(message: CrackTimeScenario, reader: jspb.BinaryReader): CrackTimeScenario;
}

export namespace CrackTimeScenario {
  export type AsObject = {
    seconds: number,
    display: string,
  }
}

export class CrackTimeEstimates extends jspb.Message {
  hasOnlineThrottling100PerHour(): boolean;
  clearOnlineThrottling100PerHour(): void;
  getOnlineThrottling100PerHour(): CrackTimeScenario | undefined;
  setOnlineThrottling100PerHour(value?: CrackTimeScenario): void;

  hasOnlineNoThrottling10PerSecond(): boolean;
  clearOnlineNoThrottling10PerSecond(): void;
  getOnlineNoThrottling10PerSecond(): CrackTimeScenario | undefined;
  setOnlineNoThrottling10PerSecond(value?: CrackTimeScenario): void;

  hasOfflineSlowHashing1e4PerSecond(): boolean;
  clearOfflineSlowHashing1e4PerSecond(): void;
  getOfflineSlowHashing1e4PerSecond(): CrackTimeScenario | undefined;
  setOfflineSlowHashing1e4PerSecond(value?: CrackTimeScenario): void;

  hasOfflineFastHashing1e10PerSecond(): boolean;
  clearOfflineFastHashing1e10PerSecond(): void;
  getOfflineFastHashing1e10PerSecond(): CrackTimeScenario | undefined;
  setOfflineFastHashing1e10PerSecond(value?: CrackTimeScenario): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CrackTimeEstimates.AsObject;
  static toObject(includeInstance: boolean, msg: CrackTimeEstimates): CrackTimeEstimates.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CrackTimeEstimates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CrackTimeEstimates;
  static deserializeBinaryFromReader(message: CrackTimeEstimates, reader: jspb.BinaryReader): CrackTimeEstimates;
}

export namespace CrackTimeEstimates {
  export type AsObject = {
    onlineThrottling100PerHour?: CrackTimeScenario.AsObject,
    onlineNoThrottling10PerSecond?: CrackTimeScenario.AsObject,
    offlineSlowHashing1e4PerSecond?: CrackTimeScenario.AsObject,
    offlineFastHashing1e10PerSecond?: CrackTimeScenario.AsObject,
  }
}

export class PasswordFeedback extends jspb.Message {
  getWarning(): string;
  setWarning(value: string): void;

  clearSuggestionsList(): void;
  getSuggestionsList(): Array<string>;
  setSuggestionsList(value: Array<string>): void;
  addSuggestions(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordFeedback.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordFeedback): PasswordFeedback.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PasswordFeedback, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordFeedback;
  static deserializeBinaryFromReader(message: PasswordFeedback, reader: jspb.BinaryReader): PasswordFeedback;
}

export namespace PasswordFeedback {
  export type AsObject = {
    warning: string,
    suggestionsList: Array<string>,
  }
}

export class MatchedPattern extends jspb.Message {
  getPattern(): string;
  setPattern(value: string): void;

  getStartIndex(): number;
  setStartIndex(value: number): void;

  getEndIndex(): number;
  setEndIndex(value: number): void;

  getToken(): string;
  setToken(value: string): void;

  getGuesses(): number;
  setGuesses(value: number): void;

  getDictionaryName(): string;
  setDictionaryName(value: string): void;

  getRank(): number;
  setRank(value: number): void;

  getL33t(): boolean;
  setL33t(value: boolean): void;

  getReversed(): boolean;
  setReversed(value: boolean): void;

  getSequenceName(): string;
  setSequenceName(value: string): void;

  getAscending(): boolean;
  setAscending(value: boolean): void;

  getRepeatCount(): number;
  setRepeatCount(value: number): void;

  getDateYear(): number;
  setDateYear(value: number): void;

  getDateMonth(): number;
  setDateMonth(value: number): void;

  getDateDay(): number;
  setDateDay(value: number): void;

  getMatchedWord(): string;
  setMatchedWord(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedPattern.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedPattern): MatchedPattern.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedPattern, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedPattern;
  static deserializeBinaryFromReader(message: MatchedPattern, reader: jspb.BinaryReader): MatchedPattern;
}

export namespace MatchedPattern {
  export type AsObject = {
    pattern: string,
    startIndex: number,
    endIndex: number,
    token: string,
    guesses: number,
    dictionaryName: string,
    rank: number,
    l33t: boolean,
    reversed: boolean,
    sequenceName: string,
    ascending: boolean,
    repeatCount: number,
    dateYear: number,
    dateMonth: number,
    dateDay: number,
    matchedWord: string,
  }
}

export class PasswordStrengthReport extends jspb.Message {
  getScore(): number;
  setScore(value: number): void;

  getGuesses(): number;
  setGuesses(value: number): void;

  getGuessesLog10(): number;
  setGuessesLog10(value: number): void;

  hasCrackTimes(): boolean;
  clearCrackTimes(): void;
  getCrackTimes(): CrackTimeEstimates | undefined;
  setCrackTimes(value?: CrackTimeEstimates): void;

  hasFeedback(): boolean;
  clearFeedback(): void;
  getFeedback(): PasswordFeedback | undefined;
  setFeedback(value?: PasswordFeedback): void;

  clearSequenceList(): void;
  getSequenceList(): Array<MatchedPattern>;
  setSequenceList(value: Array<MatchedPattern>): void;
  addSequence(value?: MatchedPattern, index?: number): MatchedPattern;

  getCalcTimeMs(): number;
  setCalcTimeMs(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordStrengthReport.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordStrengthReport): PasswordStrengthReport.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PasswordStrengthReport, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordStrengthReport;
  static deserializeBinaryFromReader(message: PasswordStrengthReport, reader: jspb.BinaryReader): PasswordStrengthReport;
}

export namespace PasswordStrengthReport {
  export type AsObject = {
    score: number,
    guesses: number,
    guessesLog10: number,
    crackTimes?: CrackTimeEstimates.AsObject,
    feedback?: PasswordFeedback.AsObject,
    sequenceList: Array<MatchedPattern.AsObject>,
    calcTimeMs: number,
    error: string,
  }
}

export class PasswordPolicyInput extends jspb.Message {
  getPassword(): string;
  setPassword(value: string): void;

  clearUserInputsList(): void;
  getUserInputsList(): Array<string>;
  setUserInputsList(value: Array<string>): void;
  addUserInputs(value: string, index?: number): string;

  getMinScore(): number;
  setMinScore(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordPolicyInput.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordPolicyInput): PasswordPolicyInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PasswordPolicyInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordPolicyInput;
  static deserializeBinaryFromReader(message: PasswordPolicyInput, reader: jspb.BinaryReader): PasswordPolicyInput;
}

export namespace PasswordPolicyInput {
  export type AsObject = {
    password: string,
    userInputsList: Array<string>,
    minScore: number,
  }
}

export class PasswordPolicyResult extends jspb.Message {
  getMeetsPolicy(): boolean;
  setMeetsPolicy(value: boolean): void;

  getScore(): number;
  setScore(value: number): void;

  getMinScore(): number;
  setMinScore(value: number): void;

  getReason(): string;
  setReason(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PasswordPolicyResult.AsObject;
  static toObject(includeInstance: boolean, msg: PasswordPolicyResult): PasswordPolicyResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PasswordPolicyResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PasswordPolicyResult;
  static deserializeBinaryFromReader(message: PasswordPolicyResult, reader: jspb.BinaryReader): PasswordPolicyResult;
}

export namespace PasswordPolicyResult {
  export type AsObject = {
    meetsPolicy: boolean,
    score: number,
    minScore: number,
    reason: string,
    error: string,
  }
}

