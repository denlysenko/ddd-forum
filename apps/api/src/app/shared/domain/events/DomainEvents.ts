/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AggregateRoot } from '../AggregateRoot';
import type { UniqueEntityID } from '../UniqueEntityID';
import type { IDomainEvent } from './IDomainEvent';

export class DomainEvents {
  static #handlersMap = {};
  static #markedAggregates: AggregateRoot<any>[] = [];

  /**
   * @method markAggregateForDispatch
   * @static
   * @desc Called by aggregate root objects that have created domain
   * events to eventually be dispatched when the infrastructure commits
   * the unit of work.
   */

  static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
    const aggregateFound = !!this.#findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.#markedAggregates.push(aggregate);
    }
  }

  static #dispatchAggregateEvents(aggregate: AggregateRoot<any>): void {
    aggregate.domainEvents.forEach((event: IDomainEvent) =>
      this.#dispatch(event)
    );
  }

  static #removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<any>
  ): void {
    const index = this.#markedAggregates.findIndex((a) => a.equals(aggregate));
    this.#markedAggregates.splice(index, 1);
  }

  static #findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> {
    let found: AggregateRoot<any> = null;

    for (const aggregate of this.#markedAggregates) {
      if (aggregate.id.equals(id)) {
        found = aggregate;
      }
    }

    return found;
  }

  static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = this.#findMarkedAggregateByID(id);

    if (aggregate) {
      this.#dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.#removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  static register(
    callback: (event: IDomainEvent) => void,
    eventClassName: string
  ): void {
    // eslint-disable-next-line no-prototype-builtins
    if (!this.#handlersMap.hasOwnProperty(eventClassName)) {
      this.#handlersMap[eventClassName] = [];
    }

    this.#handlersMap[eventClassName].push(callback);
  }

  static clearHandlers(): void {
    this.#handlersMap = {};
  }

  static clearMarkedAggregates(): void {
    this.#markedAggregates = [];
  }

  static #dispatch(event: IDomainEvent): void {
    const eventClassName: string = event.constructor.name;

    // eslint-disable-next-line no-prototype-builtins
    if (this.#handlersMap.hasOwnProperty(eventClassName)) {
      const handlers: any[] = this.#handlersMap[eventClassName];
      for (const handler of handlers) {
        handler(event);
      }
    }
  }
}
