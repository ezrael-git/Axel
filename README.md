# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple and flexible.





# Index
1. [Index](https://github.com/ezrael-git/Axel/tree/development#index)
2. [Why?](https://github.com/ezrael-git/Axel/tree/development#Why?)
3. [Installing](https://github.com/ezrael-git/Axel/tree/development#Installing)
4. [Comments](https://github.com/ezrael-git/Axel/tree/development#Comments)
5. [Variables](https://github.com/ezrael-git/Axel/tree/development#Variables)
6. [Lists and Hashes](https://github.com/ezrael-git/Axel/tree/development#Lists-and-Hashes)
7. [Functions](https://github.com/ezrael-git/Axel/tree/development#Functions)
8. [Classes](https://github.com/ezrael-git/Axel/tree/development#Classes)
9. [Support](https://github.com/ezrael-git/Axel/tree/development#Support)


# Why?

I was bored.
Also I wanted a language mixing Ruby, JavaScript and Python's syntax.

Axel is one of those languages that'll, well, just work. If you miss a brace, Axel won't throw much of a fit (most of the times). To put this into perspective, this is valid Axel code:
```js
log("hello world"
```
So yeah, maintain your own readability, folks. Axel won't enforce many syntax laws.
Also, you can run JS code in Axel's compiler, since Axel compiles to JS. You can also see the compiled JavaScript code by adding `log(this.parsed)` to your code. Neat, huh?

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
Mutable variables are defined using `def:`, and immutable using `imm:`.

Example:
```py
def foo = "bar";
```

# Lists and hashes
Lists are a collection of variables. You can define them using `[]` syntax.

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
fn greet
  log("hello world");
end
```

Note that you probably shouldn't add in parentheses `()` after your function's name if you don't have any arguments. Or do, it's up to you.


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


That was it. Don't forget your semi-colons and happy coding.

# Support

Have a question? Stop by at Axel-lang's Discord server (warning: it's pretty dead) 

[Discord](https://discord.gg/xPhcZwGpSC)
