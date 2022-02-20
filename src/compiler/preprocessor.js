const Scanner = require("./scanner.js");

module.exports = class Preprocessor {
  constructor () {
    this.variables = [];
    this.imports = [];
    this.scanner = new Scanner();
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
    let vars = this.scanner.scan_variables(stats);
    let imports = this.scanner.scan_imports(stats);
    let blank_refs = this.scanner.scan_blank_references(stats);
    for (let filename in imports) {
      let pkgname = imports[filename];
      manipulated.push(`const ${pkgname} = require('${filename}')`)
    }
    for (let name in vars) {
      let value = vars[name];
      manipulated.push(`let ${name} = ${value}`);
      for (let brName in blank_refs) {
        if (name == brName) {
          manipulated.push(blank_refs[brName].replace("@=>", ""));
        }
      }
    }
    for (let stat of stats) {
      if (!stat.startsWith("def") && !stat.startsWith("imm") && !stat.startsWith("import") && !stat.includes("@=>")) {
        manipulated.push(stat);
      }
    }
    return manipulated;
  }

  handle_calls (fm) {
    let line = -1;
    for (let stat of fm) {
      line += 1;
      let iterated = "";
      // detect and manipulate function calls
      if (stat.includes("call:")) {
        
        const stat_copy = stat;
        for (let char of stat) {
          iterated += char;
          if (iterated.endsWith("call:")) {
            break;
          }
        }
        stat = stat.replace(iterated, "");

        let funcName = stat.split("&")[0];
        let args = stat.split("&")[1];

        let call = `${funcName}(${args})`;
        fm[line] = stat_copy.replace('call:' + funcName + '&' + args, call);
        fm = this.cleanse_calls(fm);
      }
    }

    return fm;
  }



  process (code) {
    /*
    Interface
    */
    let fm = code;
    fm = this.remove_comments(fm);
    fm = this.hoist(fm);
    this.scanner.scan_unholy_calls(fm);
    fm = this.handle_calls(fm);

    let line = -1;
    for (let stat of fm) {
      line += 1;
      fm[line] = stat.replaceAll("@", "this.").replaceAll("$def", "def");
      fm[line] = this.cleanse_whitespace(fm[line]);
    }

    return fm;
  }
}
