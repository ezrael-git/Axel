module.exports = class Preprocessor {
  constructor (options={"collect_garbage":true, "remove_comments":true, "host":true}) {
    this.options = options;
  }

  collect_garbage (stats) {
    /*
    Clean all unused variables, functions and classes, before compile-time.
    This slightly improves compiling speed, as the compiler doesn't have to deal with useless let/imm/fn/cls declarations.
    */
    let fmtd = [];
    for (let stat of stats) {

      if (stat.includes("def") || stat.includes("imm") || stat.includes("fn") || stat.includes("cls")) {
        let ob_name = stat.split(' ')[1];
        for (let stat_ of stats) {
          if (stat_.includes(ob_name)) {
            fmtd.push(stat);
          }
        }
      } else {
        fmtd.push(stat);
      }

    }
    return fmtd;
  }

  remove_comments (stats) {
    let fmtd = [];
    for (let stat of stats) {
      if (!stat.startsWith("!")) {
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

  scan_functions (stats) {
    let objs = [];
    let flag = false;
    for (let stat of stats) {
      if (stat.startsWith("fn")) {
        objs.push(stat);
        flag = true;
      }
      else if (flag == true) {
        objs.push(stat);
      }
      if (stat == "end") {
        objs.push(stat);
        flag = false;
      }
    }
    return objs;
  }


  host (stats) {
    let manipulated = [];
    let vars = this.scan_variables(stats);
    let functions = this.scan_functions(stats);
    for (let name of vars) {
      let value = vars[name];
      manipulated.push(`let ${name} = ${value}`);
    }
    for (let line of functions) {
      manipulated.push(line);
    }
    for (let stat of stats) {
      if (!stat.startsWith("def") && !stat.startsWith("imm") && !stat.startsWith("fn")) {
        manipulated.push(stat);
      }
    }
    return manipulated;
  }


  process (code) {
    /*
    Interface
    */
    let op = this.options;
    let fm = code;
    if (op["collect_garbage"] == true) {
      fm = this.collect_garbage(fm);
    }
    if (op["remove_comments"] == true) {
      fm = this.remove_comments(fm);
    }
    if (op["host"] == true) {
      fm = this.host(fm);
    }

    return fm;
  }
}
