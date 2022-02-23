// scanner.js
const Keywords = require("../data/keyword.js");


module.exports = class Scanner {
  constructor () {
    this.variables = [];
    this.imports = [];
    this.functions = [];
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

  scan_functions (stats) {
    let objs = {}
    let iterated = [];
    let line = -1;

    for (let stat of stats) {
      iterated.push(stat);
      line += 1;
      stat = this.cleanse_whitespace(stat);
      if (stat.startsWith("fn") || stat.startsWith("meth")) {
        let name = stat.split(' ')[1]
        objs[name] = [ line, this.namespace(stats, line) ] // syntax: funcname : [line, path]
      }

    }

    this.functions = objs;
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

  scan_instances (stats, cls) {
    let instances = []
    for (let stat of stats) {
      if (stat.includes("new " + cls) && stat.includes("def") || stat.includes("new " + cls) && stat.includes("imm")) {
        instances.push(stat.split(' ')[1])
      }
    }
    return instances
  }

  scan_classes (stats) {
    let classes = []
    for (let stat of stats) {
      if (stat.startsWith("class ")) {
        classes.push(stat.split(' ')[1])
      }
    }
    return classes
  }

  scan_private_methods (stats) {
    let objs = [];
    let line = -1;

    for (let stat of stats) {
      line += 1;
      stat = this.cleanse_whitespace(stat);
      if (stat.startsWith("private ")) {
        let path = this.namespace(stats, line);
        console.log("PATH " + path);
        let className = path.split('/')[1].replace("class:", "");
        let methName = stat.split(' ')[1];
        objs.push(className + ":" + methName);
        
      }
    }
    return objs;
  }


  scan_unholy_calls (stats) {
    let functions = [];
    let line = 0;
    let functions = this.scan_functions(stats)
    let priv_meths = this.scan_private_methods(stats)
    let variables = this.scan_variables(stats)
    let classes = this.scan_classes(stats)
    let cls_inst = {}
    for (let cls of classes) {
      cls_inst[cls] = this.scan_instances(stats, cls)
    }
    for (let stat of stats) {
      line += 1;

      for (let func in functions) {
        if (stat.includes(func + "(") && !stat.includes("new ")) {
          let flag = true;
          for (let keyword of Keywords.declarating) {
            if (stat.includes(keyword)) {
              flag = false;
            }
          }
          if (flag == true) {
            throw SyntaxError(`Functions should be called with the call: keyword\nIn line ${line}: ${stat}`);
          }
        }
      }

      for (let cls in cls_inst) {
        let instances = cls_inst[cls]
        for (let priv of priv_meths) {
          for (let instance of instances) {
            if (stat.includes(`call:${instance}.${priv.split('.')[1]}`) && this.namespace(stats, line).includes("class:" + cls)) {
              throw SyntaxError(`Cannot access private methods\nIn line ${line}: ${stat}`)
            }
          }
        }
      }

    } // outer for loop
  } // method end


  find (stats, code) {
    let line = -1;
    for (let stat of stats) {
      line += 1;
      if (stat == code) {
        return line;
      }
    }
  }

  namespace (stats, line) {
    let cur_namespace = "main"

    function add (path) {
      cur_namespace += "/" + path
    }
    function subtract () {
      let temp = cur_namespace.split('/');
      temp.splice(temp.length - 1, 1);
      temp = temp.join('/');
      cur_namespace = temp;
    }

    let iterated = -1;
    for (let stat of stats) {
      iterated += 1;
      stat = this.cleanse_whitespace(stat);
      if (line == iterated) {
        return cur_namespace;
      }
      if (stat.startsWith("class")) {
        let name = stat.split(' ')[1];
        add("class:" + name);
      }

      else if (stat.startsWith("fn")) {
        let name = stat.split(' ')[1];
        add("function:" + name);
      }

      else if (stat.startsWith("meth")) {
        let name = stat.split(' ')[1];
        add("method:" + name);
      }

      else if (stat == "end") {
        subtract();
      }
    }

  }

  getNamespace(thing, ns) {
    if (thing == "array") {
      return ns.split('/');
    }

    else if (thing == "recent") {
      return ns.split('/')[ns.length - 1]
    }

    else if (thing == "oldest") {
      return ns.split('/')[1];
    }

    else {
      throw new Error("Unknown thing: " + thing);
    }
  }

}
