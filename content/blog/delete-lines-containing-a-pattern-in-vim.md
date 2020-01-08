+++
draft = false
date = 2020-01-08T12:46:23+01:00
title = "Delete lines containing a pattern in vim"
slug = "delete-lines-containing-a-pattern-in-vim"
description = "Use :g/pattern/d to delete all lines containing a pattern in vim"
tags = ["vim", "grep", "delete"]
categories = ["Software", "Development"]
2020 = ["01"]
+++

Today I had to delete all lines from a CSV file where the last column has a `1`:

``` viml
:g/1$/d
```

While short, I can't remember this syntax as I have to search for it every time. I'll try to remember this as "grep for a pattern, and delete" for next time.

Happy hackin'!
