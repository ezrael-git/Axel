// hash.js


class Hash {
  initialize () {
    this.keys = [];
    this.values = [];
  }
  
  add (k,v) {
    this.keys.push(k);
    this.values.push(v);
  }
  
  access (k) {
    let found = undefined;
    this.keys.forEach(function (key) {
      if (key == k) {
        found = this.values[this.keys.index(k)];
      }
    };
    return found;

  }
}
