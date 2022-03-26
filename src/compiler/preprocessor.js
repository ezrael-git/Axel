const Scanner = require("./scanner.js");
const fs = require("fs");

module.exports = class Preprocessor {
  constructor (stdblib=true) {
    this.variables = [];
    this.imports = [];
    this.scanner = new Scanner();
    this.stdblib = stdblib;
  }

  removeAllAfter (line,symbol) {
    let it = "";
    for (let char of line) {
      it += char;
      if (it.endsWith(symbol)) {
        // because we don't want to return the string with the symbol included
        let new_it = it.split('');
        new_it = it.slice(0,it.length - symbol.length).join('');
        return new_it;
      }
    }
    return it;
  }


  removeComments (stats) {
    let fmtd = [];
    for (let stat of stats) {
      fmtd.push(this.removeAllAfter(stat));
    }
    return fmtd;
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

  formatEnd (stats) {
    let fmtd = [];
    for (let stat of stats) {
      fmtd.push(stat.replaceAll("end", "end\n"));
    }
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
