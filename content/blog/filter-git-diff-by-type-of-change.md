+++
draft = false
date = 2020-01-02T14:23:03+01:00
title = "Filter git diff by type of change"
slug = "filter-git-diff-by-type-of-change"
description = "git diff can be filtered with the --diff-filter option"
tags = ["git", "diff", "filter"]
categories = ["Development", "Software"]
2020 = ["01"]
software_versions = ["git 2.17"]
+++

Yesterday I was looking at a rather large diff, but for the type of change I was after, I wanted to look only at the newly added files. Turns out, **git diff** has a filtering option with `--diff-filter`.

The [possible values](https://git-scm.com/docs/git-diff#Documentation/git-diff.txt---diff-filterACDMRTUXB82308203) for the `--diff-filter` are Added (A), Copied (C), Deleted (D), Modified (M), Renamed (R), type changed (T), Unmerged (U), Unknown (X), and some kind of a Broken (B) file(?).

Running `git diff --diff-filter=A` will show the diff only for the added files.

These filtering options can also be provided with lowercase, in which case it will behave as an exclude filter. `git diff --diff-filter=a` will show the diff for all files, except for added ones.

Happy hackin' and a happy new year!
