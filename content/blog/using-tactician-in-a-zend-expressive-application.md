+++
draft = false
date = "2016-07-13T21:59:21+02:00"
title = "Using Tactician in a Zend Expressive application"
slug = "using-tactician-in-a-zend-expressive-application"
description = "An example how to get started using Tactician in a Zend Expressive application"
tags = ["tactician", "command bus", "zend expressive", "php", "container", "zf"]
categories = ["Programming", "Development"]
2016 = ["07"]

+++
I spent some time connecting the dots last week, so I decided to put together an example on how to get started with using [Tactician](https://tactician.thephpleague.com/) in a [Zend Expressive](https://zendframework.github.io/zend-expressive/) application. The example itself is not really useful, but it does show how to setup the dependencies and get started with these two libraries.

Zend Expressive is a [PSR7](http://www.php-fig.org/psr/psr-7/) compatible microframework that provides interfaces for routing, DI containers, templating and error handling. It provides a couple out of the box, so you can either use those, or write your own implementations.

Tactician is a command bus library whose goal is to make using the [command pattern](https://en.wikipedia.org/wiki/Command_pattern) easy to use in your applications. It allows to have an object that represents a command, pass it on to the command bus which will figure out which command handler should take care of that command.

## Let's dive in

To get up and running quickly with Zend Expressive we can create a [skeleton application](https://github.com/zendframework/zend-expressive-skeleton). It does some basic wiring for us, like setting up the routing and the DI container.

It also comes with a dummy ping action, at `/api/ping`, which just gives us the current unix timestamp. This example is going to expand on that and create a Ping command that will be handled by a Ping command handler. The command handler will get some additional dependencies from the container, just to make the example a bit more interesting.

Creating the skeleton application is really easy with [Composer](https://getcomposer.org/):

``` bash
$ cd /var/www
$ composer create-project zendframework/zend-expressive-skeleton tactician-example
```

Bring in the Tactician and the [tactician-container](https://github.com/thephpleague/tactician-container) plugin as project dependencies. The `tactician-container` plugin allows us to lazy load command handlers from a [container-interop](https://github.com/container-interop/container-interop) compatible container:

``` bash
$ composer require league/tactician
$ composer require league/tactician-container
```

Now that we have all our libraries in, let's change how the container creates the Ping action. Before it was being just invoked by the container, but now we want to create it through a factory:

<div class='filename'>config/autoload/routes.global.php</div>
``` diff
diff --git a/config/autoload/routes.global.php b/config/autoload/routes.global.php
index 856f5ab..8335450 100644
--- a/config/autoload/routes.global.php
+++ b/config/autoload/routes.global.php
@@ -4,10 +4,10 @@ return [
     'dependencies' => [
         'invokables' => [
             Zend\Expressive\Router\RouterInterface::class => Zend\Expressive\Router\FastRouteRouter::class,
-            App\Action\PingAction::class => App\Action\PingAction::class,
         ],
         'factories' => [
             App\Action\HomePageAction::class => App\Action\HomePageFactory::class,
+            App\Action\PingAction::class => App\Action\PingFactory::class
         ],
     ],

```

This will allow us to pass in dependencies to the `PingAction` class.

The Ping action's factory is simple:

<div class='filename'>src/App/Action/PingFactory.php</div>
``` php
<?php

namespace App\Action;

use Interop\Container\ContainerInterface;

class PingFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $commandBus = $container->get('CommandBus');

        return new PingAction($commandBus);
    }
}
```

We are telling the container to get the service called `CommandBus` and pass it as an argument to the Ping action's constructor.

## Wiring in Tactician

We haven't yet defined the `CommandBus` service, so let's do that next by telling the service manager to create the `CommandBus` using the `App\CommandBusFactory` factory:

<div class='filename'>config/autoload/dependencies.global.php</div>
``` diff
diff --git a/config/autoload/dependencies.global.php b/config/autoload/dependencies.global.php
index b2b08f5..460c045 100644
--- a/config/autoload/dependencies.global.php
+++ b/config/autoload/dependencies.global.php
@@ -19,6 +19,7 @@ return [
         'factories' => [
             Application::class => ApplicationFactory::class,
             Helper\UrlHelper::class => Helper\UrlHelperFactory::class,
+            'CommandBus' => App\CommandBusFactory::class
         ],
     ],
 ];
```

This factory sets up the Tactician's command bus and is the main point of this example:

<div class='filename'>src/App/CommandBusFactory.php</div>
``` php
<?php

namespace App;

use League\Tactician\CommandBus;
use League\Tactician\Handler\CommandHandlerMiddleware;
use League\Tactician\Container\ContainerLocator;
use League\Tactician\Handler\CommandNameExtractor\ClassNameExtractor;
use League\Tactician\Handler\MethodNameInflector\InvokeInflector;
use Interop\Container\ContainerInterface;

class CommandBusFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $inflector = new InvokeInflector();

        $commandsMapping = [];
        $locator = new ContainerLocator($container, $commandsMapping);

        $nameExtractor = new ClassNameExtractor();

        $commandHandlerMiddleware = new CommandHandlerMiddleware(
            $nameExtractor,
            $locator,
            $inflector
        );

        $commandBus = new CommandBus([
            $commandHandlerMiddleware
        ]);

        return $commandBus;
    }
}
```

Tactician uses a command handler middleware to handle commands. That middleware in turn uses a name extractor to get the command name out of a command, a locator to find the actual command handler and an inflector to figure out the method to call on the command handler to handle the command. Tactician's middleware system is nicely described in [the documentation](https://tactician.thephpleague.com/middleware/).

The `ClassNameExtractor` will extract the command name from the class name.

The `ContainerLocator` will use our `container-interop` compatible container to find the command handler, which in this example is [Zend ServiceManager](https://github.com/zendframework/zend-servicemanager).

The `InvokeInflector` dictates that the command handler needs to have an `__invoke` method which will get our Ping command as an argument and then it's up to the Ping command handler to handle the command.

The `$commandsMapping` array that we are passing to the locator is going to be a map of commands and their handlers. We'll populate that later on.

In the next step, let's tell the `PingAction`'s constructor to accept the command bus:

<div class='filename'>src/App/Action/PingAction.php</div>
``` diff
diff --git a/src/App/Action/PingAction.php b/src/App/Action/PingAction.php
index ea2ae22..612fb32 100644
--- a/src/App/Action/PingAction.php
+++ b/src/App/Action/PingAction.php
@@ -5,9 +5,15 @@ namespace App\Action;
 use Zend\Diactoros\Response\JsonResponse;
 use Psr\Http\Message\ResponseInterface;
 use Psr\Http\Message\ServerRequestInterface;
+use League\Tactician\CommandBus;

 class PingAction
 {
+    public function __construct(CommandBus $commandBus)
+    {
+        $this->commandBus = $commandBus;
+    }
+
     public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next = null)
     {
         return new JsonResponse(['ack' => time()]);
```

Cool, at this point we have everything set up to start sending and handling commands.

## Commands and their handlers

The command we are going to create is a simple one:

<div class='filename'>src/App/Command/Ping.php</div>
``` php
<?php

namespace App\Command;

class Ping
{
    private $commandTime;

    public function __construct()
    {
        $this->commandTime = time();
    }

    public function getCommandTime()
    {
        return $this->commandTime;
    }
}
```

It just sets the command time to the current unix timestamp.

Updating the `PingAction` to include the creation of our `Ping` command and passing it on to the command bus to be handled:

<div class='filename'>src/App/Action/PingAction.php</div>
``` diff
diff --git a/src/App/Action/PingAction.php b/src/App/Action/PingAction.php
index 612fb32..6cb9334 100644
--- a/src/App/Action/PingAction.php
+++ b/src/App/Action/PingAction.php
@@ -6,6 +6,7 @@ use Zend\Diactoros\Response\JsonResponse;
 use Psr\Http\Message\ResponseInterface;
 use Psr\Http\Message\ServerRequestInterface;
 use League\Tactician\CommandBus;
+use App\Command\Ping as PingCommand;

 class PingAction
 {
@@ -16,6 +17,11 @@ class PingAction

     public function __invoke(ServerRequestInterface $request, ResponseInterface $response, callable $next = null)
     {
-        return new JsonResponse(['ack' => time()]);
+        $pingCommand = new PingCommand();
+        $time = $pingCommand->getCommandTime();
+
+        $this->commandBus->handle($pingCommand);
+
+        return new JsonResponse(['ack' => $time]);
     }
 }
```

Now is the time to let Tactician know about our command and command handler mapping, so it knows which handler handles which command:

<div class='filename'>src/App/CommandBusFactory.php</div>
``` diff
diff --git a/src/App/CommandBusFactory.php b/src/App/CommandBusFactory.php
index ba587f6..b79fbb1 100644
--- a/src/App/CommandBusFactory.php
+++ b/src/App/CommandBusFactory.php
@@ -9,13 +9,18 @@ use League\Tactician\Handler\CommandNameExtractor\ClassNameExtractor;
 use League\Tactician\Handler\MethodNameInflector\InvokeInflector;
 use Interop\Container\ContainerInterface;

+use App\Command\Ping as PingCommand;
+use App\CommandHandler\Ping as PingCommandHandler;
+
 class CommandBusFactory
 {
     public function __invoke(ContainerInterface $container)
     {
         $inflector = new InvokeInflector();

-        $commandsMapping = [];
+        $commandsMapping = [
+            PingCommand::class => PingCommandHandler::class
+        ];
         $locator = new ContainerLocator($container, $commandsMapping);

         $nameExtractor = new ClassNameExtractor();
```

We're almost there. I promise.

The command handler is going to be created through a factory, so we can inject dependencies into it:

<div class='filename'>src/App/CommandHandler/PingFactory.php</div>
``` php
<?php

namespace App\CommandHandler;

use Interop\Container\ContainerInterface;

class PingFactory
{
    public function __invoke(ContainerInterface $container)
    {
        $logPath = '/tmp/ping-command.log';

        return new Ping($logPath);
    }
}
```

It doesn't do much, it just passes a path to a log file. Of course, in real code, you'd probably pass in some dependency gotten from the container.

The command handler won't do much either, it's just going to log the the ping's command time in the log file we passed in from the command handler factory:

<div class='filename'>src/App/CommandHandler/Ping.php</div>
``` php
<?php

namespace App\CommandHandler;

use App\Command\Ping as PingCommand;

class Ping
{
    private $logPath;

    public function __construct($logPath)
    {
        $this->logPath = $logPath;
    }

    public function __invoke(PingCommand $pingCommand)
    {
        $commandTime = $pingCommand->getCommandTime();

        file_put_contents($this->logPath, $commandTime . PHP_EOL, FILE_APPEND);
    }
}
```

And finally let the service manager know how to create the `Ping` command handler:

<div class='filename'>config/autoload/dependencies.global.php</div>
``` diff
diff --git a/config/autoload/dependencies.global.php b/config/autoload/dependencies.global.php
index 460c045..2c8e3ee 100644
--- a/config/autoload/dependencies.global.php
+++ b/config/autoload/dependencies.global.php
@@ -19,7 +19,8 @@ return [
         'factories' => [
             Application::class => ApplicationFactory::class,
             Helper\UrlHelper::class => Helper\UrlHelperFactory::class,
-            'CommandBus' => App\CommandBusFactory::class
+            'CommandBus' => App\CommandBusFactory::class,
+            App\CommandHandler\Ping::class => App\CommandHandler\PingFactory::class
         ],
     ],
 ];
```

Navigating to `/api/ping` should display the <samp>{"ack":1468171544}</samp> response, and the log file at `/tmp/ping-command.log` should have the same timestamp logged.

## That was a lot of code

I know, looks like an awful lot of code just to log a timestamp in a file somewhere. But the point is that even for more complicated commands and handlers the basic wiring stays the same &mdash; create the `CommandBus` factory, set up mapping of commands and handlers and the rest is pretty much the business logic of the application.

Happy hackin'!

P.S.: I'm trying out this new way of providing code samples by using diffs, so it's easier to follow what changed where. Let me know how it looks, thanks!
