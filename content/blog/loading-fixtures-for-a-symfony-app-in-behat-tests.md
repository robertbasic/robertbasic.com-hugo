+++
draft = false
date = "2017-03-21T16:15:27+01:00"
title = "Loading fixtures for a Symfony app in Behat tests"
slug = "loading-fixtures-for-a-symfony-app-in-behat-tests"
description = "Loading data fixtures for Behat tests when testing a Symfony application"
tags = ["behat", "symfony", "fixtures", "php"]
categories = ["Programming", "Development"]
2017 = ["03"]

+++

Performing end to end testing of any application requires from us to have a set of reliable test data in the database.

If we write a [Symfony](https://symfony.com/) application and use [Behat](http://behat.org/) to do the end to end testing, the we can use the [Doctrine fixtures bundle](https://github.com/doctrine/DoctrineFixturesBundle) to create the required fixture loaders and load them in our Behat scenarios when required, using the `BeforeScenario` hook.

## Install Doctrine fixtures bundle

Using composer we can install the Doctrine fixtures bundle:

``` bash
composer require --dev doctrine/doctrine-fixtures-bundle:2.3.0
```

and enable the bundle in the `AppKernel`:

<div class='filename'>app/AppKernel.php</div>
``` diff
diff --git a/app/AppKernel.php b/app/AppKernel.php
index 0d22098..c30e863 100644
--- a/app/AppKernel.php
+++ b/app/AppKernel.php
@@ -27,6 +27,7 @@ class AppKernel extends Kernel
             $bundles[] = new Symfony\Bundle\WebProfilerBundle\WebProfilerBundle();
             $bundles[] = new Sensio\Bundle\DistributionBundle\SensioDistributionBundle();
             $bundles[] = new Sensio\Bundle\GeneratorBundle\SensioGeneratorBundle();
+            $bundles[] = new Doctrine\Bundle\FixturesBundle\DoctrineFixturesBundle();
         }

         return $bundles;
```

## Write a fixture loader

Now we can write a fixture loader. Writing fixture loaders is explained well in [the official documentation](http://symfony.com/doc/current/bundles/DoctrineFixturesBundle/index.html).

Here's an example fixture loader for the [FOSUser bundle](https://github.com/FriendsOfSymfony/FOSUserBundle), creating users for the application:

<div class='filename'>src/AppBundle/DataFixtures/ORM/LoadUserData.php</div>
``` php
<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadUserData implements FixtureInterface, ContainerAwareInterface
{
    /**
     * @var ContainerInterface
     */
    private $container;

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    public function load(ObjectManager $manager)
    {
        foreach ($this->getData() as $data) {
            $userManager = $this->container->get('fos_user.user_manager');

            $user = $userManager->createUser();

            $user->setUsername($data['username']);
            $user->setUsernameCanonical($data['username']);
            $user->setPlainPassword($data['password']);

            $user->setEmail($data['email']);
            $user->setEmailCanonical($data['email']);

            $user->addRole($data['role']);
            $user->setEnabled($data['enabled']);

            $userManager->updateUser($user, true);
        }
    }

    private function getData()
    {
        return [
            [
                'username' => 'admin',
                'password' => 'adminpassword',
                'email' => 'admin@email.com',
                'firstname' => 'Boss',
                'lastname' => 'Big',
                'role' => 'ROLE_ADMIN',
                'enabled' => true,
            ],
        ];
    }
}
```

Do note that the `LoadUserData` fixture loader also implements the `ContainerAwareInterface`, meaning that it will get an instance of the `ContainertInterface` when invoked through the `bin/console doctrine:fixtures:load` console command.

We use this instance of the container to get the user manager from the FOSUser bundle. In turn, we use the user manager to create and update the users we are loading with this fixture loader.

Rest of it is straightforward &mdash; we set the username, email, password, role on the user and update it. The user manager will handle the password encryption as per the application configuration, saving the user to the database, and so on...

## Load fixtures in Behat tests

The Behat test file has a bit more to it.

It requires the [Behat Symfony2 extension](https://github.com/Behat/Symfony2Extension) (so far it works for Symfony 3 applications as well!)

``` bash
composer require --dev behat/symfony2-extension:2.1.1
```

Next, we need to tell Behat to pass an instance of the `AppKernel` to our test. We do so through the `behat.yml` file:

<div class='filename'>behat.yml</div>
``` yaml
default:
    suites:
        my_feature:
            contexts:
                - 'FeatureContext'
                    kernel: '@kernel'
    extensions:
        Behat\Symfony2Extension:
            kernel:
                class: AppKernel
```

This will allow our `FeatureContext` test file to get an instance of a `KernelInterface`, the `AppKernel`, through the constructor:

<div class='filename'>features/bootstrap/FeatureContext.php</div>
``` php
<?php

use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;

use AppBundle\DataFixtures\ORM\LoadUserData;
use Behat\Behat\Hook\Scope\BeforeScenarioScope;
use Doctrine\Common\DataFixtures\Executor\ORMExecutor;
use Doctrine\Common\DataFixtures\Loader;
use Doctrine\Common\DataFixtures\Purger\ORMPurger;


class FeatureContext
{
    protected $container;

    protected $entityManager;

    public function __construct(KernelInterface $kernel)
    {
        $this->container = $kernel->getContainer();

        $this->entityManager = $this->container->get('doctrine.orm.default_entity_manager');

        $schemaTool = new SchemaTool($this->entityManager);
        $schemaTool->dropDatabase();
        $metadata = $this->entityManager->getMetadataFactory()->getAllMetadata();
        $schemaTool->createSchema($metadata);
    }
}
```

We get the container from the kernel and the entity manager from the container. No need to setup anything, it's all taken care of under the hood.

We also use this "occasion" to make sure that the database schema is recreated before the test is ran.

The final step is to load the fixtures data we need in our `FeatureContext.php` test file:

{{< highlight php "startinline=true" >}}
    /**
     * @BeforeScenario
     */
    public function loadDataFixtures(BeforeScenarioScope $scope)
    {
        $userData = new LoadUserData();
        $userData->setContainer($this->container);

        $loader = new Loader();
        $loader->addFixture($userData);

        $purger = new ORMPurger();
        $purger->setPurgeMode(ORMPurger::PURGE_MODE_DELETE);

        $executor = new ORMExecutor($this->entityManager, $purger);
        $executor->execute($loader->getFixtures());
    }
{{< /highlight >}}

The main thing to note here is that the container is not automatically set on the `LoadUserData` fixture loader, so we need to do that manually by calling the `setContainer` method with `$this->container` as an argument. Remember, we got the container instance from the kernel in the class constructor.

We tell the loader which fixture to load, the purger to delete any existing records from the database and finally the executor to load our fixtures.

Now when we run the Behat test suite, the database, in the environment against which we run the tests, will have a fresh set of data every time.

Happy hackin'!
