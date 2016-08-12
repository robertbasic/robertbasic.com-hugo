+++
draft = false
date = "2016-08-04T16:50:48+02:00"
title = "Events in a Zend Expressive application"
slug = "events-in-a-zend-expressive-application"
description = "An example on how to use the Zend EventManager in a Zend Expressive application"
tags = ["container", "php", "zend expressive", "events", "event manager", "event listener"]
categories = ["Programming", "Development"]
2016 = ["08"]

+++
Three weeks ago I wrote a post on [how to utilize Tactician in a Zend Expressive application](/blog/using-tactician-in-a-zend-expressive-application/). Today I want to expand on that post a little by adding the possibility to trigger and listen to events using the [Zend EventManager](https://github.com/zendframework/zend-eventmanager) component.

Using events allows our application to respond to different events that occur during a request. For example, when a user registers a new account, our application can trigger an event, `UserRegistered`, that can let the rest of our application know when a new registration happens. With the help of the `EventManager` we attach listeners to that event. When the `UserRegistered` event is triggered, the event manager will invoke all the listeners that are listening to that particular event.

This allows for a better separation of concerns in some cases, because if we take this approach, our code that deals with registering new users doesn't care any more what happens after that &mdash; do we send out a welcoming email to the user, a notification to the site admins, create a log entry somewhere... It just registers a new account, triggers the event and that's it.

## Let's see some code

As I mentioned earlier, this post expands on [my previous post](/blog/using-tactician-in-a-zend-expressive-application/), so all we are going to add is an event that gets triggered when the `Ping` command is handled, an event listener that listens to that event and wire it all together with the event manager.

Let's include the Zend EventManager in our project with composer:

``` bash
$ composer require zendframework/zend-eventmanager
```

Next we expand the factory for the Ping command handler. We create an `EventManager` object that we will pass to the Ping command handler, so that we can trigger events:

<div class='filename'>src/App/CommandHandler/PingFactory.php</div>
``` diff
diff --git a/src/App/CommandHandler/PingFactory.php b/src/App/CommandHandler/PingFactory.php
index e995d1a..0737631 100644
--- a/src/App/CommandHandler/PingFactory.php
+++ b/src/App/CommandHandler/PingFactory.php
@@ -3,6 +3,7 @@
 namespace App\CommandHandler;
 
 use Interop\Container\ContainerInterface;
+use Zend\EventManager\EventManager;
 
 class PingFactory
 {
@@ -10,6 +11,11 @@ class PingFactory
     {
         $logPath = '/tmp/ping-command.log';
 
-        return new Ping($logPath);
+        $events = new EventManager();
+        $events->setIdentifiers([
+            Ping::class
+        ]);
+
+        return new Ping($logPath, $events);
     }
}
```

Later on we will use the same event manager to attach event listeners to our events.

In the Ping command handler we use the event manager, that we pass in as a constructor argument from the ping command handler factory, to trigger events:

<div class='filename'>src/App/CommandHandler/Ping.php</div>
``` diff
diff --git a/src/App/CommandHandler/Ping.php b/src/App/CommandHandler/Ping.php
index 538e3af..9768738 100644
--- a/src/App/CommandHandler/Ping.php
+++ b/src/App/CommandHandler/Ping.php
@@ -2,15 +2,19 @@
 
 namespace App\CommandHandler;
 
+use Zend\EventManager\EventManagerInterface;
 use App\Command\Ping as PingCommand;
 
 class Ping
 {
     private $logPath;
 
-    public function __construct($logPath)
+    private $events;
+
+    public function __construct($logPath, EventManagerInterface $events)
     {
         $this->logPath = $logPath;
+        $this->events = $events;
     }
 
     public function __invoke(PingCommand $pingCommand)
@@ -18,5 +22,12 @@ class Ping
         $commandTime = $pingCommand->getCommandTime();
 
         file_put_contents($this->logPath, $commandTime . PHP_EOL, FILE_APPEND);
+
+        $params = [
+            'command_time' => $commandTime,
+            'event_time' => time(),
+        ];
+
+        $this->events->trigger('ping_command_handled', $this, $params);
     }
}
```

The main part is the call to the `trigger` method on the event manager. The first argument, `ping_command_handled`, is the event's name. We will use that event name to attach to it later. The second argument is the target of the event and usually it's the object instance that triggers the event. Finally with the third argument we can send out optional parameters with the event which we can access in our event listeners.

Even though we have no listeners attached to the event, our application will continue to work perfectly fine, because an event is not required to have any listeners. It doesn't make much sense to have events without listeners, but it wouldn't break our application.

## Shhh... Listen!

The simplest way to attach a listener to the event would be to tell the event manager to call a callable every time the event is triggered. This would also mean we need to set up any and all dependencies our event listeners have, at the moment of attaching the listener to the event, even though the event can end up not being triggered at all. All that dependency set up can be costly and wasteful.

Zend EventManager comes with lazy listeners that allows to fetch event listeners from a `container-interop` compatible container. This lets us to set up the dependency graph for an event listener in a factory, which will be invoked by the lazy listener only when the event we are listening to is triggered. If the event is triggered, the lazy listener will fetch the event listener from the container along with it's dependencies, but if the event is not triggered, nothing will happen. Super useful!

Let's attach our event listener to the event using the lazy listener:

<div class='filename'>src/App/CommandHandler/PingFactory.php</div>
``` diff
diff --git a/src/App/CommandHandler/PingFactory.php b/src/App/CommandHandler/PingFactory.php
index 0737631..5ce9c7e 100644
--- a/src/App/CommandHandler/PingFactory.php
+++ b/src/App/CommandHandler/PingFactory.php
@@ -4,6 +4,7 @@ namespace App\CommandHandler;
 
 use Interop\Container\ContainerInterface;
 use Zend\EventManager\EventManager;
+use Zend\EventManager\LazyListener;
+use App\EventListener\Ping as PingEventListener;
 
 class PingFactory
 {
@@ -16,6 +17,13 @@ class PingFactory
             Ping::class
         ]);
 
+        $lazyListener = new LazyListener([
+            'listener' => PingEventListener::class,
+            'method' => 'onPingCommandHandled',
+        ], $container);
+
+        $events->attach('ping_command_handled', $lazyListener);
+
         return new Ping($logPath, $events);
     }
}
```

We create a new `LazyListener` object and as the first argument to it we pass an array with the actual event listener and method that will be called when the event is triggered. The second argument is the `container-interop` compatible container, which knows how to build our event listener.

After that we attach the lazy listener to the events we are interested in, in this case the event called `ping_command_handled`. Once that event gets triggered, the lazy listener will get our `PingEventListener` from the container and call the `onPingCommandHandled` method on it.

Let's quickly tell the container how to create our event listener:

<div class='filename'>config/autoload/dependencies.global.php</div>
``` diff
diff --git a/config/autoload/dependencies.global.php b/config/autoload/dependencies.global.php
index 794304e..cf47c99 100644
--- a/config/autoload/dependencies.global.php
+++ b/config/autoload/dependencies.global.php
@@ -21,6 +21,7 @@ return [
             Helper\UrlHelper::class => Helper\UrlHelperFactory::class,
             'CommandBus' => App\CommandBusFactory::class,
             App\CommandHandler\Ping::class => App\CommandHandler\PingFactory::class,
+            App\EventListener\Ping::class => App\EventListener\Ping::class,
         ],
     ],
];
```

And finally our event listener looks something like this:

<div class='filename'>src/App/EventListener/Ping.php</div>
``` php
<?php
namespace App\EventListener;
use Interop\Container\ContainerInterface;
use Zend\EventManager\Event;
class Ping
{
    public function __invoke(ContainerInterface $container)
    {
        // Grab some dependencies from the $container
        // And return self
        return new self();
    }

    public function onPingCommandHandled(Event $event)
    {
        // Do something with the $event here
        $name = $event->getName();
        $target = $event->getTarget();
        $params = $event->getParams();
    }
}
```

When the container grabs our event listener the `__invoke` method will be invoked at which point we can grab the event listener's dependencies from the container. Once the event listener object is created, the `onPingCommandHandled` method will be called by the event manager when the event is triggered.

Happy hackin'!
