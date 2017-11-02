+++
draft = true
date = 2017-11-01T20:32:17+01:00
title = "Visual sudo for shell scripts"
slug = "visual-sudo-for-shell-scripts"
description = "Use pkexec to ask sudo permissions "
tags = ["sudo", "shell", "pkexec", "gksudo", "fedora"]
categories = ["Development", "Software"]
2017 = ["11"]
+++

The other day I was putting together a small shell script to do some administrative tasks on my Fedora workstation.

Even though I spend most of my time in a terminal, I wanted to have this script available from "everywhere", that is to have it available to run it as a keyboard shortcut.

The script requires sudo privileges, and up until now, I thought that the only way to get sudo was from the terminal.

But then I remembered that some applications, like `firewall-config`, ask for the sudo password via a pop-up window. Surely it's available to whatever application needs it, right?

The answer is `pkexec`.

<img src='/img/posts/pkexec.png' style='float:right; padding: 5px;' />

To quote the man pages:

<blockquote>
<strong>pkexec</strong> allows an authorized user to execute program as another user. If program is not specified, the default shell will be run. If username is not specified, then the program will be executed as the administrative super user, root.
</blockquote>

Looks like that this `pkexec` is a part of, or at least relates to, something called [Polkit](https://en.wikipedia.org/wiki/Polkit). I honestly don't understand that part yet, and what does it *really* do. Need to learn more about it, but as this is the first time I came across it, the learning more about it thing might not happen soon.

To make the shell script ask for the sudo password through `pkexec` we add it to the `she-bang` line:

``` bash
#!/usr/bin/pkexec /bin/bash

touch /some/path/requiring/permissions.txt
```

Now when we run this script either through the terminal, or through an application finder/launcher applet, or by invoking it with a keyboard shortcut, it'll ask for the sudo password first with the pop-up window.

Happy hackin'!
