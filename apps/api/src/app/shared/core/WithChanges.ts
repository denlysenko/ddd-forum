/* eslint-disable @typescript-eslint/no-explicit-any */
import { Result } from './Result';

export interface WithChanges {
  readonly changes: Changes;
}

export class Changes {
  #changes: Result<any>[];

  constructor() {
    this.#changes = [];
  }

  public addChange(result: Result<any>): void {
    this.#changes.push(result);
  }

  public getChangeResult(): Result<any> {
    return Result.combine(this.#changes);
  }
}
