+++
draft = false
date = "2017-01-12T08:07:37+01:00"
title = "Force Python version in Vim"
slug = "force-python-version-in-vim"
description = "When Vim supports both Python 2 and 3, force one version to know which version will be used at any time."
tags = ["vim", "python", "vimrc"]
categories = ["Development", "Software"]
2017 = ["01"]

+++

Vim can be compiled with Python support. Vim can be compiled with both Python 2 and Python 3 support.

At the same time.

But not really.

Vim can have both of them, but use only one at a time. If you start using one version, there is no way to switch to the other one.

The silly thing is that if you simply ask Vim which version does it support, the first one asked and supported is going to be the one loaded and used. Trying to use the other one from that point will result in an error.

``` vim
if has('python')
elif has('python3')
endif
```

Guess which one is loaded? Python 2.

Try calling Python 3 and ka-boom!

``` vim
:py3 print('hello')
E836: This Vim cannot execute :py3 after using :python
```

Switch the order around:

``` vim
if has('python3')
elif has('python')
endif
```

And now? Yup, Python 3.

Why is this ridiculous? Because if you have a bunch of Vim plugins loaded, the first one that asks for a specific Python version wins! Reorder the plugins and suddenly a different Python version is loaded.

Gotta love the software development world.

Luckily, this can also be used to fix the problem itself.

How?

Force one of the Python versions from the top of your `.vimrc` file:

``` vim
if has('python3')
endif
```

Now you can have a little bit of sanity and be sure what Python version is Vim going to use. Of course, doing this might break plugins written solely for Python 2, so do it at your own risk.

Happy hackin'!
