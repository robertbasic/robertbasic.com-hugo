+++
draft = false
date = "2017-01-23T20:46:41+01:00"
title = "Search and replace in visual selection in Vim"
slug = "search-and-replace-in-visual-selection-in-vim"
description = "Use the \\%V atom to search and replace inside a visual selection in Vim"
tags = ["vim", "search", "replace"]
categories = ["Software", "Blablabla"]
2017 = ["01"]

+++

The search and replace feature is very powerful in Vim. Just do a `:help :s` to see all the things it can do.

<img src='/img/posts/vim-v-atom.gif' style='float:right;padding-left: 5px;'>

One thing that always bothered me though, is that when I select something with visual, try to do a search and replace on it, Vim actually does it on the entire line, not just on the selection.

What the...? There must be a way to this, right?

Right. It's the `\%V` atom.

Instead of doing `:'<,'>s/foo/bar/g` to replace foo with bar inside the selection, which will replace all `foo` occurences with `bar` on the entire line, the correct way is to use the `\%V` atom and do `:'<,'>s/\%Vfoo/bar/g`.

I'm using this approach in the `HugoHelperLink` fuction of my [Vim Hugo Helper plugin](https://github.com/robertbasic/vim-hugo-helper/blob/36de0cdd3ee77cc4faee0b624fec33f73b1d0600/autoload/hugohelper.vim#L24).

Happy hackin'!
