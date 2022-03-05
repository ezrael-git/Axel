# Axel
The Axel programming language. Compiles to JavaScript.
Designed to be simple, flexible, and elegant, while being as fast as JavaScript.





# Index
1. [Index](https://github.com/ezrael-git/Axel/tree/development#index)
2. [Introduction](https://github.com/ezrael-git/Axel/tree/development#Why?)
3. [Installing](https://github.com/ezrael-git/Axel/tree/development#Installing)
4. [Comments](https://github.com/ezrael-git/Axel/tree/development#Comments)
5. [Data Types](https://github.com/ezrael-git/Axel/tree/development#Data-Types)
6. [Object Oriented Axel](https://github.com/ezrael-git/Axel/tree/development#Object-Oriented-Axel)
7. [Grammar](https://github.com/ezrael-git/Axel/tree/development#Grammar)
8. [Support](https://github.com/ezrael-git/Axel/tree/development#Support)


# Introduction

## Why?

I was bored.
Also I wanted a language containing Ruby's syntax, Python's flexibility and JavaScript's speed.

Oh, and did I tell you that you can use JavaScript code in an Axel file? The `Ax2JS` standard library provides this functionality. For example:
```js
import standard.ax2js as Ax2JS
fn say (sentence)
  Ax2JS.from_js(`console.log(sentence)`)
end

say("Hello World!")
```
The output:
```
>>> Hello World!
```
Let's get to the installation and the syntax.


# Installing

1) install Node.js (>= v16) if you haven't already
2) clone the repo
3) make a file named `main.js` and put this inside:
```js
new require("./axel/axel.js").compile(`

your Axel code

`)
```



# Comments

Comments are made using `--`. Multiline comments are made using `-( comment )-`


# Data Types
So, data types.
## Variables
There are two kinds of variables in Axel: mutable and immutable.
Mutable variables are defined using `def`, and immutable using `imm`.

Example:
```py
def foo = "bar";
```

## Lists and hashes
Lists are a collection of objects, or items. You can define them using `[]` syntax.

```js
def fruits = ["peach", "orange"];
```

Hashes, the equivalent of dictionaries in Python, can be made using curly braces (`{}`).
```js
def headers = {"Authentication" : "Bearer"};
```

# Object Oriented Axel
## Functions
You can define a function in Axel using the `fn` keyword.


```rust
fn greet ()
  log("hello world");
end
```
Tiny note: the parentheses after the function name isn't necessary, but it's recommended for the sake of readability.


## Classes
Classes are made using the `cls` keyword.
```
cls Person
  initialize (name)
    @name = name
  end

  say (sentence)
    log("#{@name} says '#{sentence}'")
  end
end
```
We can insert an expression into a string using `#{expression}`, as shown above.

The class can then be instantiated using the `new` static property, in this case:
```js
arnold = Person.new("Arnold")
arnold.say("Hello, I'm Arnold!")
-- >>> Arnold says 'Hello, I'm Arnold!'
```

# Grammar
Detailed information about keywords and syntax is available in the `grammar.md` file, located inside the `src/data/` folder.

# Support

Have a question? Stop by at Axel-lang's Discord server (warning: it's pretty dead) 

- [Discord](https://discord.gg/xPhcZwGpSC)
