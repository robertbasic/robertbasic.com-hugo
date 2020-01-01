+++
draft = false
date = "2016-12-22T16:46:29+01:00"
title = "Using Doctrine DBAL with Zend Expressive"
slug = "using-doctrine-dbal-with-zend-expressive"
description = "How to configure Doctrine DBAL to be used with Zend Expressive"
tags = ["zend expressive", "doctrine", "dbal", "zf"]
categories = ["Programming", "Development", "Software"]
2016 = ["12"]

+++

The [Doctrine project](http://www.doctrine-project.org/) comes with a [database abstraction and access layer](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/introduction.html) &mdash; Doctrine DBAL &mdash; which I prefer over other abstraction layers like [Zend DB](https://github.com/zendframework/zend-db).

My good friend James, aka [Asgrim](https://twitter.com/asgrim), has written already [how to integrate](https://www.jamestitcumb.com/posts/integrating-doctrine-expressive-easier) Zend
Expressive and Doctrine ORM.

But what if want to use only the DBAL with Zend Expressive, and not the entire ORM?

It's pretty easy as all we need to do is write one short factory that will create the database connection using the connection parameters we provide to it:

<div class='filename'>src/App/Infrastructure/Database/ConnectionFactory.php</div>

``` php
<?php declare(strict_types=1);

namespace App\Infrastructure\Database;

use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Driver\Connection;
use Interop\Container\ContainerInterface;

class ConnectionFactory
{
    public function __invoke(ContainerInterface $container) : Connection
    {
        $config = $container->get('config');
        $connectionParams = $config['db'];

        return DriverManager::getConnection($connectionParams);
    }
}
```

Configuration of the database connection is pretty straightforward as well:

<div class='filename'>config/database.php</div>

``` php
<?php declare(strict_types=1);

return [
    'db' => [
        'driver' => 'pdo_pgsql',
        'dbname' => 'database_name',
        'user' => 'username',
        'password' => 'password',
        'host' => 'localhost',
        'port' => 5432,
    ]
];
```

For other options and possible values, take a look at the [configuration documentation](http://docs.doctrine-project.org/projects/doctrine-dbal/en/latest/reference/configuration.html).

Next, we configure a `container-interop` service locator, like [Zend ServiceManager](https://github.com/zendframework/zend-servicemanager) to be able to access the database connection
in parts of the application where we need it. This configuration consists of mapping a factory name to the `ConnectionFactory` factory:

<div class='filename'>config/dependencies.php</div>

``` php
<?php declare(strict_types=1);

return [
    'dependencies' => [
        'factories' => [
            'db' => App\Infrastructure\Database\ConnectionFactory::class,
            // other factories ...
        ],
        // other type of dependencies ...
    ]
];
```

Now all we need to access the database connection is to grab it from the `ContainerInterface` container somewhere in our application and we're all set:

<div class='filename'>src/App/SomeObjectFactory.php</div>

``` php
<?php declare(strict_types=1);

namespace App;

use Interop\Container\ContainerInterface;

class SomeObjectFactory
{
    public function __invoke(ContainerInterface $container) : SomeObject
    {
        $connection = $container->get('db');
        return new SomeObject($connection);
    }
}
```

We can now use this `$connection` object to further create the query builder, work with transactions, the schema manager and other features the Doctrine DBAL provides us. Nice and easy.

Happy hackin'!
