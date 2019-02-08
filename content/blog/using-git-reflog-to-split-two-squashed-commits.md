+++
draft = false
date = 2019-02-08T18:20:25+01:00
title = "Use git reflog to split two squashed commits"
slug = "use-git-reflog-to-split-two-squashed-commits"
description = "I accidentally squashed two commits together, used git reflog to split them back"
tags = ["git", "reflog", "squash", "rebase"]
categories = ["Development", "Software"]
2019 = ["02"]
+++

Today I was using [interactive git rebase](http://www.pauline-vos.nl/git-legit-cheatsheet/#interactive-rebase) to squash some commits together to clean up the commit history of a git branch. At one point I went a bit overboard with it and squashed together two commits by mistake.

I've heard somewhere from someone that in git you pretty much can't lose code because everything is in the [git reflog](https://git-scm.com/docs/git-reflog). Today I decided to put that to the test.

Spoiler alert: git reflog saved the day.

## The setup

We start with two separate commits, "Commit 1" and "Commit 2":

``` bash
> git hist
* c3fa1d6 -  (HEAD -> reflog-undo-squash) Commit 2 [Robert Basic 4 seconds ago]
* db73960 -  Commit 1 [Robert Basic 56 seconds ago]
```

Using `git rebase -i HEAD~2` we start the interactive rebase for the last two commits:

``` bash
pick db73960 Commit 1
f c3fa1d6 Commit 2
```

We choose to `fixup` "Commit 2" with "Commit 1", which means that the second commit will be squashed with the first commit, discarding the commit message of the second commit.

Uh oh, that was a mistake, and our commit history now looks like this:

``` bash
> git hist
* 786865f -  (HEAD -> reflog-undo-squash) Commit 1 [Robert Basic 5 minutes ago]
```

Our nice little "Commit 2" is now gone and before we start panicking and making more damage, let's take a look at the git reflog to see what we have there.

## Looking at the reflog

The git reflog right after the bad rebase shows us the following:

``` bash
> git reflog
786865f (HEAD -> reflog-undo-squash) HEAD@{0}: rebase -i (finish): returning to refs/heads/reflog-undo-squash
786865f (HEAD -> reflog-undo-squash) HEAD@{1}: rebase -i (fixup): Commit 1
0a8f291 HEAD@{2}: rebase -i (pick): Commit 1
684d689 HEAD@{3}: rebase -i (pick): Commit 1
5761a21 HEAD@{4}: rebase -i (start): checkout 5761a21b0c0a1f12ab1c60bfef1f1d111ba699c0
c3fa1d6 HEAD@{5}: commit: Commit 2
db73960 HEAD@{6}: commit (initial): Commit 1
```

The thing at `HEAD@{6}` was the first thing that happened and the thing at `HEAD@{0}` is whatever is going on right now.

What we want the current state to be is the state before we started the rebase process, that is the state at `HEAD@{5}`. To do that we "reset" our state to that point in time:

``` bash
> git reset HEAD@{5}
```

And now our git history is back to it's pre-rebase state:

``` bash
> git hist
* c3fa1d6 -  (HEAD -> reflog-undo-squash) Commit 2 [Robert Basic 15 minutes ago]
* db73960 -  Commit 1 [Robert Basic 16 minutes ago]
```

Note that even the commit `sha`s are back to their pre-rebase values, `db73960` and `c3fa1d6`.

The Atlassian [git reflog tutorial](https://www.atlassian.com/git/tutorials/rewriting-history/git-reflog) goes into more detail, so make sure to read that as well.

Happy hackin'!
