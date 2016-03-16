+++
date = "2016-03-09T22:07:46+02:00"
title = "Tags for PHP in Vim"
slug = "tags-for-php-in-vim"
description = "Vim setup to get tags support for PHP"
tags = ["vim", "tags", "gutentags", "tagbar", "lightline", "php"]
categories = ["Software", "Programming", "Development"]
+++
One thing I was missing for a long time in Vim is to be able to "jump to definition" in an easy and painless way.

The other thing I wanted to improve is to be able to tell easily where am I actually in the code base; to see the current class and method name of wherever the cursor was.

With a bit of googling and poking around, I finally came up with a perfect combo of 5 plugins (yep, five!) that enables me to do both, and a little bit of extra.

<h3>
Tags made easy
</h3>

<a href="https://github.com/ludovicchabant/vim-gutentags">Gutentags</a>&nbsp; is a brilliant Vim plugin that makes it so easy to have tags. Just install the plugin and boom! Tags! It will figure out things on it's own and just generate the tags in the background. I use it daily for a fairly large code base and I never had any problems with the tags, or with Vim being unresponsive while the tags are being generated.

The only two settings I have set for it is what to exclude and where to store the tag files to not pollute the current project with them.

{{< highlight bash >}}
let g:gutentags_exclude = ['*.css', '*.html', '*.js']
{{< /highlight >}}

{{< highlight bash >}}
let g:gutentags_cache_dir = '~/.vim/gutentags'
{{< /highlight >}}

That's it.

<h3>Jump to definition</h3>

Pair gutentags with <a href="https://github.com/ctrlpvim/ctrlp.vim">CtrlP</a>  and it's <code>CtrlPTag</code> method and you get jump to definition.

{{< highlight bash >}}
map <silent> <leader>jd :CtrlPTag<cr><c-\>w
{{< /highlight >}}

Move to the method name you're interested in, hit <code><leader>jd</code> and it will jump to it's definition. Tip: <code><C-\>w</code> means "insert word under cursor".

<h3>Where the hell am I?</h3>

<img unselectable="on" style="cursor: default; float: right; margin: 0px 0px 10px 10px;" src="http://robertbasic.com/static/img/posts/vim-lightline-tagbar.png">

My second requirement for displaying the current class and method name was a bit more difficult to fulfill. It takes the <a href="https://github.com/majutsushi/tagbar">tagbar</a>, <a href="https://github.com/vim-php/tagbar-phpctags.vim">tagbar-phpctags</a>  and <a href="https://github.com/itchyny/lightline.vim">lightline</a>  plugins as well as the <a href="https://github.com/vim-php/phpctags">phpctags</a>  tag generator to accomplish that.

Let the tagbar plugin know where the phpctags bin is:

{{< highlight bash >}}
let g:tagbar_phpctags_bin='~/.vim/phpctags'
{{< /highlight >}}

This will make the tagbar plugin use phpctags to generate tags for the current file. To finally display the current tag in lightline, I wrote a simple tagbar component for it:

{{< highlight bash >}}
'tagbar': '%{tagbar#currenttag("[%s]", "", "f")}'
{{< /highlight >}}

My complete lightline settings at the time of writing this can be found <a href="https://github.com/robertbasic/vimstuff/blob/178e2ed445dd11f564ab0c5f71b23eb6dc89f918/.vimrc#L222-L238">here</a>.
