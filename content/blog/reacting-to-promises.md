+++
draft = false
date = 2017-11-29T09:51:49+01:00
title = "Reacting to promises"
slug = "reacting-to-promises"
description = "ReactPHP Promises allow us to work with asynchronous code in a nicer way."
tags = ["react", "react php", "php", "promises"]
categories = ["Programming", "Development", "Software"]
2017 = ["11"]
+++

I was working on the next post of my [Prooph service bus](/tags/prooph) series, which includes the usage of [ReactPHP](https://reactphp.org/) promises. Given that I haven't had the chance to take a closer look at it yet, I decided that this is the right time for it.

ReactPHP has several different components, with the end goal of providing a low-level library for event-driven programming in PHP. The one component I want to talk about today is the [promise component](https://reactphp.org/promise/), which is a [Promises/A](https://promisesaplus.com/) implementation for PHP.

What this promise library allows us is a nicer workflow with asynchronous code.

With promises, when we want to execute something asynchronously we **defer** the work that will be executed asynchronously. The `Deferred` unit of work will complete sometimes in the future, but we don't know when. But it does **promise** that the work will be done, one way or the other.

The `Promise` is a sort of a placeholder for the result that will eventually be returned from our deferred work. This promise can **then** either be resolved or rejected by our deferred. When a promise is resolved successfully it has an associated value, and when it is rejected it has an associated reason for the rejection. The deferred can also notify the promise about the progress of the work.

We use the `then` method on the promise to register handlers that will be called when the deferred is resolved or rejected, or when it notifies our promise about progress.

To install the `React/Promise` component, run:

``` text
$ composer require react/promise
```

## An example

Let's say we have some code that does some asynchronous work. Checking the HTTP status code of a bunch of URLs, for example. We could create an invokable class that extends the `Deferred`:

<div class='filename'>FetchStatusCodes.php</div>
``` php
<?php declare(strict_types=1);

use React\Promise\Deferred;

class FetchStatusCodes extends Deferred
{
    public function __invoke(array $urls)
    {
        $this->notify('Initializing');
        $multiHandle = curl_multi_init();

        $handles = $this->getHandlesForUrls($urls, $multiHandle);

        $this->notify('Executing multi handles');
        $this->executeMultiHandle($multiHandle);

        $this->notify('Getting status codes');
        $statusCodes = $this->getStatusCodes($handles);

        curl_multi_close($multiHandle);

        $this->notify('Calculating success rate');
        $successRate = $this->calculateSuccessRate($statusCodes);

        if ($successRate > 50) {
            $this->resolve($statusCodes);
        } else {
            $this->reject('Success rate too low: ' . $successRate);
        }
    }
}
```

I've left out here a bunch of code that deals with the actual fetching of the status codes, just to keep the "noise" down. The full example is available in [this repository](https://github.com/robertbasic/react-promise-example).

The important thing here is that we extend `React\Promise\Deferred` and that at the end we call the `resolve()` method to resolve this deferred if the success rate is over 50%, or that we call the `reject()` method if the success rate is below 50%. We also added a couple of `notify()` calls to show how we can notify the promise of the deferreds progress.

The set up of the actual promise and its handlers would look something like this:

<div class='filename'>promise.php</div>
``` php
<?php

$statusCodes = new FetchStatusCodes();
$promise = $statusCodes->promise();

$promise
    ->then(
        function($value) {
            var_dump($value);
        },
        function($reason) {
            echo $reason . PHP_EOL;
        },
        function($progress) {
            echo "Progress: " . $progress . PHP_EOL;
        }
    );

$urls = [
    'https://example.com/',
    'https://stackoverflow.com/',
    'https://www.google.com/',
    'https://www.google.com/no-such-url',
    'https://www.google.com:81'
];
$statusCodes($urls);
```

We create the `FetchStatusCodes` deferred object and get the `promise`. We setup the resolve/reject/notify handler callbacks in the `then` method. They don't do much for now:

 - the resolve handler dumps the value it got,
 - the reject handler prints out the reason of the rejection,
 - and the notify handler prints out the progress.

The output for a resolved promise would be something like this:

``` text
$ php promise.php
Progress: Initializing
Progress: Executing multi handles
Progress: Getting status codes
Progress: Calculating success rate
/home/robert/projects/react-promise-example/promise.php:32:
array(5) {
  'https://example.com/' => int(200)
  'https://stackoverflow.com/' => int(200)
  'https://www.google.rs/' => int(200)
  'https://www.google.com/no-such-url' => int(404)
  'https://www.google.com:81/' => int(0)
}
```

## We're not done yet!

The example above where we call the `then` method to set up our resolve/reject handlers, isn't quite correct. Why?

When we call the `then` method it actually returns a new `Promise`. This feature of the *Promises/A* specification allows us to chain promises together.

On this second promise we can again set up our resolve/reject handlers calling the `then` method on it, same as we do for our first promise. The resolve handler of the second promise will be called with the return value of either the resolve or the reject handler of the first promise. The reject handler of the second promise will be called when either the resolve or the reject handler of the first promise throws an exception. And the `then` method of our second promise again returns a new, third promise.

Let's see if an example makes it a bit more clearer:

<div class='filename'>promise.php</div>
``` php
<?php

$statusCodes = new FetchStatusCodes();
$firstPromise = $statusCodes->promise();

$secondPromise = $firstPromise->then(
    function($statusCodes) {
        $successCodes = array_filter($statusCodes, function ($code) {
            if ($code >= 200 && $code < 300) {
                return true;
            }
            return false;
        });
        return $successCodes;
    },
    function($reason) {
        // handle rejected promise
        // gets called when Deferred gets reject-ed
    }
);

$thirdPromise = $secondPromise->then(
    function ($successCodes) {
        return json_encode($successCodes);
    },
    function ($reason) {
        // handle rejected promise
        // gets called when $firstPromise handlers throw an exception
    }
);

$urls = [
    'https://example.com/',
    'https://stackoverflow.com/',
    'https://www.google.com/',
    'https://www.google.com/no-such-url',
    'https://www.google.com:81'
];
$statusCodes($urls);
```

When our `FetchStatusCodes` deferred resolves, it will call the resolve handler of the `$firstPromise`. In that first resolve handler we get only the successful status codes and return them.

With this return from the resolve handler of the first promise, we "trigger" the resolve handler of the `$secondPromise` where we can, for example, `json_encode` our success codes. By returning this JSON string from the resolve handler of the second promise, we again "trigger" the resolve handler of the `$thirdPromise`, and so on.

## Almost done!

When we call `then`, we make a new promise.

To actually be **done** with all the promises, we need to call the `done` method on the last promise in our chain. With `done` we stop making promises and use the result of our last promise:

<div class='filename'>promise.php</div>
``` php
<?php
$thirdPromise->done(
    function ($jsonString) {
        echo $jsonString . PHP_EOL;
    },
    function ($reason) {
        // handle rejected promise
        // gets called when $secondPromise handlers throw an exception
    }
);
```

If we'd run the example now, we'd get something like this:

``` text
$ php promise.php | json_pp
{
   "https://example.com/" : 200,
   "https://www.google.rs/" : 200,
   "https://stackoverflow.com/" : 200
}
```

We additionally pipe the output of our example script to `json_pp` to pretty print the JSON string.

## Now we're done

ReactPHP promises have an [ExtendedPromisesInterface](https://reactphp.org/promise/#extendedpromiseinterface) that include additional shortcut and utility methods that are not part of the `Promise/A` specification. Their docs include some more [examples](https://reactphp.org/promise/#examples), and Cees-Jan Kiewiet looks at [examples using the `react/dns` component](https://blog.wyrihaximus.net/2015/02/reactphp-promises/), among other things.

When we deal with asynchronous code in PHP, using ReactPHP promises gives us a way to deal with it in a much nicer, saner way.

Happy hackin'!
