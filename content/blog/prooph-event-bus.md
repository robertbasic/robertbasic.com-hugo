+++
draft = true
date = 2017-11-04T17:33:23+01:00
title = "Prooph event bus"
slug = "prooph-event-bus"
description = "How to use the Prooph service bus to dispatch and listen to events"
tags = ["prooph", "php", "cqrs", "event sourcing", "service bus", "event", "event bus", "event listeners"]
categories = ["Programming", "Software", "Development"]
2017 = ["11"]
+++

Let's continue with the [Prooph components](/tags/prooph), with another part of the Service Bus: the event bus.

As mentioned in the previous article on [the command bus](/blog/prooph-command-bus), the Prooph Service Bus has three kinds of buses:

 - the command bus,
 - the event bus,
 - and, the query bus.

The event bus takes one event, and that event is sent to all the event listeners that are listening for that event. If there are no listeners, the event bus will still dispatch the event, but it won't break the application. Any listeners listening to that event, will receive the event, and then we can do something based on that event &mdash; update a database table, send an email, push a notification, etc.

Compare that to the command bus, where we send one command on the command bus, and that command *must* be handled by a registered handler, otherwise the command bus will throw an exception.

Events are messages of things that happened in our system, and we name them accordingly: `UserRegistered`, `CommentAdded`, `RssFeedUpdated`.

From the nature of the events, and from the naming convention, we can conclude that we can not prevent events, as they have already happened. When we create an account for a user, we send an event of that, but we can't do anything to the event to prevent the creation of the new user account. We can only react to that event.

