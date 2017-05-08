+++
draft = false
date = "2017-05-08T08:54:26+02:00"
title = "Complex argument matching in Mockery"
slug = "complex-argument-matching-in-mockery"
description = "An example to show how to use Mockery's on matcher for complex argument matching"
tags = ["php", "mockery", "testing", "arguments", "matching", "mocking"]
categories = ["Programming", "Software", "Development"]
2017 = ["05"]

+++

This past weekend I did some issue maintenance and bug triage on Mockery. One thing I noticed going through all these issues, is that people were surprised when learning about the `\Mockery::on()` argument matcher. I know Mockery's documentation isn't the best documentation out there, but this still is a documented feature.

First of all, Mockery supports validating arguments we pass when calling methods on a mock object. This helps us expect a method call with one (set of) argument, but not with an other. For example:

``` php
<?php
$mock = \Mockery::mock('AClass');

$mock->shouldReceive('doSomething')
    ->with('A string')
    ->once();

$mock->shouldReceive('doSomething')
    ->with(42)
    ->never();
```

This will tell Mockery that the `doSomething` method should receive a call with `A string` as an argument, once, but never with the number `42` as an argument.

Nice and simple.

But things are not always so simple. Sometimes they are more complicated and complex.

When we need to do a more complex argument matching for an expected method call, the `\Mockery::on()` matcher comes in really handy. It accepts a closure as an argument and that closure in turn receives the argument passed in to the method, when called. If the closure returns `true`, Mockery will consider that the argument has passed the expectation. If the closure returns `false`, or a "falsey" value, the expectation will not pass.

I have used the `\Mockery::on()` matcher in various scenarios &mdash; validating an array argument based on multiple keys and values, complex string matching... and every time it was invaluable. Though, now that I think back, the older the codebase, the higher the usage frequency was. Oh, well.

Say, for example, we have the following code. It doesn't do much; publishes a post by setting the `published` flag in the database to `1` and sets the `published_at` to the current date and time:

``` php
<?php
namespace Service;
class Post
{
    public function __construct($model)
    {
        $this->model = $model;
    }

    public function publishPost($id)
    {
        $saveData = [
            'post_id' => $id,
            'published' => 1,
            'published_at' => gmdate('Y-m-d H:i:s'),
        ];
        $this->model->save($saveData);
    }
}
```

In a test we would mock the model and set some expectations on the call of the `save()` method:

``` php
<?php
$postId = 42;

$modelMock = \Mockery::mock('Model');
$modelMock->shouldReceive('save')
    ->once()
    ->with(\Mockery::on(function ($argument) use ($postId) {
        $postIdIsSet = isset($argument['post_id']) && $argument['post_id'] === $postId;
        $publishedFlagIsSet = isset($argument['published']) && $argument['published'] === 1;
        $publishedAtIsSet = isset($argument['published_at']);

        return $postIdIsSet && $publishedFlagIsSet && $publishedAtIsSet;
    }));

$service = new \Service\Post($modelMock);
$service->publishPost($postId);

\Mockery::close();
```

The important part of the example is inside the closure we pass to the `\Mockery::on()` matcher. The `$argument` is actually the `$saveData` argument the `save()` method gets when it is called. We check for a couple of things in this argument:

* the post ID is set, and is same as the post ID we passed in to the `publishPost()` method,
* the `published` flag is set, and is `1`, and
* the `published_at` key is present.

If any of these requirements is not satisfied, the closure will return `false`, the method call expectation will not be met, and Mockery will throw a `NoMatchingExpectationException`.

Happy hackin'!
