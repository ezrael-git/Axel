class Processor {
  constructor (options) {
    this.op = options;
  }

  process (code) {
    code = code.trim().split('\n');
    let processed = [];
    let flag = false;
    // remove unnecessary code
    for (let line of code) {

      if (flag == true) {
        continue;
      }
      else if (line.includes("js")) {
        line = line.replaceAll("js");
        flag = true;
      }
      if (flag == true && line.includes("}")) {
        flag = false;
      }

      processed.push(line);

    }
  }
}
