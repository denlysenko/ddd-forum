import { Result } from '../../../shared/core/Result';
import { Entity } from '../../../shared/domain/Entity';
import type { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

export class PostId extends Entity<void> {
  static create(id?: UniqueEntityID): Result<PostId> {
    return Result.ok<PostId>(new PostId(id));
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
