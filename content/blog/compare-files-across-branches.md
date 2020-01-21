+++
draft = false
date = 2020-01-21T11:20:37+01:00
title = "Compare files across branches"
slug = "compare-files-across-branches"
description = "Compare files across branches for difference with git diff"
tags = ["git", "diff", "branches"]
categories = ["Development"]
2020 = ["01"]
+++

After some bigger rebases in git, I have to compare a file between two branches, most often `master` and the current branch.

``` bash
git diff master my-branch -- file/to/diff
```

The diff will show what was added to the file in `my-branch`, as well what was removed. Helps a lot with fixing conflicts during rebases gone bad.

Happy hackin'!
