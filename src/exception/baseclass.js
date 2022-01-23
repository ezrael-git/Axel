module.exports = class Error {

  constructor (pos_start, pos_end, error_name, details) {
    this.pos_start = pos_start;
    this.pos_end = pos_end;
    this.error_name = error_name;
    this.details = details;
  }

  as_string () {
    let result  = `${this.error_name}: ${this.details}\n`;
    result += `File ${self.pos_start.fn}, line ${this.pos_start.ln + 1}`;
    result += '\n\n' + string_with_arrows(this.pos_start.ftxt, this.pos_start, this.pos_end);
    return result;
  }

}
