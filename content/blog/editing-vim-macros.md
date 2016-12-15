+++
draft = false
date = "2016-12-15T20:23:50+01:00"
title = "Editing Vim macros"
slug = "editing-vim-macros"
description = "A quick post how to edit Vim macros"
tags = ["vim", "macro", "registers"]
categories = ["Development", "Software"]
2016 = ["12"]

+++

Vim [macros](http://vim.wikia.com/wiki/VimTip144) are a powerful thing &mdash; they let us record keystrokes and play them back later. These macros are recorded to named registers.

One thing I realised about them, is that they can be edited after they have been recorded. This is possible because macros "lives" in the register.

Say, for example, you record a macro of 20+ keystrokes, play it back, only to realize that there's a single error in the steps. Re-recording the entire macro can be difficult. Instead,
paste the contents of that register somewhere, edit it, and then yank it back to that same register.

For a simple example, let's assume we want to add `*` around words. We record it to the register `a` by typing `qa` (the `^[` is the literal escape character):

``` text
bi&^[ea&^[
```

Play it back with `@a` and &mdash; oh no! that's not a `*`, that's a `&`!

Vim macro editing to the rescue:

``` text
:new # to open a new split
"ap # take the register named "a" and paste from it
:%s/&/*/g # replace all & with *
^v$"ay # jump to start of line, visual mode, jump to end of line, take the named register "a" and yank to it
```

If we now play back the macro again with `@a`, we see the `*`s wrapping the word on which the cursor was, just what we wanted.

Happy hackin'!
