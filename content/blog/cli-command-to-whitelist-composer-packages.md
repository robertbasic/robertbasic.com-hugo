+++
draft = false
date = 2017-12-04T08:13:00+01:00
title = "CLI command to whitelist Composer packages"
slug = "cli-command-to-whitelist-composer-packages"
description = "I love solving problems in the command line."
tags = ["cli", "shell", "bash", "composer"]
categories = ["Development", "Software"]
2017 = ["12"]
+++

[James](https://www.jamestitcumb.com/) asked this question the other day on [Twitter](https://twitter.com/asgrim/status/936938850471022593):

<blockquote>
#LazyWeb is there a way to do a composer update of everything except a specific package or two? like `composer update --exclude doctrine/orm --exclude doctrine/dbal` or something? I don't want to have to whitelist everything all the time (there's bigger problems ofc)
</blockquote>

Given that [Composer](https://getcomposer.org) has no `--exclude` flag or similar, the only other option is to create a list of packages we allow to be updated, excluding the ones we don't want to be updated. We need to create a whitelist.

Creating it manually would be a PITA though, especially if there's a lot of packages to include or exclude.

CLI to the rescue!

``` text
composer info | grep -v ^doctrine | sed 's/  \+/:/g' | cut -d: -f1 | paste -sd\ 
```

Note: There's a single whitespace after the last backslash `\`.

This would result in a list of packages in a single line, something like:

``` text
beberlei/assert composer/ca-bundle container-interop/container-interop guzzlehttp/guzzle mockery/mockery
```

## Let's break it down

The `composer info` command shows information about the installed packages. The output is in the format of:

``` text
vendor1/package1      vx.y.z      Package 1 description
vendor1/package2      vx.y.z      Package 2 description
vendor2/package       vx.y.z      Package description
```

It's all text so we can work with that.

The next step is to remove the packages we **don't** want to be in our whitelist. We do that with `grep -v ^package1` &mdash; search for and output anything that does not start with `package1`.

We are only interested in the `vendor/package` parts of the `composer info` output as that's all we'll need eventually for the `composer update` command.

When we have text that is formatted in columns, we can use the `cut` command to split these columns by a delimiter. There is a delimiter in the above output from `composer info`, but the delimiter is a varying number of whitespaces. That's not really helpful.

What can we do now? Using `sed` we can replace those whitespaces to something that's easier to use as a delimiter in `cut`, a colon `:` for example. `sed 's/  \+/:/g'` searches for two or more consecutive spaces and replaces them with a single `:` (not really visible, but the `/  \+/` part has two space characters between `/` and `\`).

The output at this point would look something like this:

``` text
vendor1/package1:vx.y.z:Package 1 description
vendor1/package2:vx.y.z:Package 2 description
vendor2/package:vx.y.z:Package description
```

Now we can use the `cut` command, tell it to use the colon as a delimiter with `-d:` and to take only the first field with `-f1`.

Finally, we use the `paste` command to merge lines together to get the final output. The `s` option is to merge horizontally and the `d\ ` tells it to join using a single space character (again, it's not really visible, but there is a single space character after the `\` character).

Feel free to convert this one liner to a shell script that takes the package names as arguments so it's a bit more reusable for future uses :)

Happy hackin'!
