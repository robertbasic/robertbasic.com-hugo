+++
date = "2015-07-01T15:04:34+02:00"
title = "pugdebug 1.0.0."
slug = "pugdebug-1-0-0"
description = "Announcing pugdebug 1.0.0 version"
tags = ["pugdebug", "python", "pyqt", "qt", "debugging", "xdebug", "stable"]
categories = ["Programming", "Software", "Development"]
+++
<p>
After 3 months since <a href="http://robertbasic.com/blog/introducing-pugdebug">announcing</a>  that I'm working on <a href="https://github.com/robertbasic/pugdebug">pugdebug</a>, and some <a href="https://github.com/robertbasic/pugdebug/commit/9ea2b01ea439068bbecfbaa9a248d94936f2b6fa">5 months</a>  since I actually started working on it, it is finally time to let <a href="https://github.com/robertbasic/pugdebug/releases/tag/v1.0.0">version 1.0.0</a>  out in the wild.
</p>

<p>
It's been a busy 3 months: 82 pull requests got merged, 67 issues resolved, more than 350 commits pushed. A lot of changes, fixes and improvements found their way into this first version.
</p>

<p>
First of all, a big thanks goes out to <a href="https://twitter.com/ihabunek">Ivan Habunek</a>  and <a href="https://twitter.com/vranac">Srdjan Vranac</a>  for helping. They asked for and added new features, tested on Windows and OSX systems, helped fleshing out ideas.
</p>

<p>
One of the biggest news is that there are binaries built for Linux and Windows operating systems, using <a href="https://github.com/pyinstaller/pyinstaller">pyinstaller</a>. These binaries include everything pugdebug needs to work so there is no need to install anything. Just download the binary for your system and run it. That's it. It makes me incredibly happy that it's possible to have it this simple to run and use pugdebug.
</p>

<p>
<a href="http://robertbasic.com/static/img/posts/pugdebug100-big.png"><img src="http://robertbasic.com/static/img/posts/pugdebug100.png" unselectable="on" style="cursor: default; float: right; margin: 0px 0px 10px 10px;" alt="pugdebug" width="480"></a>
</p>

<p>
The user interface has improved a great deal. It is using dockable widgets for different pieces of the UI, making the layout of the application configurable by just dragging the widgets around. It's not all great though, there's still room for improvement, but it will be better over time.
</p>

<p>
pugdebug allows to debug multiple requests one after the other which helps debugging in a more "complicated" scenario where there are, for example, multiple AJAX calls triggered in succession. By starting to listen to incomming connections, pugdebug will listen to all incoming connections and, based on the IDE key setting, decide should the connection be queued for debugging, or ignored.
</p>

<p>
It is also now possible to create projects inside pugdebug, as a way to help switching between different PHP projects where debugging is needed. Simply name the project, set it's settings and that's it. pugdebug stores all the configuration files in it's own directory, so nothing will be added to your PHP projects.
</p>

<p>
I'm especially happy and proud that pugdebug got included on Xdebug's website on the <a href="http://xdebug.org/docs/remote#clients">list of remote debugging clients</a>. Thanks to <a href="https://twitter.com/derickr">Derick Rethans</a>!</p>

<p>For more information on how to use pugdebug, take a look at the <a href="https://github.com/robertbasic/pugdebug/blob/master/README.md">read me file</a>  or the <a href="https://github.com/robertbasic/pugdebug/wiki">wiki</a> and let <a href="https://twitter.com/robertbasic">me</a>  know if you have any <a href="https://github.com/robertbasic/pugdebug/issues">issues</a>  with it! </p>
