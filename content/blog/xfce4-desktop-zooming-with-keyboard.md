+++
draft = false
date = "2017-01-19T14:25:24+01:00"
title = "XFCE4 desktop zooming with the keyboard"
slug = "xfce4-desktop-zooming-with-the-keyboard"
description = "A set of commands that allow to zoom a XFCE4 desktop with the keyboard"
tags = ["xfce4", "zoom", "desktop", "compositing", "accessibility", "keyboard", "mouse"]
categories = ["Software", "Blablabla"]
2017 = ["01"]

+++

<img src='/img/posts/xfce4-zoom.gif' style='float:right;padding-left: 5px;'>

[XFCE4](https://www.xfce.org/) has a zoom feature available when the desktop composition is turned on. By default, holding the `Alt` key and scrolling up or down the mouse wheel,
I can zoom in or out the entire desktop. Once zoomed in, it follows the mouse pointer as to which part of the desktop to show.

I prefer doing as much as possible from my keyboard, and to use the mouse only when necessary.

I don't care much for desktop composition, the transparent windows and animations are not my thing.

## Toggle desktop composition

Given that desktop composition is required for the zooming feature, I want it enabled only when I want to use the zoom feature itself.

Using the following command, I can toggle the composition on and off:

``` bash
xfconf-query --channel=xfwm4 --property=/general/use_compositing --type=bool --toggle
```

## xdotool to fake the mouse

[xdotool](http://www.semicomplete.com/projects/xdotool) is a nice little program that fakes keyboard and mouse input, among other things.

Using that, running the following command from the terminal, zooms in:

``` bash
xdotool keydown Alt click 4 keyup Alt
```

and this command zooms out:

``` bash
xdotool keydown Alt click 5 keyup Alt
```

Just to make all this even easier, I put these commands in a couple of [bash scripts](https://github.com/robertbasic/xfce4-helpers) and added them as keyboard shortcuts.

Now I have `Super C` to toggle the desktop composition, `Alt +` to zoom in and `Alt -` to zoom out.

Happy hackin'!
