+++
date = "2011-12-29T09:02:12+02:00"
title = "Notes on shell scripting"
slug = "notes-on-shell-scripting"
description = "A few shell script notes I learned along the way"
tags = ["bash", "console", "scripting", "shell"]
categories = ["Development", "Programming"]
2011 = ["12"]
+++
Yesterday I <a href="https://github.com/enygma/usher/commit/c9a74ebedbc58c6b9b99828b45b1325e86bda1dd">did some shell scripting</a> and thought about writing down the few things learned along the way. Amazing how little needs to be done to learn a lot :)

<h3>Result of a command to a variable</h3>

First thing I learned is how to "save" the result of a shell command to a local variable:

``` bash
PHP_BINPATH=$(which php)
```

By enclosing the command in parenthesis and putting a dollar sign in front of it, will put the result of that command in the variable.

<h3>An empty variable</h3>

Turns out, a variable can be empty, null. Nothing strange with that, until one tries to do something with that variable. For example:

``` bash
PHP_BINPATH=
if [ $PHP_BINPATH == "foo" ]
  then
    echo "It's foo"
fi
```

will die with a strange error: "line 2: [: =: unary operator expected". Problem is that when evaluating it will see <code> if [ == "foo" ] </code> and turns out [ is some reserved command or some such. The fix is to wrap <code>$PHP_BINPATH</code> in double quotes:

``` bash
PHP_BINPATH=
if [ "$PHP_BINPATH" == "foo" ]
  then
    echo "It's foo"
fi
```

<h3>Pass all the arguments!</h3>

When calling some other command from within the shell script, and all the arguments which are passed to the shell script need to be passed to that other command, use <code>"$@"</code> for that:

``` bash
$PHP_BINPATH usher.php "$@"
```

This will pass all the arguments to the PHP script which is called from within the shell script.

Happy hackin'!
