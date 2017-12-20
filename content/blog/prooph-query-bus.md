+++
draft = false
date = 2017-12-20T10:55:12+01:00
title = "Prooph query bus"
slug = "prooph-query-bus"
description = "How to use the Prooph service bus to dispatch queries to handlers"
tags = ["prooph", "php", "cqrs", "service bus", "query", "query bus"]
categories = ["Programming", "Software", "Development"]
2017 = ["12"]
+++

Continuing on with the [Prooph series](/tags/prooph), I want to take a look at the query bus of the Prooph service bus component. The query bus provides a way to issue a query (not necessarily a database query!) to a query handler. This handler is then responsible to return a result for our query.

Why would we need a query bus in the first place? While some may argue that the query bus is not really required, it can be a nice addition to complete the CQRS idea. Just as we have a single endpoint to handle all of our commands and events, we have a single endpoint that can handle all the queries.

[The query bus](http://docs.getprooph.org/service-bus/overview.html#2-1-7) allows the handler to do whatever it needs to do to return the result, synchronously or asynchronously. This is achieved by having the query bus return a [ReactPHP Promise](/blog/reacting-to-promises). The query handler itself will be a deferred unit of work, which allows it to promise to the querier that the query will be resolved or rejected sometime in the future.

Every query message we send with the query bus, must be routed to exactly one query handler on the other side. Of course, multiple query messages can be routed to the same handler.

Prooph's service bus also supports a [plugin system](http://docs.getprooph.org/service-bus/plugins.html) which we can use, for example, to have authorization of commands, events, and queries, logging... But more on that in a future blog post.

## A quick example

The query message, just as a command or an event, can be pretty much anything &mdash; a primitive like a string or an integer, a custom data transfer object, or a class implementing the `Prooph\Common\Messaging\Message` interface by extending the `Query` class from the `prooph-common` library.

Setting up the query bus for using it is similar to setting up the command bus or the event bus:

 - we create the query bus,
 - we create a query router that the query bus uses to route query messages to query handlers,
 - we route a query message to its query handler,
 - we attach the router to the query bus,
 - and finally, we dispatch the query on the query bus.

Let's see how it looks like in code:

<div class="filename">query-bus.php</div>
``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\Plugin\Router\QueryRouter;
use Prooph\ServiceBus\QueryBus;

$queryBus = new QueryBus();

$queryRouter = new QueryRouter();

$queryRouter->route('A simple string')
            ->to(new ProophExample\QueryHandler\Primitives());

$queryRouter->attachToMessageBus($queryBus);

$queryBus->dispatch('A simple string')
         ->done(function($result) {
            echo $result . PHP_EOL;
         }, function ($reason) {
            echo $reason . PHP_EOL;
         });
```

Not much going on but it shows how to set up and use the query bus.

The query handler part of this example looks like this:

<div class="filename">src/ProophExample/QueryHandler/Primitives.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\QueryHandler;

use React\Promise\Deferred;

class Primitives
{
    public function __invoke(string $query, Deferred $deferred)
    {
        $i = rand(1, 10);

        if ($i % 2 == 0) {
            $deferred->resolve(str_rot13($query));
        } else {
            $deferred->reject("Out of luck");
        }
    }
}
```

The query handler is an invokable that gets invoked with the string query and a `React\Promise\Deferred` unit of work, which we use to either `resolve` or `reject` the query.

While this example with the primitives gives an overall picture of how to use the query bus, it's not really useful.

## How many open CFPs are on JoindIn?

[JoindIn](https://joind.in/) has an open [API](https://api.joind.in/) which we can use to query it about events, like conferences and meetups. I think we can use it to show a better example of the query bus.

We're going to have a query message that we'll use to pass the type of the event we're interested in &mdash; all, hot, upcoming, past, cfp &mdash; and a query handler that will assemble the URL for the API call and call it with a simple `file_get_contents`.

The query message for this example looks something like the following:

<div class='filename'>src/ProophExample/Query/JoindInEvents.php</div>
``` php
<?php declare(strict_types=1);
namespace ProophExample\Query;

use Assert\Assertion;

class JoindInEvents
{
    private $type;
    public function __construct(string $type)
    {
        Assertion::choice($type, ['all', 'hot', 'upcoming', 'past', 'cfp']);
        $this->type = $type;
    }

    public function type(): string
    {
        return $this->type;
    }
}
```

We pass it in a string `$type`, assert that it is one of the expected values and set it as a class property. Really not much else to it than that.

The query handler will handle that query, issue the API call and resolve the React promise if it manages to decode the JSON response, or reject it if it fails:

<div class="filename">src/ProophExample/QueryHandler/JoindInEvents.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\QueryHandler;

use ProophExample\Query\JoindInEvents as Query;
use React\Promise\Deferred;

class JoindInEvents
{
    public function __invoke(Query $query, Deferred $deferred)
    {
        $url = 'https://api.joind.in/v2.1/events';

        $eventType = $query->type();

        if ($eventType != 'all') {
            $url .= '?filter=' . $eventType;
        }

        $response = file_get_contents($url);

        $jsonResponse = json_decode($response);

        if ($jsonResponse === null) {
            $deferred->reject("Error decoding json: " . json_last_error_msg());
        }

        $deferred->resolve($jsonResponse);
    }
}
```

In a real production code we'd probably use a proper HTTP client instead of `file_get_contents`, do more error checking and stuff, but in only a few lines of code we can see how to create a query handler.

To put it all together and call it, we'd have something like the following example:

<div class="filename">query-bus.php</div>
``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\Plugin\Router\QueryRouter;
use Prooph\ServiceBus\QueryBus;

$queryBus = new QueryBus();

$queryRouter = new QueryRouter();

$queryRouter->route(ProophExample\Query\JoindInEvents::class)
            ->to(new ProophExample\QueryHandler\JoindInEvents());

$queryRouter->attachToMessageBus($queryBus);

$queryBus->dispatch(new ProophExample\Query\JoindInEvents('cfp'))
         ->done(function($result) {
            echo sprintf("There are %d CFPs!", $result->meta->count) . PHP_EOL;
         }, function($reason){
            echo $reason . PHP_EOL;
         });
```

If the query message was resolved by the query handler we print out how many CFPs are there right now, and if the query handler rejected the query message, we print out the reason of rejection.

As with the command and the event bus, the examples seen here are available in my [prooph-examples](https://github.com/robertbasic/prooph-examples) repository.

Happy hackin'!

P.S.: Thanks to [Alexander Miertsch](https://github.com/codeliner) for helping me understand the query bus a little more!
