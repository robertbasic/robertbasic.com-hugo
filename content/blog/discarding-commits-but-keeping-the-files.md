+++
draft = false
date = 2020-01-31T11:12:47+01:00
title = "Discard commits but keep the files"
slug = "discard-commits-but-keep-the-files"
description = "Discard commits but keep the files with git reset HEAD^"
tags = ["git", "reset", "uncommit", "rebase"]
categories = ["Development"]
2020 = ["01"]
+++

As I was working on a feature today, I realized I went down a wrong path on how the code should look like. I did end up with something I do like, just the history up until this point was pretty messy.

I want the current state to be a new starting point. One way I could do this is by creating a new branch, copy paste the files over from the old branch into the new branch and start committing away piece by piece.

Turns out, `git reset HEAD^` does what I want it to do &mdash; it "uncommits". It removes the last commit from HEAD but leaves the files intact.

What I did was squashed all of the "bad" commits I had into a single commit with interactive rebase:

```
git rebase -i HEAD~11
```

and then did the "uncommit":

```
git reset HEAD^
```

Now all my files are here in the state I want them, without any of the commits in the history.

This is probably not my greatest moment in git history, but it does what I want it to do.

Happy hackin'!
