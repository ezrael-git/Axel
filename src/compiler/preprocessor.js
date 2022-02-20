module.exports = class Preprocessor {
  constructor () {
    this.variables = [];
    this.imports = [];
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
    this.variables = objs;
    return objs;
  }

  scan_imports (stats) {
    let objs = {}
    for (let stat of stats) {
      if (stat.startsWith("import")) {
        let filename = stat.split(' ')[1];
        let pkgname = stat.split('as')[1];
        objs[filename] = pkgname;
      }
    }
    this.imports = objs;
    return objs;
  }

  scan_blank_references (stats) {
    let objs = {};
    let line = -1;
    for (let stat of stats) {
      let stat_copy = stat
      line += 1;
      if (stat.includes("@=>")) {
        let iterated = "";
        for (let char of stat) {
          iterated += char;
          if (iterated.includes("@=>")) {
            stat = stat.replace(iterated, "");
            break;
          }
        }
        let varName = "";
        for (let char of stat) {
          if (char == " " || char == ")") {
            break;
          }
          varName += char;
        }
        objs[varName] = stat_copy;
      }
    }
    
    return objs;
  }

  scan_unholy_calls (stats) {
    let functions = [];
    let line = 0;
    for (let stat of stats) {
      line += 1;
      if (stat.startsWith("fn ") || stat.includes("meth")) {
        functions.push(stat.split(' ')[1].replace("(", ""));
      }

      for (let func of functions) {
        if (stat.includes(func + "(") && !stat.includes("new ")) {
          throw SyntaxError(`Functions should be called with the call: keyword\nIn line ${line}: ${stat}`);
        }
      }
    }
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
    let vars = this.scan_variables(stats);
    let imports = this.scan_imports(stats);
    let blank_refs = this.scan_blank_references(stats);
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



  process (code) {
    /*
    Interface
    */
    let fm = code;
    fm = this.remove_comments(fm);
    fm = this.hoist(fm);
    this.scan_unholy_calls(fm);

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

    line = -1;
    for (let stat of fm) {
      line += 1;
      fm[line] = stat.replaceAll("@", "this.").replaceAll("$def", "def");
      fm[line] = this.cleanse_whitespace(fm[line]);
    }

    return fm;
  }
}
