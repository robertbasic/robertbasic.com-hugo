+++
draft = false
date = 2017-11-01T08:55:14+01:00
title = "Smarter tag search in Vim"
slug = "smarter-tag-search-in-vim"
description = "How to improve the tag searching in Vim"
tags = ["php", "vim", "tags", "namespace", "plugin"]
categories = ["Development", "Software"]
2017 = ["11"]
+++

As part of my [Vim setup for PHP development](https://robertbasic.com/blog/current-vim-setup-for-php-development/), I use the [vim-php-namespace](https://github.com/arnaud-lb/vim-php-namespace) plugin to add `use` statements in my PHP code.

`vim-php-namespace` uses the tags file to find the class and the namespace it belongs to, and then adds it to the rest of the `use` statements.

It all works great, but there are times when it shows too much possibilities.

For example, when I want to import the namespace for the `Transaction` class, it finds the correct `Transaction` class, but it also finds functions called `transaction` in my codebase, and then gives me a choice what I want to import:

<a href="/img/posts/vim-tag-search.png"><img src="/img/posts/vim-tag-search.png" class='img-responsive' /></a>

See? One class (kind `c`), and two functions (kind `f`).

I could exclude functions from being generated in tag files, but that's not really an option because there are times when I need the functions tags.

I dove into the `vim-php-namespace` source code, determined to get rid of this "functionality".

Turns out the plugin actually uses a Vim command, called `ptjump`, to search the tags file and show the preview window, so the user can pick out the correct tag in case there's more than one.

## Of course there's an option for that

Then I started reading the help pages for tags in more detail, and after a while I found the answer: `tagcase`.

To quote the help file:

<blockquote>
This option specifies how case is handled when searching the tags file.
</blockquote>

And it has the following options:

 - `followic` Follow the 'ignorecase' option
 - `followscs` Follow the 'smartcase' and 'ignorecase' options
 - `ignore` Ignore case
 - `match` Match case
 - `smart` Ignore case unless an upper case letter is used

I've set it to `smart` and, well, now it does what I want it to do:

``` vim
set tagcase=smart
```

It correctly finds only one match for the `Transaction` class and the plugin inserts the `use` statement for it. Yey!

Happy hackin'!
