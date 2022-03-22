// Represents an error with an HTTP status code thrown by an api controller
export default class HTTPError {
  msg: string;
  code: number;

  constructor(msg: string, code: number) {
    this.msg = msg;
    this.code = code;
  }
}
