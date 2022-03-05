module.exports = class BaseError {

  constructor (line, message, pos_start, pos_end) {
    this.line = line;
    this.message = message;
    this.pos_start = pos_start;
    this.pos_end = pos_end;
  }

  toString () {
    return `At line ${this.line}(${this.pos_start}:${this.pos_end}:\n${this.message}`
  }

}
