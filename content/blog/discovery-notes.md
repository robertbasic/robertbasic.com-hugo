+++
draft = false
date = 2020-10-19T06:04:44+02:00
title = "Discovery notes"
slug = "discovery-notes"
description = "Keeping notes about a legacy project helps with understanding it."
tags = ["documentation", "notes"]
categories = ["Legacy", "Development"]
2020 = ["10"]
+++

Starting to work on an existing application, on a code base that exists since the beginning of the times, can be daunting. Complicated and complex features, new terms, most likely non-existing documentation, or documentation that is out of date. All that can seem too much. One thing that has always helped me is keeping notes of what I discover over time working with a legacy codebase. "Discovery notes" if you will.

We can write down these discovery notes in a notebook, into a set of "scratch" files, a wiki...

## Paper or file?

For me it's faster to write notes on a paper, I can draw sketches and diagrams. Paper has this freedom of not necessarily needing to be written top-down left-to-right like in a file. The downsides of writing notes on a paper is my handwriting, it's harder to organize paper notes, and it's pretty much impossible to search them.

File notes are a bit slower to write, there's always that decision making process of "where should I put this file, how should I call it" (even though files can be easily moved and renamed, but hey, naming things was always one the hardest things in working with computers). I also really miss the freedom of paper when writing notes in a file. Then again, we can neatly organize files, we can search them, we can link different documents together, create tables of contents automatically.

My current preference for keeping notes about a project are markdown files kept in a git repository, hosted on either Github or Gitlab, as they both render markdown files for a better reading experience. In rare occasions I mix paper and files, by drawing diagrams and sketches on a piece of paper, taking a picture of it with my phone and then inlining that picture in the file.

When it comes to the tools that I use for writing notes, I try to keep it as simple as possible. Few external dependencies, if any. The system of keeping notes has to be a no-brainer when we need to write them, and it has to be even simpler when we want to read them. If writing needs a special editor, that's a bad sign. If generating a readable format of the notes needs a special build system in place, that's a very bad sign.

## Contents of notes

As for the contents of these notes, anything goes really. How does a method work, what's the code path of a certain feature, why is something made the way it is. If I spend time figuring it out, I'll write it down. If it's not immediately obvious how it works, I'll write it down. If I had to ask someone else about it, I'll write it down.

I consider these discovery notes a separate thing from the project's documentation. Over time I might rewrite some of these notes in a more "formal tone" and add them to the general docs.

Of course, these notes come at a slow pace in the beginning. It takes time to get to know a project. But, after some time, I take a look back at all the things I have written down and feel glad that I did, because these notes are the trail of the things I learned along the way.

[Mark](https://twitter.com/Mark_Baker/status/1317425124690231297) writes notes on paper and then retypes them to a digital format. [Nebojsa](https://twitter.com/nebojsac/status/1317430215711346691) writes markdown files and renders them with mkdocs. [Andreas](https://twitter.com/localheinz/status/1317425378948939776) has a nice set up with a `.notes` folder. [Jeroen](https://twitter.com/n0x13/status/1317426710267179008) also does markdown files, with specific ones like "glossary.md", architecture decision records, and so on.

What's your way of keeping notes? Let me know via [email](contactme@robertbasic.com) or on [Twitter](https://twitter.com/robertbasic).

Happy hackin'!
