+++
draft = false
date = "2016-03-25T10:28:43+01:00"
title = "Vim Hugo helper"
slug = "vim-hugo-helper"
description = "A small Vim plugin to help with writing posts with Hugo"
tags = ["vim", "plugin", "hugo"]
categories = ["Programming", "Development"]
2016 = ["03"]

+++

I think I just wrote my [first Vim plugin](https://github.com/robertbasic/vim-hugo-helper). OK, it's more a bunch of Vim functions slapped together than an actual plugin, but gotta start somewhere, right?

Last week I converted this blog to a static web site and I'm using [Hugo](https://gohugo.io) as the static website engine. Writing posts is a lot easier now, plus it's written in [Go](https://golang.org), which I started learning a few weeks ago.

[Vim Hugo helper](https://github.com/robertbasic/vim-hugo-helper) is a plugin, collection of Vim functions that help me while writing posts. It will hopefully speed up a few recurring tasks such as drafting and undrafting posts, inserting code highlight blocks, etc. I guess I'll be adding more to it in the future, but for now it has a total of 5 functions.

### Front matter reorder

Hugo posts have a [front matter](https://gohugo.io/content/front-matter/) which is basically meta data for the content. Hugo will create the front matter out of an [archetype](https://raw.githubusercontent.com/robertbasic/robertbasic.com-hugo/master/themes/robertbasic.com/archetypes/default.md) which is a template of sorts for the front matter. One thing I don't like is that when a new post is created, the meta data is sorted alphabetically so the <code>HugoHelperFrontMatterReorder</code> function reorders it in the way that I do like.

### Drafting/undrafting posts

The <code>HugoHelperDraft</code> and <code>HugoHelperUndraft</code> functions simply draft and undraft posts by setting the <code>draft</code> meta data in the front matter to either <code>true</code> or <code>false</code>.

### Code highlight blocks

The <code>HugoHelperHighlight('language')</code> function inserts the [highlight](https://gohugo.io/extras/highlighting/#usage) shortcode that comes built-in with Hugo and sets the language of the highlight block.

### Setting the date of the post

Finally, the <code>HugoHelperDateIsNow</code> function sets the <code>date</code> meta data of the post to the current date and time.

It's not much, definitely has room for improvements, but I used it even when writing this very post, so I guess this helper is helpful.
