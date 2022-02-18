// streamer.js
// break up and put chunks of your code into eval()-able pieces


module.exports = class Streamer {
  constructor () {
  }

  stream (stats) {
    let blocks = [];
    let sav = "";
    let flag = false;
    for (let stat of stats) {
      if (stat.includes("{")) {
        sav += stat + "\n"
        flag = true;
      }
      else if (flag == true) {
        sav += stat + "\n"
      }
      else if (stat.includes("}")) {
        sav += stat + "\n"
        blocks.push(sav);
        sav = "";
        flag = false;
      }
    }
  }
}
