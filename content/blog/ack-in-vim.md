+++
date = "2014-12-09T20:54:32+02:00"
title = "Ack in vim"
slug = "ack-in-vim"
description = "Using ack.vim to search with ack from vim"
tags = ["ack", "vim", "plugins", "rooter"]
categories = ["Development", "Software", "Programming"]
+++
I started using vim 3, 4 years ago. The way I use it is that I started out with no plugins and with a handful of lines in .vimrc. It is far too easy to cram all kind of stuff into it and then get lost in the myriads of key combinations. To prevent that, I decided to slowly add in bits and pieces I find lacking in my day to day usage of vim. Also allows me to first learn the editor and later the plugins.

Today was an exceptional day as I added not one, but two plugins to vim! And that is a big change for me as the total number of plugins I now use is 4.

<img style="cursor: default; width: 450px; float:right;padding:10px" unselectable="on" src="http://robertbasic.com/static/img/posts/ack-vim.png">

The first one I added is <a href="https://github.com/mileszs/ack.vim">ack.vim</a>. It's a nice little plugin to run ack from within vim and show the results in a split window. It's rather easy to use, one just basically types <code>:Ack search_string</code> and that's it. The one thing I immediately disliked is that it sort of gets lost in the subdirectories of a project.

A quick google search found a solution for that little problem as well: <a href="https://github.com/airblade/vim-rooter">vim-rooter</a>. It doesn't do much, just changes the current working directory of vim to the project root when you open a file.

And that's basically it. Nice and fast searching with ack from vim.
