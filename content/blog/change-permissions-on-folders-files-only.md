+++
date = "2011-01-11T21:45:52+02:00"
title = "Change permissions on folders/files only"
slug = "change-permissions-on-folders-files-only"
description = "Change permissions on folders/files only"
tags = ["permissions", "shell"]
categories = ["Development"]
2011 = ["01"]
+++
This is just a quick reminder for myself. Should really remember this one. Changes permissions on folders|files only.

{{< highlight bash >}}
$ find /path/to -type d -exec chmod 775 {} \;
$ find /path/to -type f -exec chmod 664 {} \;
{{< /highlight >}}
