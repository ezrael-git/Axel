module.exports = class Preprocessor {
  constructor () {
  }


  remove_comments (stats) {
    let fmtd = [];
    for (let stat of stats) {
      if (!stat.startsWith("--")) {
        fmtd.push(stat);
      }
    }
    return fmtd;
  }

  scan_variables (stats) {
    let objs = {};
    for (let stat of stats) {
      if (stat.startsWith("def") || stat.startsWith("imm")) {
        let name = stat.split(' ')[1];
        let value = stat.replace("def " + name, "").replace("imm " + name, "").replace(" = ", "");
        objs[name] = value;
      }
    }
    return objs;
  }


  host (stats) {
    let manipulated = [];
    let vars = this.scan_variables(stats);
    for (let name in vars) {
      let value = vars[name];
      manipulated.push(`let ${name} = ${value}`);
    }
    for (let stat of stats) {
      if (!stat.startsWith("def") && !stat.startsWith("imm")) {
        manipulated.push(stat);
      }
    }
    return manipulated;
  }


  process (code) {
    /*
    Interface
    */
    let fm = code;
    fm = this.remove_comments(fm);
    fm = this.host(fm);

    return fm;
  }
}
