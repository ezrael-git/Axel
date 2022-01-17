// pre defined
module.exports = {

  "log": function (ctx) {
    let parsed = ""
    ctx.args.forEach(arg => parsed += arg.eval());
    console.log(parsed);
  }

  "@": function (ctx) {
    return `SET ${ctx[0]} ${ctx[2]}`
  }


  

}
