import { Result } from '../../../shared/core/Result';
import { Entity } from '../../../shared/domain/Entity';
import type { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

export class MemberId extends Entity<void> {
  static create(id?: UniqueEntityID): Result<MemberId> {
    return Result.ok<MemberId>(new MemberId(id));
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
