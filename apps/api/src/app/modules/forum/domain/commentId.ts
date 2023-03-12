import { Result } from '../../../shared/core/Result';
import { Entity } from '../../../shared/domain/Entity';
import type { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';

export class CommentId extends Entity<void> {
  public static create(id?: UniqueEntityID): Result<CommentId> {
    return Result.ok<CommentId>(new CommentId(id));
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }
}
