export class VesperaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VesperaError';
  }
}
