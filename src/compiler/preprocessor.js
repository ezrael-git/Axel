const Scanner = require("./scanner.js");
const fs = require("fs");

module.exports = class Preprocessor {
  constructor (stdblib=true) {
    this.variables = [];
    this.imports = [];
    this.scanner = new Scanner();
    this.stdblib = stdblib;
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


  cleanse_calls (stats) {
    let man = [];
    for (let stat of stats) {
      if (!stat.includes("call:")) {
        man.push(stat);
      }
    }
    return man;
  }


  removeStrAt (st, pos, new_char) {
    st = st.split('')
    st[pos] = new_char
    st = st.join('')
    return st;
  }

  cleanse_whitespace (stat) {
    while (stat.startsWith(" ")) {
      stat = this.removeStrAt(stat,0,"");
    }
    return stat;
  }


  hoist (stats) {
    let manipulated = [];
    let imports = this.scanner.scan_imports(stats)
    for (let filename in imports) {
      let pkgname = imports[filename]
      manipulated.push(`const ${pkgname} = require("${filename}")`)
    }
    for (let stat of stats) {
      if (!stat.startsWith("import")) {
        manipulated.push(stat)
      }
    }
    return manipulated;
  }

  handle_calls (fm) {
    return fm;
  }

  filter (stats) {
    let man = [];
    let variables = this.scanner.scan_variables(stats);
    let functions = this.scanner.scan_functions(stats);
    let md = false;
    for (let stat of stats) {
      stat = this.cleanse_whitespace(stat);
      if (!stat.startsWith("private ")) {
        if (stat.startsWith("module ")) {
          md = true;
        }
        if (md == true && stat == "}") {
          continue;
        }
        for (let name in variables) {
          stat = stat.replace(name, name.replace("?", "AX_SPEC_CHAR_QUESTION_MARK"))
        }
        for (let name in functions) {
          stat = stat.replace(name, name.replace("?", "AX_SPEC_CHAR_QUESTION_MARK"))
        }
        stat = this.scanner.replaceAll(stat, "do", "{");
        stat = this.scanner.replaceAll(stat, "end", "}");
        stat = this.scanner.replaceAll(stat, "@", "this.");
        man.push(stat);
      }
    }
    return man;
  }

  load_stdblib (stats) {
    let data = fs.readFileSync("./standard/stdblib.ax", 'utf8');
    data = data.trim().split('\n')
    let man = [];
    for (let dat of data) {
      man.push(dat)
    }
    for (let stat of stats) {
      man.push(stat)
    }
    return man
  }



  process (code) {
    /*
    Interface
    */
    let fm = code
    if (this.stdblib == true) {
      fm = this.load_stdblib(fm);
    }
    fm = this.remove_comments(fm);
    fm = this.hoist(fm);
    this.scanner.scan_unholy_calls(fm);
    fm = this.handle_calls(fm);

    fm = this.filter(fm);

    return fm;
  }
}
