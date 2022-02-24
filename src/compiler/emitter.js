// executor / collector / emitter
let fs = require("fs");

module.exports = class Emitter {
  constructor (script={}, stdblib=true) {
    this.parsed = "";
    if (stdblib == true) {
      let data = fs.readFileSync("../standard/stdblib.ax");
      this.parsed = data
    }
    this.retlog = [];
    this.script = script;
  }

  add (n) {
    this.parsed += n + "\n";
  }

  eval () {
    // runtime variables
    let emit = this.parsed;
    let retlog = this.retlog;
    let script = this.script;

    let retcode = eval(this.parsed);
    this.retlog.push(retcode);

    console.log("Axel main.js at 0");
    console.log("return: " + retcode);

    return retcode
  }
}
