+++
draft = false
date = 2020-01-03T09:40:58+01:00
title = "Making it easier to blog"
slug = "making-it-easier-to-blog"
description = ""
tags = ["blogging", "hugo", "vim", "helpers"]
categories = ["Blablabla"]
2020 = ["01"]
+++

2019 was a not so great year for my blogging. 7 posts in total. There are multiple reasons for that, all the regular stuff like "I didn't find the time" and "Nothing to blog about".

Currently I'm reading [Atomic habits](https://www.goodreads.com/book/show/46390365-atomic-habits) (great book by the way, do read it if you haven't!), and one of the suggestions for starting a new habit is to make it easy to do it. So, here we are.

This blog is powered by a [static web site generator, Hugo](https://gohugo.io/), I write the posts in plain ol' markdown files, and use (g)vim as the editor. I even created a [vim plugin](https://github.com/robertbasic/vim-hugo-helper) to speed some things up with Hugo. Once a new post is written, I use [fabric](http://www.fabfile.org/) to build and deploy the site to my server. Pretty easy.

After giving it a bit more thought, there are still some steps in this entire process that I can speed up with a few more vim helpers, and a couple of bash functions.

## bash

I wrote four little bash functions to make my blogging even easier than before:

The `blog` function takes me to directory where I keep my blog, starts Hugo's server in the background, waits a bit so that the site is up, and opens up my local blog in Firefox. Given that it's a bash function, I can create a [custom action](https://docs.xfce.org/xfce/xfce4-appfinder/examples) in XFCE's Application finder.

<div class='filename'>~/.bashrc</div>

``` bash
function blog() {
    cd "/home/robert/projects/robertbasic.com-hugo/"
    hugo server &> blog.log &
    sleep 3s
    firefox http://localhost:1313/blog/
}
```

`blog-stop` stops the hugo server and cleans up.

<div class='filename'>~/.bashrc</div>

``` bash
function blog-stop() {
    cd "/home/robert/projects/robertbasic.com-hugo/"
    pkill hugo
    rm blog.log
}
```

`blog-new` creates a new blog post and opens it up in gvim.

<div class='filename'>~/.bashrc</div>

``` bash
function blog-new() {
    hugo new blog/$1.md
    gvim content/blog/$1.md
}
```

`blog-drafts` lists all the drafts I currently have. They tend to pile up after a while.

<div class='filename'>~/.bashrc</div>

``` bash
function blog-drafts() {
    ag -l "draft = true" content
}
```

## vim

As for vim, I have the [vim-hugo-helper plugin](https://github.com/robertbasic/vim-hugo-helper), and one custom vim function that I call on a new post:

<div class='filename'>~/.vimrc</div>

``` viml
command! BlogWrite call BlogWrite()
function! BlogWrite()
    call HugoHelperFrontMatterReorder()
    HugoHelperTitleToSlug
    HugoHelperTitleCase
    HugoHelperSpellCheck
endfun
```

It calls the four Hugo helper functions that I used to call manually every time.

There's still room for improvement, but this will do for now. I also want to figure out a way to blog from my phone, I have a few ideas for that as well. Need to test them out and see what works best.

Happy hackin'!
