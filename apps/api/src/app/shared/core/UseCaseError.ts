interface IUseCaseError {
  readonly message: string;
}

export abstract class UseCaseError implements IUseCaseError {
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
