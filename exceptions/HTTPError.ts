export default class HTTPError {
  msg: string;
  code: number;

  constructor(msg: string, code: number) {
    this.msg = msg;
    this.code = code;
  }
}
