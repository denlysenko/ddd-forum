interface ValueObjectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [index: string]: any;
}

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structrual property.
 */

export abstract class ValueObject<T extends ValueObjectProps> {
  props: T;

  constructor(props: T) {
    const baseProps = {
      ...props,
    };

    this.props = baseProps;
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
