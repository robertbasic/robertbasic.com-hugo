+++
draft = false
date = 2017-11-07T11:30:52+01:00
title = "Prooph command bus"
slug = "prooph-command-bus"
description = "How to use the Prooph service bus to dispatch and handle commands"
tags = ["prooph", "php", "cqrs", "service bus", "command", "command bus", "command handlers"]
categories = ["Programming", "Software", "Development"]
2017 = ["11"]
+++

[Prooph](http://getprooph.org/) is a CQRS and Event Sourcing component for PHP, and as they state on their website:

<blockquote>
Prooph components include everything to get you started with CQRS and Event Sourcing.
</blockquote>

CQRS and Event Sourcing go hand in hand with Domain Driven Design, but can be used outside of DDD too. They are patterns and methodologies that are here to help us make complicated and complex software designs more manageable, and all around better. Or make them even more complicated and complex.

In any case, I believe DDD is the way to go forward, as it puts communication with business stakeholders front and center, and at the end of the day, communication is the key to the success of any software project.

## A tiny drop of theory

CQRS stands for Command Query Responsibility Segregation.

It boils down to the idea that instead of having one model that does both writing to and reading from the storage layer, you instead split them in two separate models. Then one of those models is responsible only for writing, and the other model is responsible for reading. The write "side" handles the command part, and the read "side" handles the query part of these responsibilities.

If you're interested in more theory around this, and you should be, read this article on [CQRS by Martin Fowler](https://martinfowler.com/bliki/CQRS.html) and this [Clarified CQRS article by Udi Dahan](http://udidahan.com/2009/12/09/clarified-cqrs/). The [CQRS journey on MSDN](https://msdn.microsoft.com/en-us/library/jj554200.aspx) and the [CQRS pattern documentation](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs) helped me a great deal to get a better understanding of this topic.

As for Event Sourcing... We'll get to that in another blog post, when we'll talk about the Event Sourcing part of Prooph.

## The command bus

Now, let's get started with Prooph. The first component we're going to look at is the [Service Bus](https://github.com/prooph/service-bus).

The service bus offers a messaging system between the application and the domain layer. It allows us to send, or dispatch, a message on this service bus, and then to have handlers on the other side of the service bus that we'll use to, well, handle these messages.

Prooph's service bus has three different kinds of buses:

 - **the command bus** &mdash; it dispatches one message, a command, to exactly one handler,
 - **the event bus** &mdash; it dispatches one message, an event, to zero or more event handlers,
 - and, **the query bus** &mdash; it dispatches one message, a query, to exactly one handler, but returns a `React\Promise\Promise`.

Today we're going to look at &mdash; you've guessed it! &mdash; the command bus.

The command bus gives us the ability to send a command through the command bus itself, and dispatches that command to a command handler we specified. We send in a message, and on the otherside that same message comes out to the command handler.

It is worth mentioning that the command bus can be used as a standalone component, if you're interested only in that part. You're not required to do CQRS, Event Sourcing, and/or DDD, to be able to use the command bus. If all you want, or all you need, to do is send a command, and have that command handled on the other side, by all means, do just that.

The command bus can dispatch anything as a command: a primitive like a string or an integer, a Data Transfer Object (DTO) that represents our command, or a Prooph Message (an interface found in the `prooph-common` library).

We name these commands based on the action that we want to do: `RegisterUser`, `FetchUrl`, `SendEmail`.

To dispatch a command on the command bus, we do the following:

 - we create the command bus,
 - we create a command router that the command bus uses to route commands to command handlers,
 - we route a command to it's command handler,
 - we attach the router to the command bus,
 - and finally, we dispatch the command on the command bus.

This sounds like an awful lot; a ~~picture~~ code example is worth a thousand words:

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

How I personally use the command bus, is by creating classes of commands, which are nothing else but DTOs:

<div class='filename'>src/ProophExample/Command/FetchUrl.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\Command;

use ProophExample\Url;

class FetchUrl
{
    /**
    * @var Url
    */
    protected $url;

    public function __construct(string $url)
    {
        $this->url = Url::fromString($url);
    }

    public function url(): Url
    {
        return $this->url;
    }
}
```

A command is a good place to convert our primitives to value objects!

The accompanying command handler is:

<div class='filename'>src/ProophExample/CommandHandler/FetchUrl.php</div>
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

## Prooph Messages

As mentioned earlier, the commands can also be Prooph Messages. These are commands that implement the `Prooph\Common\Messaging\Message` interface.

Note that the [prooph-common](https://github.com/prooph/common/) library not only provides us the interface(s) we should implement, but also some abstract classes and traits to do the "plumbing" for us.

Let's see how what would this be like:

<div class='filename'>src/ProophExample/Command/RegisterUser.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\Command;

use Prooph\Common\Messaging\Command;
use Prooph\Common\Messaging\PayloadConstructable;
use Prooph\Common\Messaging\PayloadTrait;
use ProophExample\Email;

class RegisterUser extends Command implements PayloadConstructable
{
    use PayloadTrait;

    public function email(): Email
    {
        return Email::fromString($this->payload['email']);
    }
}
```

The two interfaces, `Message` and `HasMessageName`, together with the `Command` abstract class, and the `DomainMessage` abstract class it extends, provide a type for our message (command in this case), a UUID, a date and time when the command was created, the payload of the command, and some meta data.

The `PayloadConstructable` interface and the `PayloadTrait` trait give us an implementation of a constructor that expects exactly one argument, an array, that holds the payload for our command.

To create this command, we do the following:

``` php
<?php
$payload = ['email' => 'john.doe@example.com'];
$command = new ProophExample\Command\RegisterUser($payload);
```

In the case of commands, I personally prefer a custom DTO, over a `Message` type.

## A more real-world like example

The `command-bus.php` example from before doesn't really show how would we use the command bus in a more real-life setting. When we want to dispatch a command somewhere in our application, we don't want to deal with all the routing and stuff, we just want to send a command to the command bus to be handled by a command handler.

If we're using Symfony, one option would be to create a custom factory for the command bus, where we create the command bus, the router for it, and route the commands to command handlers:

<div class='filename'>src/ProophExample/CommandBusFactory.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample;

use Prooph\ServiceBus\CommandBus;
use Prooph\ServiceBus\Plugin\Router\CommandRouter;
use Symfony\Component\DependencyInjection\ContainerInterface;

class CommandBusFactory
{
    public static function createCommandBus(ContainerInterface $container): CommandBus
    {
        $commandBus = new CommandBus();

        $router = new CommandRouter();

        $router->route(ProophExample\Command\FetchUrl::class)
            ->to($container->get(ProophExample\CommandHandler\FetchUrl::class));

        $router->attachToMessageBus($commandBus);

        return $commandBus;
    }
}
```

The relevant part in the service definition file would be:

<div class='filename'>app/config/services.xml</div>
``` xml
<service id="Prooph\ServiceBus\CommandBus" class="Prooph\ServiceBus\CommandBus">
    <factory service="ProophExample\CommandBusFactory" method="createCommandBus" />
    <argument type="service" id="service_container" />
</service>
```

Then somewhere in our application, for example in a controller, we can get the `CommandBus` from the container, and dispatch the command:

<div class='filename'>src/AppBundle/Controller/ExampleController.php</div>
``` php
<?php
// namespace imports left out intentionally
class ExampleController extends Controller
{
    public function indexAction(Request $request)
    {
        $url = 'https://robertbasic.com/index.xml';
        $command = new ProophExample\Command\FetchUrl($url);

        $this->get(Prooph\ServiceBus\CommandBus::class)->dispatch($command);
    }
}
```

The Prooph ServiceBus also comes equipped with a `psr/container` compatible `Prooph\ServiceBus\Container\CommandBusFactory` factory. The [proophesor-do](https://github.com/prooph/proophessor-do) application has an example how to configure and use it.

There's also a [Symfony bundle](https://github.com/prooph/service-bus-symfony-bundle) that provides integration of the ServiceBus with Symfony.

Some of the examples shown and discussed here are available in my [prooph-examples](https://github.com/robertbasic/prooph-examples) repository.

Happy hackin'!
