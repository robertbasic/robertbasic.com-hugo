+++
draft = true
date = 2017-12-12T10:10:21+01:00
title = "Mockery return values based on arguments"
slug = "mockery-return-values-based-on-arguments"
description = "Quick example how to have Mockery return different values based on the method arguments"
tags = ["php", "mockery", "mocks", "testing"]
categories = ["Programming", "Software", "Development"]
2017 = ["12"]
+++

Sometimes when working with Mockery mock objects, we want to tell a mocked method to return different values for different arguments. It is a rare occasion when I need this feature, but every time I need it, I'm happy it's there.

The feature that allows us to return different values based on arguments is the `andReturnUsing` Mockery method, which takes a closure as an argument:

<div class="filename">example.php</div>
``` php
$dependencyMock = \Mockery::mock('SomeDependency');
$dependencyMock->shouldReceive('callDependency')
    ->andReturnUsing(function ($argument) {
        if ($argument <= 10) {
            return 'low';
        }

        return 'high';
    });

$dependencyMock->callDependency(10); // 'low'
$dependencyMock->callDependency(11); // 'high'
```

Any number of times we call our `callDependency` method on our mock object with a number 10 or less, it will return `'low'`, otherwise it will return `'high'`.

Not much of an example, so let's take a look at one a bit closer to a real world scenario.

Say we're using Doctrine's entity manager to get repositories for our entities in a service class:

<div class="filename">src/ArticleService.php</div>
``` php
<?php

class ArticleService
{
    public function __construct(EntityManager $em)
    {
        $this->articleRepo = $em->getRepository(Entity\Article::class);
        $this->authorRepo = $em->getRepository(Entity\Author::class);
    }
}
```

Not the best of the codes, but we'll manage. The entity manager receives two calls to the `getRepository` method, once for the Article entity, once for the Author entity.

In a test case we could then set up the mocks like so:

<div class="filename">tests/ArticleServiceTest.php</div>
``` php
<?php

class ArticleServiceTest extends MockeryTestCase
{
    public function setup()
    {
        $this->authorRepositoryMock = \Mockery::mock(AuthorRepository::class);
        $this->articleRepositoryMock = \Mockery::mock(ArticleRepository::class);
        $this->entityManagerMock = \Mockery::mock(EntityManager::class);
    }

    public function testArticleService()
    {
        $repositoryMap = [
            'Entity\Author' => $this->authorRepositoryMock,
            'Entity\Article' => $this->articleRepositoryMock,
        ];
        $this->entityManagerMock->shouldReceive('getRepository')
            ->andReturnUsing(function($argument) use ($repositoryMap) {
                return $repositoryMap[$argument];
            });

        $articleService = new ArticleService($this->entityManagerMock);
    }
}
```

In the `setup` method we create the three mock objects that we need and then in the test method we create a `$repositoryMap` to help us map entities to repositories. The repository map could have been created in the `andReturnUsing` closure as well.

Now when we instantiate the `ArticleService` with the mocked entity manager, that mocked entity manager will receive two calls to the `getRepository` method in the `ArticleService`s constructor, and it will use the closure defined in `andReturnUsing` to return the correct repository mock objects.

## More than one way to do it

Of course there is another way to achieve the same thing and that's by using `andReturn` for the return value expectations, but it's a bit more to write:

<div class="filename">tests/ArticleServiceTest.php</div>
``` php
<?php
    public function testArticleService()
    {
        $this->entityManagerMock->shouldReceive('getRepository')
            ->with('Entity\Author')
            ->andReturn($this->authorRepositoryMock);
        $this->entityManagerMock->shouldReceive('getRepository')
            ->with('Entity\Article')
            ->andReturn($this->articleRepositoryMock);

        $articleService = new ArticleService($this->entityManagerMock);
    }
```

It does the same thing as the previous thing. We might even argue that this second example is even clearer than the first example, sure, for a relatively small argument "map". But if we need to handle a case with more than just two possible arguments, `andReturnUsing` can help us in those cases.

Happy hackin'!

P.S.: The proper way to do this actually would be to refactor that `ArticleService` to not get the two repositories from the entity manager, but to inject them directly instead.
