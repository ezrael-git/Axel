# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple and flexible.





# Index
1. [Index](https://github.com/ezrael-git/Axel/tree/development#index)
2. [Introduction](https://github.com/ezrael-git/Axel/tree/development#Why?)
3. [Installing](https://github.com/ezrael-git/Axel/tree/development#Installing)
4. [Comments](https://github.com/ezrael-git/Axel/tree/development#Comments)
5. [Variables](https://github.com/ezrael-git/Axel/tree/development#Variables)
6. [Lists and Hashes](https://github.com/ezrael-git/Axel/tree/development#Lists-and-Hashes)
7. [Functions](https://github.com/ezrael-git/Axel/tree/development#Functions)
8. [Classes](https://github.com/ezrael-git/Axel/tree/development#Classes)
9. [Support](https://github.com/ezrael-git/Axel/tree/development#Support)


# Introduction

## Why?

I was bored.
Also I wanted a language mixing Ruby, JavaScript and Python's syntax.

Axel is one of those languages that'll, well, just work. If you miss a closing brace, Axel won't throw much of a fit (most of the times). To put this into perspective, this is valid Axel code:
```js
log("hello world"
```

Oh, and did I tell you that you can use JS along with Axel, in the same line?
Axel takes what it needs and leaves the rest for the JavaScript compiler. If you use JS syntax, Axel won't throw an error. It'll just work.
This is valid Axel code:
```js
log "axel"
console.log("is")
function weird () {
  log "weird"
end
weird()
```
Although, it's recommended to always use `fn` for declaring functions. This is because if you don't, Axel won't consider it a valid function, and hence you may not be able to use no-parentheses syntax when calling the function, along with some other problems.

Let's get to the installation and the syntax.


# Installing

1) install Node.js (>= v16) if you haven't already
2) clone the repo
3) make a file named `main.js` and put this inside:
```js
new require("./axel/axel.js").program(`

your Axel code

`)
```



# Comments

Comments are made using `//`. Multiline comments are made using `/* comment */`


# Variables
There are two kinds of variables in Axel: mutable and immutable.
Mutable variables are defined using `def`, and immutable using `imm`.

Example:
```py
def foo = "bar";
```

# Lists and hashes
Lists are a collection of items. You can define them using `[]` syntax.

```js
def fruits = ["peach", "orange"];
```

Hashes, or dictionaries, can be made using curly braces (`{}`).
```js
def headers = {"Authentication" : "Bearer"};
```

# Functions
You can define a function in Axel using the `fn` keyword.


```rust
fn greet ()
  log("hello world");
end
```
Tiny note: the parentheses after the function name isn't necessary, but it's recommended for the sake of readability.


# Classes
Classes are made using the `cls` keyword.
```
cls className
  constructor (name)
    this.name = name;
  end

  fuck () 
    log(this.name + " has been fucked!");
  end
end
```

# Support

Have a question? Stop by at Axel-lang's Discord server (warning: it's pretty dead) 

- [Discord](https://discord.gg/xPhcZwGpSC)
