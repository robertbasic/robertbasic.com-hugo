+++
draft = false
date = 2020-01-09T12:46:28+01:00
title = "Attach to an already attached screen"
slug = "attach-to-an-already-attached-screen"
description = "Use -rd or -x to attach to an already attached screen"
tags = ["screen"]
categories = ["Software", "Development"]
2020 = ["01"]
+++

Today I ran into a strange error with [screen](https://linux.die.net/man/1/screen). I was working on a remote server, executing commands in `screen` when my connection got dropped. I reconnected, wanted to reattach to my screen session with the usual `-r` option:

``` bash
screen -r foo
```

But this greeted me with an error of:

``` bash
There is a screen on:
	7608.foo	(Attached)
There is no screen to be resumed matching foo.
```

`screen -ls` confirms there is a screen session for "foo". Apparently I came back to the server so quick that screen didn't realize I got dropped from the session and it still thought I was there.

The solution is to run the screen command with `-rd`:

``` bash
screen -rd foo
```

This tells screen to first detach the session and then reattach to it.

Another solution is to run the screen command with `-x`:

``` bash
screen -x foo
```

This tells screen to reattach to an already attached session.

Happy hackin'!
