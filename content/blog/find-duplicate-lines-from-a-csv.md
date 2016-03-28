+++
date = "2016-03-21T13:35:16+01:00"
title = "Find duplicate lines from a CSV"
slug = "find-duplicate-lines-from-a-csv"
description = "Linux shell commands to find duplicate lines from a CSV"
tags = ["linux", "shell"]
categories = ["Development"]
2016 = ["03"]
+++

Finding duplicate lines from a CSV file is something I have to do from time to time, yet not on a regular enough basis to remember it all. Plus, I'm trying to blog more often.

``` bash
cut -d, -f1 file.csv | tr -d '"' | sort | uniq -dc
```

<code>cut</code> to split the lines at the commas and select the first field, then <code>tr</code> to delete any double quotes that encloses the field, then <code>sort</code> and finally with <code>uniq</code> to show only the duplicated lines and to prefix every line with the count of occurrences.
