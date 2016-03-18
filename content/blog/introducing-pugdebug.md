+++
date = "2015-04-01T08:35:18+02:00"
title = "Introducing pugdebug"
slug = "introducing-pugdebug"
description = "pugdebug is a standalone remote debugger for php"
tags = ["pugdebug", "python", "pyqt", "qt", "debugging", "xdebug"]
categories = ["Software", "Programming", "Development"]
2015 = ["04"]
+++
In my spare time in the past few months I was working on a tool that would help
me in my every day job as a PHP programmer. As you may, or may not, know, I'm
using vim as my editor/almost IDE, but one thing that is missing from it is the
ability to debug PHP files remotely. Yes, there are a bunch of plugins out
there that add debugging to vim, but none of them felt usable for me.

And based on my google searches, there are no standalone remote debuggers for
PHP, that work on Linux.

In February this year I started to work on a desktop application that would help
me address this issue. <br>

<img alt="pugdebug" style="cursor: default; float: right; margin: 0px 0px 10px 10px;" unselectable="on" src="/img/posts/pugdebug-small.png">

<a href="https://github.com/robertbasic/pugdebug">pugdebug</a>&nbsp; is a PyQt desktop application meant to be used as a remote debugger for PHP,
that communicates with <a href="http://xdebug.org">xdebug</a>.

It is meant to be a debugger and only a debugger. There are a plenty of (good) IDEs
that include remote debugging and I'm not going to start writing another one
(although I did start <a href="http://robertbasic.com/blog/ape-is-a-php-editor">one</a>, once).

The application is still pretty simple, ugly as hell, but it works. Sort of.
There are still a few kinks left to sort out and I'm doing my best to
<a href="https://github.com/robertbasic/pugdebug/issues">write them all down</a>.

It's dependencies are Python 3.4, Qt 5.4, SIP 4.6 and PyQt 5.4. The
<a href="https://github.com/robertbasic/pugdebug#using-it">read me</a> file
should have a bit more details on how to start using it. I know it's a bit messy
to set everything up, but I am working on building executables for different
Linux distros. That stuff is hard!

It is lincesed under the GNU GPL v3 license, because PyQt.

<h3>Using pugdebug</h3>

Start the application, click the start button and then it waits for incomming
connections. Load a PHP page to start a
<a href="http://xdebug.org/docs/remote#browser_session">HTTP debug session</a>,
and pugdebug should break on the first line of your code.

Stepping around the code is possible with the step into, step out and step over
commands. At each step, pugdebug will get the current variables state from xdebug
and display them.

Double clicking on lines in the code viewer will set breakpoints on those lines.
Do note though that there needs to be a debugging session active to be able to
set a breakpoint. This will change in the (near) future.

And that's about it. While I know it doesn't look like much, this was, and still
is, a nice learning experience for me and the best part of it is that I was using
pugdebug earlier this week to debug a PHP application I'm working on.
