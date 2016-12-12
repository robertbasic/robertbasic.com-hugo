+++
draft = false
date = "2016-12-12T12:07:56+01:00"
title = "Verbose commits"
slug = "verbose-commits"
description = "Supply -v to git commit to see a diff when writing the commit message"
tags = ["git", "message", "verbose", "diff"]
categories = ["Software", "Development"]
2016 = ["12"]

+++

One thing I recently learned about git, is the `-v` or `--verbose` flag for the `git commit` command. It shows the diff of what is being commited in `$EDITOR` below the commit message
template. Taken directly from `man git commit`:

<a href='/img/posts/verbose-commit.png'><img style='float:right;padding: 10px' src='/img/posts/verbose-commit-small.png' /></a>

> Show unified diff between the HEAD commit and what would be committed at the bottom of the commit message template to help the user describe the commit by reminding what
> changes the commit has. Note that this diff output doesn’t have its lines prefixed with #. This diff will not be a part of the commit message.

I keep double checking the code that I commit, so prior to discovering this flag, I was constantly switching between writing the commit message and seeing what's in the diff. This now
gives me the diff inside `vim`, as that is my specified `$EDITOR`. I can navigate the diff using vim motions, use search, etc, which greatly improves my workflow.

P.S.: I know I saw this from someone on Twitter, but I can't find the original tweet now. Whoever you are, thank you :)
