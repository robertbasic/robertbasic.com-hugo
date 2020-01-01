+++
draft = false
date = 2018-01-24T13:25:08+01:00
title = "Static web pages in Hugo"
slug = "static-web-pages-in-hugo"
description = "Writing down for future me the steps I did to create a simple page for my Talks"
tags = ["hugo", "blog", "talks"]
categories = ["Blablabla", "Software"]
2018 = ["01"]
+++

Last week I created a page on this site that holds all the [talks I have prepared](/talks/) for meetups and conferences. As this site is powered by [Hugo](https://gohugo.io/), the process wasn't that straightforward. I want to write down the steps I did to make it easier in the future.

Oh, and when I say "static" in the title of this post, I mean pages whose content is not *completely* powered by a markdown content file.

I have tried different approaches, but what ended up working is the following.

In the configuration file, I added a new type of permalink:

<div class="filename">config.toml</div>

``` text
[permalinks]
    talks = "/talks/"
```

I created a new type of [an archetype](https://gohugo.io/content-management/archetypes/) under the `archetypes` directory of my theme:

<div class="filename">themes/robertbasic.com/archetypes/talks.md</div>

``` text
+++
draft = false
date = {{ .Date }}
title = "{{ replace .TranslationBaseName "-" " " | title }}"
+++
```

I have also created a new template file for that `talks` type, which actually has all the content I want to display, but is also capable of using the partials I have created before:

<div class="filename">themes/robertbasic.com/layouts/static/list.html</div>

``` html
{{ partial "header.html" . }}
...
&lt;div class="post">
    &lt;h1>
        Talks
    &lt;/h1>
    ...
&lt;/div>
&lt;div class="column">
    {{ partial "sidebar.html" . }}
&lt;/div>
...
{{ partial "footer.html" . }}
```

And finally create a markdown file for it with `hugo new talks/page.md`, leaving it as is.

Happy hackin'!
