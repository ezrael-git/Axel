# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple, flexible, and fast.





# Quick Usage
```js
const Axel = require("axel.js");
Axel.program(`

def fruit = 'peach';
log(fruit);

`);
```
**Explanation:** 
In the first line, we require the main Axel file.
In the second line, we access the `Axel.program()` method. This is necessary for our code, as the Axel compiler needs to receive the input as a multiline string.

Next, we make a variable called `fruit` and assign to it the string `'peach'`. `def` in Axel is for the declaration of variables.

**Neat trick:** You can see the produced JavaScript code by using `log(this.parsed)` in your Axel program.
