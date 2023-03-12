import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import type { IHandle } from '../../../shared/domain/events/IHandle';
import { CommentVotesChanged } from '../domain/events/commentVotesChanged';
import type { UpdateCommentStats } from '../useCases/comments/updateCommentStats/UpdateCommentStats';
import type { UpdatePostStats } from '../useCases/post/updatePostStats/UpdatePostStats';

export class AfterCommentVotesChanged implements IHandle<CommentVotesChanged> {
  #updatePostStats: UpdatePostStats;
  #updateCommentStats: UpdateCommentStats;

  constructor(
    updatePostStats: UpdatePostStats,
    updateCommentStats: UpdateCommentStats
  ) {
    this.setupSubscriptions();
    this.#updatePostStats = updatePostStats;
    this.#updateCommentStats = updateCommentStats;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      this.#onCommentVotesChanged.bind(this),
      CommentVotesChanged.name
    );
  }

  async #onCommentVotesChanged(event: CommentVotesChanged): Promise<void> {
    try {
      // First, update the comment stats
      await this.#updateCommentStats.execute({
        commentId: event.comment.commentId,
      });
      // Then, update the post stats
      await this.#updatePostStats.execute({
        postId: event.post.postId.id.toString(),
      });
    } catch (err) {
      console.log(err);
      console.log(
        `[AfterCommentVotesChanged]: Failed to update postId={${event.post.postId.id.toString()}}`
      );
    }
  }
}
