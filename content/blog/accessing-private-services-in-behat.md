+++
draft = false
date = 2019-02-01T08:26:15+01:00
title = "Accessing Symfony private services in Behat"
slug = "accessing-symfony-private-services-in-behat"
description = "As of Symfony 4.1 there's a special test container in the test environment"
tags = ["symfony", "behat", "private services", "testing"]
categories = ["Programming", "Development"]
2019 = ["01"]
software_versions = ["Symfony 4.1", "Behat 3.4", "Behat Symfony2 Extension 2.1"]
+++

Since Symfony 3.4 services in the service container are [private by default](https://symfony.com/blog/new-in-symfony-3-4-services-are-private-by-default). While this decision made us write better production code by making us use Dependency Injection more and rely on the service container less, using these services in a test environment proved to be a challenge.

Since Symfony 4.1 there's a special service container in the test environment which [allows fetching private services in tests](https://symfony.com/blog/new-in-symfony-4-1-simpler-service-testing).

In a Behat test this test service container is not available through the `static::$container` property as it is in a `WebTestCase` or a `KernelTestCase`, but it is available under the `test.service_container` name in the service container.

We need Symfony, Behat, and Behat Symfony2 extension with the Behat Symfony2 extension configured bootstrap an instance of the `App\Kernel` for us:

<div class="filename">./behat.yml</div>
``` yaml
default:
    extensions:
        Behat\Symfony2Extension:
          kernel:
            bootstrap: features/bootstrap/bootstrap.php
            class: App\Kernel

    suites:
      system:
        paths:
          - '%paths.base%/features/system.feature'
        contexts:
          - SystemContext:
              kernel: '@kernel'
```

If the `behat.yml` example looks weird, I'm reusing it from my previous blog post on [testing Symfony commands with Behat](/blog/testing-symfony-commands-with-behat/).

Now that we have injected the kernel into our Context file, we can get the service container from the kernel, and from that service container access the `test.service_container`:

<div class="filename">./features/bootstrap/SystemContext.php</div>
``` php
<?php

use App\Kernel;
use Behat\Behat\Context\Context;

class SystemContext implements Context
{
    public function __construct(Kernel $kernel)
    {
        $testContainer = $kernel->getContainer()->get('test.service_container');
        $someService = $testContainer->get(App\Some\Service\We\Need::class);
    }
```

The test service container has all the services public and we can access them without worrying if they are private or public.

If you're project is still on Symfony 3.4 or Symfony 4.0, Tomas Votruba has a blog post explaining how to achieve something similar [using a compiler pass](https://www.tomasvotruba.cz/blog/2018/05/17/how-to-test-private-services-in-symfony/#quot-what-about-compiler-pass-quot).

Happy hackin'!
