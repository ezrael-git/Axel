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


  get (dec_syntax, stats) {
    /*
    Get names of all `obj`s in a list of statements of Axel code.
    The `obj`s to get are defined by the `dec_syntax` argument. For example, if you need all functions in an Axel program you can do `get("fn", statements)`
    */
    let objs = [];
    for (let line of stats) {
      if (line.startsWith(dec_syntax)) {
        classes.push(line.split(' ')[1]);
      }
    }
    return objs;
  }


  replace_placeholders (stdlib, code) {
    /*
    Replace the placeholding terms in the stdlib to contain information.
    */
    let n = [];
    let functions = this.get_functions(code);
    let classes = this.get_classes(code);
    for (line of stdblib) {
      line = line.replaceAll("__functions__", functions);
      line = line.replaceAll("__classes__", classes);
      n.push(line);
    }
    return n;
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

  process (code) {
    return this.literal_replace(code);
  }
}
