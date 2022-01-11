# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple, flexible, and fast.





# Quick Usage
```js
const Axel = require("axel.js");
Axel.program('

define fruits = ['apple', 'banana', 'pear'];
log(access fruits);

');
```
**Explanation:** 
In the first line, we require the main Axel file.
In the second line, we access the `Axel.program()` method. This is necessary for our code, as the Axel compiler needs to receive the input as a multiline string.

In the rest of the lines, we define a simple Axel program that makes a list called `fruits` and later logs it to the console.
