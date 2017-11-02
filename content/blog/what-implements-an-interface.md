+++
draft = false
date = "2017-11-02T07:43:21+01:00"
title = "What implements an interface"
slug = "what-implements-an-interface"
description = "It's important that the right thing implements the right interface."
tags = ["php", "interface", "architecture"]
categories = ["Programming", "Development"]
2017 = ["11"]
+++

Creating and implementing interfaces in our code is important. It helps with swapping out components, eases testing, separates the what from the how.

But, it's not enough just to slap an interface on a class and be done with it.

We also need to consider on what are we putting that interface on.

## An example

Say, we're creating a queuing system for an RSS feed reader. We can tell the queue to queue the feed URLs. Depending on our needs, we can use something like RabbitMq, or a database, to use as a queuing mechanism.

We haven't decided on that yet, but either way, we start with an interface for this imaginary queue:

``` php
<?php declare(strict_types=1);

namespace Example\Infrastructure\Queue;

use Example\Domain\Rss\FeedUrl;

interface FeedUrlQueue
{
    public function add(FeedUrl $feedUrl);
}
```

By having this nice little interface, we can TDD the part of the code that will use an implementation of this interface.

After a while we decide we'll go with a database queuing mechanism first, so we create an implementation for the `FeedUrlQueue` interface:

``` php
<?php declare(strict_types=1);

namespace Example\Infrastructure\Storage\Database;

use Example\Domain\Rss\FeedUrl;

class FeedUrlTable extends AbstractTable implements FeedUrlQueue
{
    public function add(FeedUrl $feedUrl)
    {
        $qb = $this->getQueryBuilder();

        $query = $qb->insert('feed_urls')
            ->values(
                [
                    'url' => '?',
                ]
            )
            ->setParameter(0, (string) $feedUrl);

        $query->execute();
    }
}
```

That's nice! We have an interface, a concrete implementation, and the possibility to write new implementations and swap them out with existing ones with little effort.

Job well done.

Is it done, let alone well?

Sure it is, I repeat, we have an interface, a concrete implementation, and the possibility to write new implementations and swap them out with existing ones with little effort.

## Something's fishy

There's three things that stand out for me here, telling me that something is not quite right with this code.

First, a class that represents a `Table`, also is a `FeedUrlQueue`. It really shouldn't be two things at the same time. It either should be a queue, or a table, most certainly not both.

Second, a class whose only responsibility should be to store an URL into a database, no matter from where that URL comes from, is now limited to store feed URLs that come from the queue. OK, this may, or may not be, a legitimate limitation we decided on.

And third, it is also responsible to figure out how can it transform a `FeedUrl` domain object into a string that can be stored in the database. Does it have a `__toString` magic method, so we can cast it to a string? Or maybe it's legacy code so it has one of those `toString()` method which we need to call? We don't know without looking.

## Killing three giants with one stone

A better, a correct way, would be to have something like a `DatabaseFeedUrlQueue` that implements the `FeedUrlQueue`, and uses the `FeedUrlTable`:

``` php
<?php declare(strict_types=1);

namespace Example\Infrastructure\Queue;

use Example\Domain\Rss\FeedUrl;

class DatabaseFeedUrlQueue implements FeedUrlQueue
{
    protected $table;

    public function __construct(FeedUrlTable $table)
    {
        $this->table = $table;
    }

    public function add(FeedUrl $feedUrl)
    {
        $payload = [
            'url' => (string) $feedUrl
        ];
        $this->table->save($payload);
    }
}
```

and the `FeedUrlTable` becomes something like this:

``` php
<?php declare(strict_types=1);

namespace Example\Infrastructure\Storage\Database;

class FeedUrlTable extends AbstractTable
{
    public function save(array $payload)
    {
        $qb = $this->getQueryBuilder();

        $query = $qb->insert('feed_urls')
            ->values(
                [
                    'url' => '?',
                ]
            )
            ->setParameter(0, $payload['url']);

        $query->execute();
    }
}
```

By refactoring the code like this, we pretty much fix all three problems at once:

 - a `DatabaseFeedUrlQueue` is a `FeedUrlQueue`, and the `FeedUrlTable` can stop being two things at once;
 - there's a clearer separation of concerns, the `DatabaseFeedUrlQueue` is responsible to create the payload, and `FeedUrlTable` is responsible to store it;
 - the storage layer knows nothing about our domain objects and how to use them.

Yes, now we have one more class to maintain, but the overall maintainability, I believe, is reduced, as it is much clearer what each class does.

Happy hackin'!
