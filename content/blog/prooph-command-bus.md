+++
draft = true
date = 2017-11-03T09:10:53+01:00
title = "Prooph command bus"
slug = "prooph-command-bus"
description = ""
tags = [""]
categories = [""]
2017 = ["11"]
+++

Prooph is a CQRS and Event Sourcing component for PHP, and as they state on their website, they:

<blockquote>
[Prooph components] include everything to get you started with CQRS and Event Sourcing.
</blockquote>

CQRS and Event Sourcing go hand in hand with Domain Driven Design, and are patterns and methodologies that are here to help us make complicated and complex software designs more manageable, and all around better. Or make them even more complicated and complex.

In any case, I believe DDD is the way to go forward, as it puts communication with business stakeholders front and center, and at the end of the day, communication is the key to the success of any software project.

## A sprinkle of theory

CQRS stands for Command Query Responsibility Segregation.

It boils down to the idea that instead of having one model that does both writing to and reading from the storage layer, you instead split them in two separate models. Then one of those models is responsible only for writing, and the other model is responsible for reading. The write "side" handles the command part, and the read "side" handles the query part of these responsibilities.

If you're interested in more theory around this, and you should be, read this article on [CQRS by Martin Fowler](https://martinfowler.com/bliki/CQRS.html) and this [Clarified CQRS article by Udi Dahan](http://udidahan.com/2009/12/09/clarified-cqrs/). The [CQRS journey on MSDN](https://msdn.microsoft.com/en-us/library/jj554200.aspx) and the [CQRS pattern documentation](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) helped me a great deal to get a better understanding of this topic.

As for Event Sourcing... We'll get to that in another blog post, when we'll talk about the Event Sourcing part of Prooph.

## The command bus

Now, let's get started with Prooph. The first component we're going to look at is the service bus.

The service bus offers a messaging system between the application and the domain layer. It allows us to send, or dispatch, a message on this service bus, and then to have handlers on the other side of the service bus that we'll use to, well, handle these messages.

Prooph's service bus has three different kinds of buses:

 - the command bus &mdash; it dispatches one message, a command, to exactly one handler,
 - the event bus &mdash; it dispatches one message, an event, to zero or more event handlers,
 - and, the query bus &mdash; I honestly haven't used it yet, so I'm not sure exactly what it does.

Today we're going to look at &mdash; you've guessed it! &mdash; the command bus.

The command bus can dispatch anything as a command: a primitive like a string or an integer, a DTO that represents our command, or a Prooph Message (an interface found in the `prooph-common` library).

To dispatch a command on the command bus, we do the following:

 - we create the command bus,
 - we create a command router that the command bus uses to route commands to command handlers,
 - we route a command to it's command handler,
 - we attach the router to the command bus,
 - and finally, we dispatch the command on the command bus.

A ~~picture~~ code example is worth a thousand words:

<div class='filename'>command-bus.php</div>
``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\CommandBus;
use Prooph\ServiceBus\Plugin\Router\CommandRouter;

$commandBus = new CommandBus();

$commandRouter = new CommandRouter();

$commandRouter->route('A simple string')
    ->to(new \ProophExample\CommandHandler\Primitives());

$commandRouter->attachToMessageBus($commandBus);

$commandBus->dispatch('A simple string');
```

The `Primitives` command handler is an invokable that, for this example, only prints out the "primitive" command we dispatched to it for handling:

<div class='filename'>src/ProophExample/CommandHandler/Primitives.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\CommandHandler;

class Primitives
{
    public function __invoke(string $primitiveCommand)
    {
        echo $primitiveCommand . PHP_EOL;
    }
}
```

In a real application it would do something a bit more meaningful.

If we run this `command-bus.php` example, we'd see this:

``` text
$ php command-bus.php
A simple string
```

If we'd tell the command bus to dispatch something else instead of `'A simple string'`:

``` php
<?php
$commandBus->dispatch('Some other string');
```

and we run the example script again, we'd get the following exception:

``` text
Prooph\ServiceBus\Exception\RuntimeException: CommandBus was not able to identify a CommandHandler for command Some other string
```

That's because we told the `$commandRouter` to route the command `'A simple string'`, yet we dispatched `'Some other string'`. Remember, every dispatched command must be handled by exactly one command handler, and in this case the command bus doesn't know how to handle our command.

## Going past primitives

Except for showing examples, I don't think primitives as commands are really useful.

How I personally use the command bus, is by creating classes of commands, which are nothing else but Data Transfer Objects, or DTOs:

<div class='filename'>src/ProophExample/Command/FetchUrl.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\Command;

class FetchUrl
{
    /**
    * @var string
    */
    protected $url;

    public function __construct(string $url)
    {
        $this->url = $url;
    }

    public function url(): string
    {
        return $this->url;
    }
}
```

with an accompanying command handler:

``` php
<?php declare(strict_types=1);

namespace ProophExample\CommandHandler;

use ProophExample\Command;

class FetchUrl
{
    public function __invoke(Command\FetchUrl $command)
    {
        echo sprintf("Fetching url: %s", $command->url()) . PHP_EOL;
    }
}
```

Again, it doesn't do much besides printing out the `url` that our command DTO transferred for us across the command bus.

The command bus follows the same principle: tell the command router what command to route to what command handler, create the command, and dispatch it on the command bus:

<div class='filename'>command-bus.php</div>
``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\CommandBus;
use Prooph\ServiceBus\Plugin\Router\CommandRouter;

$commandBus = new CommandBus();

$commandRouter = new CommandRouter();

$commandRouter->route(ProophExample\Command\FetchUrl::class)
    ->to(new ProophExample\CommandHandler\FetchUrl());

$commandRouter->attachToMessageBus($commandBus);

$url = 'https://robertbasic.com/index.xml';
$command = new ProophExample\Command\FetchUrl($url);

$commandBus->dispatch($command);
```
