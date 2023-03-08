export abstract class WatchedList<T> {
  currentItems: T[];
  #initial: T[];
  #new: T[];
  #removed: T[];

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems ? initialItems : [];
    this.#initial = initialItems ? initialItems : [];
    this.#new = [];
    this.#removed = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  getItems(): T[] {
    return this.currentItems;
  }

  getNewItems(): T[] {
    return this.#new;
  }

  getRemovedItems(): T[] {
    return this.#removed;
  }

  exists(item: T): boolean {
    return this.#isCurrentItem(item);
  }

  add(item: T): void {
    if (this.#isRemovedItem(item)) {
      this.#removeFromRemoved(item);
    }

    if (!this.#isNewItem(item) && !this.#wasAddedInitially(item)) {
      this.#new.push(item);
    }

    if (!this.#isCurrentItem(item)) {
      this.currentItems.push(item);
    }
  }

  remove(item: T): void {
    this.#removeFromCurrent(item);

    if (this.#isNewItem(item)) {
      this.#removeFromNew(item);
      return;
    }

    if (!this.#isRemovedItem(item)) {
      this.#removed.push(item);
    }
  }

  #isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    );
  }

  #isNewItem(item: T): boolean {
    return this.#new.filter((v: T) => this.compareItems(item, v)).length !== 0;
  }

  #isRemovedItem(item: T): boolean {
    return (
      this.#removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    );
  }

  #removeFromNew(item: T): void {
    this.#new = this.#new.filter((v) => !this.compareItems(v, item));
  }

  #removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v)
    );
  }

  #removeFromRemoved(item: T): void {
    this.#removed = this.#removed.filter((v) => !this.compareItems(item, v));
  }

  #wasAddedInitially(item: T): boolean {
    return (
      this.#initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    );
  }
}
