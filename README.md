# Axel
Official implementation of the Axel programming language. Written in JavaScript.
Designed to be simple, flexible, and elegant, while being as fast as JavaScript.





# Index
1. [Index](https://github.com/ezrael-git/Axel/tree/development#index)
2. [Introduction](https://github.com/ezrael-git/Axel/tree/development#Why?)
3. [Installing](https://github.com/ezrael-git/Axel/tree/development#Installing)
4. [Comments](https://github.com/ezrael-git/Axel/tree/development#Comments)
5. [Data Types](https://github.com/ezrael-git/Axel/tree/development#Data-Types)
6. [Functions and Object Oriented Axel](https://github.com/ezrael-git/Axel/tree/development#Functions-and-Object-Oriented-Axel)
7. [Grammar](https://github.com/ezrael-git/Axel/tree/development#Grammar)
8. [Support](https://github.com/ezrael-git/Axel/tree/development#Support)


# Introduction

## Why?

I was bored.
Also I wanted a language containing Ruby's syntax, Python's flexibility and JavaScript's speed.

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
Mutable variables are those that can be changed once declared, immutable are those which cannot.

All variables made with the first letter capital are automatically declared as immutable, while those that have a lowercase first letter are considered mutable.
Trying to change an immutable variable will result in an error.
Example:
```py
foo = "bar"
>>> "bar"
foo = "baz"
>>> "baz"

Baz = "foo"
>>> "foo"
Baz = "bar"
>>> DeclarationError: At line 5:
>>> Cannot change an immutable variable
```

## Lists and hashes
Lists are a collection of items. You can define them using `[]` syntax.

```js
fruits = ["peach", "orange"]
```

Hashes, the equivalent of dictionaries in Python, can be made using curly braces (`{}`).
```js
headers = {"Authentication" => "Bearer"}
```

# Functions and Object Oriented Axel
## Functions
You can define a function in Axel using the `fn` keyword.


```rust
fn greet ()
  print "hello world"
end
```


## Classes
Note: classes aren't implemented yet, but this is how the syntax would look like, roughly.
Classes are made using the `class` keyword.
```
class Person
  initialize (name)
    @name = name
  end

  say (sentence) 
    print "#{@name} says '#{sentence}'"
  end
end
```
We can insert an expression into a string using `#{expression}`, as shown above.

The class can then be instantiated using the `new` static method, in this case:
```js
arnold = Person.new("Arnold")
arnold.say("Hello, I'm Arnold!")
>>> Arnold says 'Hello, I'm Arnold!'
```

# Grammar
Detailed information about keywords and syntax (the language's EBNF) is available in the `grammar.md` file, located inside the `src/data/` folder.

# Support

Have a question? Ask our community!

- [Discord](https://discord.gg/xPhcZwGpSC)
