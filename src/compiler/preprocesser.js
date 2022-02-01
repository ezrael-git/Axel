module.exports = class Preprocessor {
  constructor (options) {
    this.op = options;
  }

  literal_replace (a) {
    let rep = {
      "@": "this.",
      "do": "}"
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

  process (code) {
    return this.literal_replace(code);
  }
}
