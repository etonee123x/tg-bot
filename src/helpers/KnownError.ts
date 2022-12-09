export default class KnownError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
