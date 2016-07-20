+++
draft = false
date = "2016-07-20T16:55:55+02:00"
title = "Missing colors for PHPUnit"
slug = "missing-colors-for-phpunit"
description = ""
tags = ["phpunit", "php"]
categories = ["Programming", "Software", "Development"]
2016 = ["07"]

+++
I ran accross a minor issue today that I never experienced before. The colors for the [PHPUnit's](https://phpunit.de/) output were missing. I had the `colors=true` directive set in the `phpunit.xml` configuration file, but the output was just black and white.

Turns out I was missing the `posix` extension, which is provided by the `php-process` package on Fedora. After installing it:

``` bash
$ sudo dnf install php-process
```

all was good again in the world of unit testing.

Oh well.

Happy hackin'!
