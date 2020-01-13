+++
draft = false
date = 2020-01-13T09:38:18+01:00
title = "A refactoring example"
slug = "a-refactoring-example"
description = "A short refactoring example"
tags = ["php", "refactor", "example", "srp"]
categories = ["Programming", "Development"]
2020 = ["01"]
+++

I'm working on a small side project to gather stats about my blog. Posts published, words written, number of code examples. Good for practicing TDD. I want to share how I made one part of it better.

This part is a post collector that goes through a folder and collects post files. The first version of the `PostCollector` iterates over a path with `DirectoryIterator`. It finds all markdown files and creates a `Post` from them:

<div class='filename'>PostCollector.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use DirectoryIterator;
use Generator;
use SplFileInfo;

class PostCollector
{
    public function collectFrom(string $path): Generator
    {
        $directory = new DirectoryIterator($path);

        foreach($directory as $file) {
            if ($this->isAPostFile($file)) {
                yield Post::fromFile($file);
            }
        }
    }

    private function isAPostFile(SplFileInfo $file): bool
    {
        if (! $file->isFile() || ! $file->isReadable()) {
            return false;
        }

        if ($file->getExtension() !== 'md') {
            return false; }

        return true;
    }
}
```

The `PostCollector` works and the tests are green, but it can be better. It does too many things, breaks the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle):

 - creates a directory iterator from the `$path` argument,
 - iterates over the directory,
 - decides is a file a post file,
 - creates the post file.

The `Post` that the `PostCollector` creates does nothing:

<div class='filename'>Post.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use SplFileInfo;

class Post
{
    private SplFileInfo $file;

    private function __construct(SplFileInfo $file)
    {
        $this->file = $file;
    }

    public static function fromFile(SplFileInfo $file): self
    {
        return new self($file);
    }
}
```

Let's improve the `PostCollector`. We remove the internal `DirectoryIterator`. Instead, we pass in a `ContentDirectory` which better describes the type we are working with:

<div class='filename'>PostCollector.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use Generator;

class PostCollector
{
    public function collectFrom(ContentDirectory $contentDirectory): Generator
    {
        foreach($contentDirectory as $file) {
            if ($this->isAPostFile($file)) {
                yield Post::fromFile($file);
            }
        }
    }

    private function isAPostFile(SplFileInfo $file): bool
    {
        // No changes here from the previous example...
    }
```

The `PostContent` has one responsibility less. Progress!

`ContentDirectory` is a `DirectoryIterator`:

<div class='filename'>ContentDirectory.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use DirectoryIterator;

class ContentDirectory extends DirectoryIterator
{
}
```

I feel like the `ContentDirectory` wants to be an interface though. Let's try that:

<div class='filename'>ContentDirectory.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

interface ContentDirectory
{
}
```

As we are getting the post files from a local content directory, let's have that implement our content directory interface:

<div class='filename'>LocalContentDirectory.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use DirectoryIterator;

class LocalContentDirectory extends DirectoryIterator
                            implements ContentDirectory
{
}
```

If we keep in mind the "composition over inheritance" rule, then the `extends DirectoryIterator` part stands out. We can make the `LocalContentDirectory` a wrapper around `DirectoryIterator`:

<div class='filename'>LocalContentDirectory.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use DirectoryIterator;

class LocalContentDirectory implements ContentDirectory
{
    private DirectoryIterator $directory;

    public function __construct(DirectoryIterator $directory)
    {
        $this->directory = $directory;
    }
}
```

If we remember, we loop over the contents our of `ContentDirectory` in the `PostCollector`. A way to do it is to have our `LocalContentDirectory` be an `Iterator` as well. The iterator methods will call the methods on our internal `DirectoryIterator`:

<div class='filename'>LocalContentDirectory.php</div>

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use DirectoryIterator;
use Iterator;

class LocalContentDirectory implements ContentDirectory, Iterator
{
    private DirectoryIterator $directory;

    public function __construct(DirectoryIterator $directory)
    {
        $this->directory = $directory;
    }

    public function current()
    {
        return $this->directory->current();
    }

    public function next()
    {
        $this->directory->next();
    }

    public function key()
    {
        return $this->directory->key();
    }

    public function valid()
    {
        return $this->directory->valid();
    }

    public function rewind()
    {
        $this->directory->rewind();
    }
}
```

The code looks better. We have a content directory type marked by the `ContentDirectory` interface. We have our local content directory `LocalContentDirectory` that implements the `ContentDirectory` interface. Internally it uses a `DirectoryIterator` and itself is a type of `Iterator` which makes it possible to loop over it.

As a final step, let's tackle the fact that the `Post` does nothing, only holds a reference to the `SplFileInfo` object. One thing I didn't like about the `PostCollector` is that **it was deciding** whether a file is a post or not. This is the job for the `Post` object. Let's have it decide for its own whether a file is a Post or not:

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use SplFileInfo;

class Post
{
    private SplFileInfo $file;

    private function __construct(SplFileInfo $file)
    {
        if (! $file->isFile()) {
            throw new \RuntimeException('File is not a file');
        }
        if (! $file->isReadable()) {
            throw new \RuntimeException('File is not readable');
        }
        if (! $this->fileHasMarkdownExtension($file)) {
            throw new \RuntimeException('File does not have a markdown extension');
        }

        $this->file = $file;
    }

    public static function fromFile(SplFileInfo $file): self
    {
        return new self($file);
    }

    private function fileHasMarkdownExtension(SplFileInfo $file): bool
    {
        return $file->getExtension() == 'md';
    }
}
```

And now our PostCollector becomes what we wanted it to be &mdash; a collector of post files:

``` php
<?php declare(strict_types=1);

namespace RobertBasic\HugoStats;

use Generator;

class PostCollector
{
    public function collectFrom(ContentDirectory $directory): Generator
    {
        foreach($directory as $file) {
            try {
                yield Post::fromFile($file);
            } catch (\RuntimeException $runtimeException) {
                continue;
            }
        }
    }
}
```

For every file in our content directory, we try to create a Post from it. If we don't succeed, then we carry on as if nothing happened, otherwise we `yield` the `Post` file for further use.

From a `PostCollector` that did too many things, we now have 3 things each doing their job. A `LocalContentDirectory` responsible for getting the files from a folder. A `Post` responsible for deciding is a `SplFileInfo` a post file or not. `PostCollector` iterating over the files and creating `Post`s out of them.

What would you do differently? Do you see room for more improvement? Let me know on [Twitter](https://twitter.com/robertbasic) or drop me an <a href='mailto:contactme@robertbasic.com'>email</a>.

Happy hackin'!
