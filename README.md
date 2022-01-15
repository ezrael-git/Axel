# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple, flexible, and fast.





# Quick Usage
```js
const Axel = require("axel.js");
Axel.program(`

@fruit = 'peach';
log(#fruit);

`);
```
**Explanation:** 
In the first line, we require the main Axel file.
In the second line, we access the `Axel.program()` method. This is necessary for our code, as the Axel compiler needs to receive the input as a multiline string.

Next, we make a variable called `fruit` and assign to it the string `'peach'`. `@` in Axel is for the declaration of variables, whereas `#` accesses the variables.
All variables are technically global in Axel. 

**Neat trick:** You can see the produced JavaScript code by using `log(line)` in your Axel program.
