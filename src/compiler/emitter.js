// executor / collector / emitter

module.exports = class Emitter {
  constructor (in_it="") {
    this.parsed = "";
    this.retlog = [];
  }

  add (n) {
    this.parsed += n + "\n";
  }

  eval () {
    // runtime variables
    let emit = this.parsed;
    let retlog = this.retlog;

    let retcode = eval(this.parsed);
    this.retlog.push(retcode);

    console.log("Axel main.js at 0");
    console.log("return: " + retcode);
  }
}
