+++
draft = false
date = "2016-03-28T19:33:43+02:00"
title = "GitHub flavoured code fences in Hugo"
slug = "github-flavoured-code-fences-in-hugo"
description = "Easier syntax highlighting in Hugo"
tags = ["hugo", "syntax", "highlight"]
categories = ["Programming", "Software", "Development"]
2016 = ["03"]

+++

This was an undocumented feature [until today](https://github.com/spf13/hugo/pull/2024), so I missed it when I was converting my site to [Hugo](https://gohugo.io) last week. It is also possible to highlight code examples with GitHub flavoured code fences, or, in other words, with triple backticks <code>```</code>.

I like this a lot because it makes highlighting code in posts easier. Typing the <code>&#123;&#123;< highlight >&#125;&#125;</code> shortcode is just awkward and I always end up forgetting either the angle brackets or add too much or too little currly brackets. Backticks are much nicer.

The code fences are not enabled by default, though. We need to set `PygmentsCodeFences` to `true` in Hugo's configuration file and that's about it. Everything else about [syntax highlighting](http://gohugo.io/extras/highlighting/) stays the same.

### Change to backticks in old posts

I used these two simple `sed` one-liners to change all the highlighting shortcodes to the code fences:

``` bash
find -name "*.md" -print0 | xargs -0 sed -i 's/&#123;&#123;< highlight \([a-z]*\) >&#125;&#125;/``` \1/g'
find -name "*.md" -print0 | xargs -0 sed -i 's/&#123;&#123;< \/highlight >&#125;&#125;/```/g'
```

Now I don't even need a custom [Vim function](https://github.com/robertbasic/vim-hugo-helper/blob/aca051a727357d0b7331c123de879ef03c82da2e/plugin/hugo-helper.vim#L35-L39) to insert the highlighting shortcode. Sweet.
