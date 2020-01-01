+++
draft = false
date = 2018-01-28T10:22:54+01:00
title = "Mockery partial mocks"
slug = "mockery-partial-mocks"
description = "Partial mocks can be of great help when dealing with legacy code."
tags = ["mockery", "php", "mocks", "partial mocks", "mocking"]
categories = ["Programming", "Development"]
2018 = ["01"]
+++

In dealing with legacy code I often come across some class that extends a big base abstract class, and the methods of that class call methods on that big base abstract class that do an awful lot of things. I myself have written such classes and methods in the past. Live and learn.

One of the biggest problems with this kind of code is that it is pretty hard to test. The methods from the base class can return other objects, have side effects, do HTTP calls...

A typical example of this would be a base model class that has a `getDb()` method:

<div class="filename">AbstractModel.php</div>

``` php
<?php

abstract class AbstractModel
{
    protected $db = null;

    protected function getDb()
    {
        if ($this->db == null) {
            $db = Config::get('dbname');
            $user = Config::get('dbuser');
            $pass = Config::get('dbpass');
            $this->db = new PDO('mysql:host=localhost;dbname='.$db, $user, $pass);
        }
        return $this->db;
    }
}
```

which can be called in child classes to get access to the database connection:

<div class="filename">ArticleModel.php</div>

``` php
<?php

class ArticleModel extends AbstractModel
{
    public function listArticles()
    {
        $db = $this->getDb();
        $stmt = $db->query('SELECT * FROM articles');

        return $stmt->fetchAll();
    }
}
```

If we want to write unit tests for this `listArticles()` method, the best option would probably be to refactor the models so that the database connection can be injected either through the constructor, or with a setter method.

In case refactoring is not an option for whatever reason, what we can do is to create a **partial mock** of the `ArticleModel` using [Mockery](http://docs.mockery.io/en/latest/reference/partial_mocks.html) and then mock (well, stub to be more precise) out only the `getDb()` method that will always return a mocked version of the `PDO` class:

<div class="filename">tests/ArticleModelTest.php</div>

``` php
<?php

use Mockery\Adapter\Phpunit;

class ArticleModelTest extends MockeryTestCase
{
    public function testListArticlesReturnsAnEmptyArrayWhenTheTableIsEmpty()
    {
        $stmtMock = \Mockery::mock('\PDOStatement');
        $stmtMock->shouldReceive('fetchAll')
            ->andReturn([]);
        $pdoMock = \Mockery::mock('\PDO');
        $pdoMock->shouldReceive('query')
            ->andReturn($stmtMock);

        // Create a partial mock of ArticleModel
        $articleModel = \Mockery::mock('ArticleModel')->makePartial();

        // Stub the getDb method on the ArticleModel
        $articleModel->shouldReceive('getDb')
            ->andReturn($pdoMock);

        // List all the articles
        $result = $articleModel->listArticles();
        $expected = [];

        $this->assertSame($expected, $result);
    }
}
```

When we tell Mockery to make a partial mock of a class, any method on that partially mocked class that has expectations set up will be mocked, but calls to other methods Mockery will pass through the real class. In other words, even though the `ArticleModel` is a partial mock, anytime we call the `listArticles()` method Mockery will pass that call to the original method, and only the calls to the `getDb()` method are being mocked.

Using partial mocks should probably be an option of a last resort and we should always aim to refactor code to be easier for testing, but there are cases when they can really help us in testing legacy code.

Happy hackin'!
