module.exports = class Preprocessor {
  constructor (options) {
    this.op = options;
  }

  literal_replace (a) {
    let rep = {
      "@": "this.",
      "&": "{",
      "#": "}"
    }
    for (let k in rep) {
      let v = rep[k];
      let starting = false;
      for (let char of a) {
        if (["'", '"'].includes(char) && starting == false) {
          starting = true;
        }
        else if (["'", '"'].includes(char) && starting == true) {
          starting = false;
        }
        else if (char == k && starting == false) {
          a = a.split("");
          a[a.indexOf(char)] = v;
          a = a.join("");
        }
      }
    }
    return a;
  }

  identify_macros (stats) {
    /*
    Identify the macros in a list of statements.
    */
    let elem = 0;
    let macros = [];
    let flag = false;
    for (let line of stats) {
      elem += 1;
      if (line.includes("+++")) {
        if (flag == false) {
          flag = true;
        } else {
          flag = false;
        }
      }
      if (flag == true) {
        macros.push(line);
      }
    }
    let prepr = [];
    for (let macro of macros) {
      prepr.push(macro.replaceAll("+++", ""));
    }
    return prepr;
  }

  process_macros (macros) {
    /*
    Process and execute macros from a list of macros.
    */
    let newlined = macros.join('\n');
    eval(newlined);
  }

  cleanse_macros (stats) {
    /*
    Remove all macros from a list of statements.
    */
    let compiled_stats = [];
    let flag = true;
    for (let stat of stats) {
      if (stats.includes("+++")) {
        if (flag == true) {
          flag = false;
        } else {
          flag = true;
        }
      }
      if (flag == true) {
        compiled_stats.push(stat);
      }
    }
    return compiled_stats;
  }

  get_functions (stats) {
    /*
    Get names of all functions in a list of statements of Axel code.
    */
    let functions = [];
    for (line of stats) {
      if (line.startsWith("fn ")) {
        line = line.replace("fn ", "");
        let name = "";
        for (char of line) {
          if (char == " " || char == "(") {
            break;
          }
          name += char;
        }
        functions.push(name);
      }
    }
    return functions;
  }

  get_classes (stats) {
    /*
    Get names of all classes in a list of statements of Axel code.
    */
    let classes = [];
    for (let line of stats) {
      if (line.startsWith("cls ")) {
        line = line.replace("cls ", "");
        let name = "";
        for (let char of line) {
          if (char == " " || char == "(") {
            break;
          }
          name += char;
        }
        classes.push(name);
      }
    }
    return classes;
  }


  do_some_replacing (stdlib, code) {
    /*
    Replace the placeholding terms in the stdlib to contain information.
    */
    let n = [];
    let functions = this.get_functions(code);
    let classes = this.get_classes(code);
    for (line of stdblib) {
      line = line.replaceAll("__functions__", functions);
      line = line.replacrAll("__classes__", classes);
      n.push(line);
    }
    return n;
  }

  process (code) {
    let l = this.literal_replace(code);
    return l;
  }
}
