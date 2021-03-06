// scanner.js
const Keywords = require("../data/keyword.js");
const Literal = require("./literals.js");
const ErrorHandler = require("./error_handler.js");

module.exports = class Scanner {
  constructor () {
    this.variables = [];
    this.imports = [];
    this.functions = [];

    this.uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    this.lowercase = [];
    for (let lett of this.uppercase) {
      this.lowercase.push(lett.toLowerCase());
    }
    this.letters = this.uppercase.concat(this.lowercase);
    this.digits = "0123456789".split('');
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
        let path = this.namespace(stats, line)
        let className = path.split('/')[1].replace("class:", "");
        let methName = stat.split(' ')[1];
        objs.push(className + ":" + methName);
        
      }
    }
    return objs;
  }


  scan_unholy_calls (stats) {
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

      for (let cls in cls_inst) {
        let instances = cls_inst[cls]
        for (let instance of instances) {
          for (let priv of priv_meths) {
            // console.log(`this.namespace(stats, line): ${stat} || ${line} \n ${this.namespace(stats, line)}`)
            if (stat.includes(`${instance}.${priv.split(':')[1]}`) && !this.namespace(stats, line).includes("class:" + cls)) {
              throw SyntaxError(`Cannot access private methods\nIn line ${line}: ${stat}`)
            }
          }
        }
      }

    } // outer for loop
  } // method end

  scan_exports (stats) {
    let exports = [];
    let line = 0;
    for (let stat of stats) {
      line += 1;
      if (this.namespace(stats, line).includes("module")) {
        exports.push(stat);
      }
      else if (stat.startsWith("import ")) {
        exports.push(stat);
      }
    }
  
    return exports;
  }

  scan_block (stats, line) {
    let nm = this.namespace(stats, line);
    let members = [];
    let curLine = 0;
    for (let stat of stats.slice(line,stats.length)) {
      curLine += 1;
      if (this.namespace(stats.slice(line,stats.length), curLine).includes(nm)) {
        members.push(stat);
      }
      else {
        break;
      }
    }
    return members;
  }




  find (stats, code, details={}) {
    let line = 0;
    function get_key(dic,k,ed) {
      if (dic[k] == undefined) {
        return ed
      }
      return dic[k]
    }
    for (let stat of stats) {
      line += 1;
      if (stat == code) {
        if (details["block_reference"] != undefined) {
          let block_reference = details["block_reference"];
          if (line > block_reference) {
            let block_end = details["block_end"];
            if (block_end != undefined) {
              if (line < block_end) {
                return line;
              }
            } else {
              return line;
            }
          }
        } else {
          return line;
        }
      }
    }
    return undefined;
  }

  findString (str, combination) {
    let curPos = -1;
    let start = 0;
    let end = 0;
    let it = "";
    for (let c of str) {
      it += c;
      curPos += 1;
      if (it.slice(it.length-combination.length,it.length) == combination) {
        end = curPos;
        start = curPos - combination.length + 1
        return {start:start,end:end,combination:combination}
      }
    }
  }

  namespace (lineTokens, line) {
    /*
      Figure out namespace of a given line using tokens
    */
    let cur_namespace = "main"
    let max = 0;
    for (let k in lineTokens) {
      if (parseInt(k) > max) {
        max = parseInt(k);
      }
    }
    console.log("Max " + max);
    console.log("Ask " + line);

    function add (path) {
      cur_namespace += "/" + path
    }
    function subtract () {
      let temp = cur_namespace.split('/');
      temp.splice(temp.length - 1, 1);
      temp = temp.join('/');
      cur_namespace = temp;
    }

    let on_line = 0;
    while (on_line != lineTokens.length+1) {
      on_line += 1;
      console.log("Ol " + on_line);
      console.log(cur_namespace);
      let line_t = lineTokens[on_line];
      for (let token of line_t) {

        if (line == on_line) {
          if (token.type == "END") { subtract() };
          return cur_namespace;
        }
        if (token.type == "CLASS") {
          let name = token.tk;
          add("class:" + name);
        }

        else if (token.type == "FUNCTION") {
          let name = token.tk;
          add("function:" + name);
        }

        else if (token.type == "IF") {
          add("if:" + on_line)
        }

        else if (token.type == "ELIF") {
          add("elif:" + on_line)
        }

        else if (token.type == "ELSE") {
          add("else:" + on_line)
        }

        else if (token.type == "MODULE") {
          let name = token.tk;
          add("module:" + name);
        }

        else if (token.type == "END") {
          subtract();
        }
      }
    }

  }

  getNamespace (thing, ns) {
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

  getType (stats, obj) {
    let type = "";
    for (let stat of stats) {
      if (stat.includes(obj)) {
        if (stat.startsWith("def" || "imm")) {
          type = "variable"
        } else if (this.contains(stat, "fn " + obj)) {
          type = "function"
        } else if (this.contains(stat, "class " + obj)) {
          type = "class"
        } else {
          type = undefined;
        }
      }
    }

    return type;
  }

  replace (str, comb, after) {
    const temp1 = str.replace(`'${comb}'`, '****').replace(`"${comb}"`, '****');
    const temp2 = temp1.replace(comb, after);
    return temp2.replace('****', `'${comb}'`);

  }

  contains (str, combination) {
    let inString = false;
    let cont = false;
    let it = "";
    for (let c of str) {
      it += c;
      if (c == "'" || c == '"') {
        if (inString == true) {
          inString = false;
        } else {
          inString = true;
        }
      }

      if (it.endsWith(combination) && inString == false) {
        cont = true;
        return cont;
      }
    }
    return cont;
  }

  replaceAll (str, combination, after) {
    while (this.contains(str, combination)) {
      str = this.replace(str, combination, after);
    }
    return str;
  }

  inQuotes (str, pos) {
    let curp = -1;
    let inQ = false;
    for (let char of str) {
      curp += 1;

      if (char == "'" || char == '"') {
        if (inQ) {
          inQ = false;
        } else {
          inQ = true;
        }
      }

      if (curp == pos) {
        return inQ
      }

    }
  }

  getUntil (str, pos, char,sec="hell") {
    let curPos = -1;
    pos += 1;
    let it = "";
    for (let charit of str) {
      curPos += 1;
      if (curPos >= pos) {
        if (charit != char && charit != sec) {
          it += charit
        } else {
          return {string:it,curPos:curPos};
        }
      }
    }
    return {string:it,curPos:curPos};
  }

  getIntegers (str, pos) {
    let curPos = -1;
    let it = "";
    for (let charit of str) {
      curPos += 1;
      console.log(pos)
      console.log(curPos)
      if (curPos >= pos) {
        if (this.digits.includes(charit)) {
          it += charit;
        }
        else {
          return {integers:it,start:pos,end:curPos-1};
        }
      }
    }
    // another return statement because if the integers are at the last line then it doesn't return anything
    // e.g. "def lol = 72"
    return {integers:it,start:pos,end:curPos};
  }

  getLetters (str, pos) {
    let curPos = -1;
    pos += 1;
    let it = "";
    for (let charit of str) {
      curPos += 1;
      if (curPos >= pos) {
        if (this.letters.includes(charit)) {
          it += charit;
        }
        else {
          return {letters:it,start:pos,end:curPos-1};
        }
      }
    }
    return {letters:it,start:pos,end:curPos};
  }

  getLettersReverse (str, pos) {
    let curPos = str.slice(0,pos).length;
    let it = "";
    let it_str = str.slice(0,pos+1).split('').reverse();
    for (let char of it_str) {
      curPos -=1;
      it += char;
      if (!this.letters.includes(char)) {
        it = it.split('')
        it[it.length-1] = ''
        it = it.join('')
        return {letters:it.split('').reverse().join(''),start:curPos+2,end:pos};
      }
    }
    return {letters:it.split('').reverse().join(''),start:curPos+1,end:pos};
  }

  inArgList (str, pos) {
    let it = "";
    let starting = 0;
    let ending = 0;
    let curp = -1;
    let func = false;
    let func_cords = 0;
    let flag = false;
    for (let c of str) {
      curp += 1;
      it += c;
      if (it.endsWith("fn") && !this.letters.includes(str[curp-2]) && func == false) {
        func = true;
        func_cords = curp - 1;
      }
      if (func == true && c == "(" && starting == 0) {
        starting = curp;
      }
      if (func == true && c == ")" && ending == 0) {
        ending = curp;
      }
      if (func == true && starting != 0 && ending != 0) {
        if (pos > starting && pos < ending) {
          return {"flag":true,"starting":starting,"ending":ending,"fn_cords":func_cords};
        }
        else {
          return {"flag":false,"starting":starting,"ending":ending,"fn_cords":func_cords};
        }
      }
    }
    return {"flag":false,"starting":starting,"ending":ending,"fn_cords":func_cords};
  }

  toLiteral (obj) {
    if (obj.constructor.name == "String" && !["true","false","nil"].includes(obj)) {
      return new Literal.TextLiteral(obj);
    }
    else if (obj.constructor.name == "Number") {
      return new Literal.IntegerLiteral(obj);
    }
    else if (obj == "true") {
      return new Literal.TrueLiteral(obj);
    }
    else if (obj == "false") {
      return new Literal.FalseLiteral(obj);
    }
    else if (obj == "nil") {
      return new Literal.NilLiteral(obj);
    }
    else if (["Node", "Literal"].includes(obj.constructor.name)) {
      return obj;
    }
    else {
      return obj;
    }
  }

  resolveRun (obj,interpreter) {
    console.log("IN " + interpreter.interpretNode.constructor.name);
    while (obj.run != undefined) {
      obj = interpreter.interpretNode(obj);
    }
    return obj;
  }

  enforceVarPol (name) {
    for (let l of name.tk) {
      if (this.digits.includes(l)) {
        ErrorHandler.throw("ParseError", name.line, "Variable names must not contain a digit");
      }
    }
    if (["print"].includes(name.tk)) {
      ErrorHandler.throw("ParseError", name.line, "Variable names must not be an already reserved keyword");
    }
  }




}
