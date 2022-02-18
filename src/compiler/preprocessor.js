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

  scan_imports (stats) {
    let objs = {}
    for (let stat of stats) {
      if (stat.startsWith("import")) {
        let filename = stat.split(' ')[1];
        let pkgname = stat.split('as')[1];
        objs[filename] = pkgname;
      }
    }
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


  host (stats) {
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
          manipulated.push(blank_refs[brName].replace("@=>"));
        }
      }
    }
    for (let stat of stats) {
      if (!stat.startsWith("def") && !stat.startsWith("imm") && !stat.startsWith("import")) {
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
    let line = -1;
    for (let stat of code) {
      line += 1;
      let topush = "";
      let iterated = "";
      // detect and manipulate function calls
      if (stat.includes("call:")) {
        console.log(stat);
        for (let char of stat) {
          iterated += char;
          if (iterated == "call:") {
            break;
          }
        }
        console.log("ITERATED " + iterated);
        stat = stat.replace(iterated, "");
        console.log("NEW STAT " + stat);
        let funcName = stat.split("&")[0];
        let args = stat.split("&")[1];
        console.log("FUNCNAME " + funcName)
        console.log("ARGS " + args)
        fm[line] = `${funcName}(${args})`;
      }

    }

    return fm;
  }
}
