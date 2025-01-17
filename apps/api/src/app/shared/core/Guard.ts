/* eslint-disable @typescript-eslint/no-explicit-any */
export type GuardResponse = string;

import { Result } from './Result';

export interface IGuardArgument {
  readonly argument: any;
  readonly argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  static combine(guardResults: Result<any>[]): Result<GuardResponse> {
    for (const result of guardResults) {
      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  static greaterThan(
    minValue: number,
    actualValue: number
  ): Result<GuardResponse> {
    return actualValue > minValue
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `Number given {${actualValue}} is not greater than {${minValue}}`
        );
  }

  static againstAtLeast(
    numChars: number,
    text: string,
    argumentName?: string
  ): Result<GuardResponse> {
    return text.length >= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName ?? 'Text'} is not at least ${numChars} chars.`
        );
  }

  static againstAtMost(
    numChars: number,
    text: string,
    argumentName?: string
  ): Result<GuardResponse> {
    return text.length <= numChars
      ? Result.ok<GuardResponse>()
      : Result.fail<GuardResponse>(
          `${argumentName ?? 'Text'} is greater than ${numChars} chars.`
        );
  }

  static againstNullOrUndefined(
    argument: any,
    argumentName: string
  ): Result<GuardResponse> {
    if (argument === null || argument === undefined) {
      return Result.fail<GuardResponse>(`${argumentName} is null or undefined`);
    }

    return Result.ok<GuardResponse>();
  }

  static againstNullOrUndefinedBulk(
    args: GuardArgumentCollection
  ): Result<GuardResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName
      );

      if (result.isFailure) return result;
    }

    return Result.ok<GuardResponse>();
  }

  static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string
  ): Result<GuardResponse> {
    let isValid = false;

    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return Result.ok<GuardResponse>();
    }

    return Result.fail<GuardResponse>(
      `${argumentName} isn't oneOf the correct types in ${JSON.stringify(
        validValues
      )}. Got "${value}".`
    );
  }

  static inRange(
    num: number,
    min: number,
    max: number,
    argumentName: string
  ): Result<GuardResponse> {
    const isInRange = num >= min && num <= max;

    if (!isInRange) {
      return Result.fail<GuardResponse>(
        `${argumentName} is not within range ${min} to ${max}.`
      );
    }

    return Result.ok<GuardResponse>();
  }

  static allInRange(
    numbers: number[],
    min: number,
    max: number,
    argumentName: string
  ): Result<GuardResponse> {
    let failingResult: Result<GuardResponse> = null;

    for (const num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return Result.fail<GuardResponse>(
        `${argumentName} is not within the range.`
      );
    }

    return Result.ok<GuardResponse>();
  }
}