When working in a DDD fashion, sending events is a great way to notify other [bounded contexts](https://robertbasic.com/blog/i-think-i-understand-bounded-contexts/) of events that happened in our models.

You're not required to do CQRS, Event Sourcing, and DDD, to be able to use eventing in your applications. It is possible to use the event bus as a standalone component, and if all what you need is to send an event, and then react to that event, do just that. At the very least, you get to decouple the sending of welcome emails, from the actual user registration.

## A quick example

The message that represents our event can be anything &mdash; a primitive, a custom DTO class, or a class implementing the `Message` interface from the `prooph-common` library.

Setting up and using the event bus is similar to setting up and using the command bus:

 - we create the event bus,
 - we create an event router that the event bus uses to route events to event listeners,
 - we route a event to it's event listeners,
 - we attach the router to the event bus,
 - and finally, we dispatch the event on the event bus.

Or in code:

<div class='filename'>event-bus.php</div>
``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\EventBus;
use Prooph\ServiceBus\Plugin\Router\EventRouter;

$eventBus = new EventBus();

$eventRouter = new EventRouter();

$eventRouter->route('A simple string')
            ->to(new ProophExample\EventListener\Primitives());

$eventRouter->attachToMessageBus($eventBus);

$event = 'A simple string';
$eventBus->dispatch($event);
```

The `Primitives` event listener in this case doesn't do much, and isn't even named as we would name a real event listener, but it shows how would we create an event listener:

<div class='filename'>src/ProophExample/EventListener/Primitives.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\EventListener;

class Primitives
{
    public function __invoke(string $event)
    {
        echo $event . PHP_EOL;
    }
}
```

It just outputs the event that it got from the event bus.

## Sending a welcome email

A bit more realistic example would be to send a welcome email to a user when they register with us, and to increase the total number of user accounts. Remember, we can have multiple event listeners react to the same event!

We have the `UserRegistered` event, that will hold the `User` model that was created during the registration process:

<div class='filename'>src/ProophExample/Event/UserRegistered.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\Event;

use ProophExample\User;

class UserRegistered
{
    /**
    * @var User
    */
    protected $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function user(): User
    {
        return $this->user;
    }
}
```

We also have the event listener responsible for sending out welcome emails:

<div class='filename'>src/ProophExample/EventListener/SendWelcomeEmail.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\EventListener;

use ProophExample\Event\UserRegistered;

class SendWelcomeEmail
{
    public function __invoke(UserRegistered $event)
    {
        echo sprintf("Hello %s", $event->user()->name()) . PHP_EOL;
    }
}
```

And we have the event listener responsible for increasing the number of user accounts:

<div class='filename'>src/ProophExample/EventListener/IncreaseNumberOfAccounts.php</div>
``` php
<?php declare(strict_types=1);

namespace ProophExample\EventListener;

use ProophExample\Event\UserRegistered;

class IncreaseNumberOfAccounts
{
    public function __invoke(UserRegistered $event)
    {
        echo "Increasing the number of user accounts" . PHP_EOL;
    }
}
```

When tying all this together, we'd have something like the following example:

``` php
<?php declare(strict_types=1);

require_once 'vendor/autoload.php';

use Prooph\ServiceBus\EventBus;
use Prooph\ServiceBus\Plugin\Router\EventRouter;

$eventBus = new EventBus();

$eventRouter = new EventRouter();

$eventRouter->route(ProophExample\Event\UserRegistered::class)
            ->to(new ProophExample\EventListener\SendWelcomeEmail())
            ->andTo(new ProophExample\EventListener\IncreaseNumberOfAccounts());

$eventRouter->attachToMessageBus($eventBus);

$user = ProophExample\User::register('john.doe@example.com', 'John Doe');

$event = new ProophExample\Event\UserRegistered($user);

$eventBus->dispatch($event);
```

We create the event bus, the event router, we route the `UserRegistered` event to the `SendWelcomeEmail` event listener, **and to** the `IncreaseNumberOfAccounts` event listener, attaching the router to the event bus. Next we register our new user, and we create and dispatch our `UserRegistered` event.

Running this example gives us:

``` text
$ php event-bus.php
Hello John Doe
Increasing the number of user accounts
```

As we can see, first the event listener responsible for sending the welcome email gets invoked, and then the event listener for increasing the number of user accounts. They were invoked in the order we attached them to the router.

## Prooph Messages

In the previous article about the command bus, we saw that the messages, that is the commands, can implement the `Prooph\Common\Messaging\Message` interface. In that section I said that I don't really see the benefit of having commands implement that interface, but I do think that the events benefit a great deal from that interface.

Why?

By implementing that interface, we get a UUID for that event, a date and a time when it happened, and other information. All of this is of great value because an event listener might handle an event sometimes in the future, whereas we expect a command to be handled immediately. This extra information about events can be especially useful if/when we want to have Event Sourcing in our application.

An example event that signals that a RSS feed has been updated would look something like this implementing the `Message` interface:

``` php
<?php declare(strict_types=1);

namespace ProophExample\Event;

use Prooph\Common\Messaging\DomainEvent;
use Prooph\Common\Messaging\PayloadConstructable;
use Prooph\Common\Messaging\PayloadTrait;
use ProophExample\Url;

class FeedUpdated extends DomainEvent implements PayloadConstructable
{
    use PayloadTrait;

    public function url(): Url
    {
        return $this->payload['url'];
    }
}
```

The `prooph-common` library not only provides the interface, but also abstract classes that help us with implementing the methods defined in the interfaces.

Creating and dispatching this event will then be:

``` php
<?php

$url = ProophExample\Url::fromString('https://robertbasic.com/index.xml');
$event = new ProophExample\Event\FeedUpdated(['url' => $url]);

$eventBus->dispatch($event);
```

And the listener then can access the `Url`, as well as the extra event information, like the date and time when the event was created:

``` php
<?php declare(strict_types=1);

namespace ProophExample\EventListener;

use ProophExample\Event\FeedUpdated;

class NotifyAboutNewArticles
{
    public function __invoke(FeedUpdated $event)
    {
        echo sprintf("There are new articles to read from %s since %s",
            $event->url(),
            $event->createdAt()->format('Y-m-d H:i:s')
        ) . PHP_EOL;
    }
}
```

## A more real-world like example

Same as with the command bus, we wouldn't really use the event bus as we see it in this `event-bus.php` example file.

We would maybe have a factory of some kind that would create the event bus, configure the event router, and attach it to the event bus. Then we would get the event bus from a `psr/container` compatible container, create the event, and then dispatch it on the event bus. I've already [given an example of this](/blog/prooph-command-bus#a-more-real-world-like-example) in the previous article, so I don't want to repeat myself here.

The examples shown and discussed here are available in my [prooph-examples](https://github.com/robertbasic/prooph-examples) repository.

Happy hackin'!
