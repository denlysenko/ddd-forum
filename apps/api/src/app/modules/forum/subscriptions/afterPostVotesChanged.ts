import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import type { IHandle } from '../../../shared/domain/events/IHandle';
import type { CommentVotesChanged } from '../domain/events/commentVotesChanged';
import { PostVotesChanged } from '../domain/events/postVotesChanged';
import type { PostId } from '../domain/postId';
import type { UpdatePostStats } from '../useCases/post/updatePostStats/UpdatePostStats';

export class AfterPostVotesChanged implements IHandle<PostVotesChanged> {
  #updatePostStats: UpdatePostStats;

  constructor(updatePostStats: UpdatePostStats) {
    this.setupSubscriptions();
    this.#updatePostStats = updatePostStats;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      this.#onPostVotesChanged.bind(this),
      PostVotesChanged.name
    );
  }

  async #onPostVotesChanged(event: CommentVotesChanged): Promise<void> {
    const postId: PostId = event.post.postId;

    try {
      // Then, update the post stats
      await this.#updatePostStats.execute({ postId: postId.id.toString() });
      console.log(
        `[AfterPostVotesChanged]: Updated votes on postId={${postId.id.toString()}}`
      );
    } catch (err) {
      console.log(err);
      console.log(
        `[AfterPostVotesChanged]: Failed to update votes on postId={${postId.id.toString()}}`
      );
    }
  }
}
