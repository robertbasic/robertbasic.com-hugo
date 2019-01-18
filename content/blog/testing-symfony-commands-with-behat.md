+++
draft = false
date = 2019-01-18T09:50:22+01:00
title = "Testing Symfony commands with Behat"
slug = "testing-symfony-commands-with-behat"
description = "How to test Symfony commands with Behat"
tags = ["symfony", "behat", "commands", "bdd", "testing", "php"]
categories = ["Programming", "Development"]
2019 = ["01"]
software_versions = ["Symfony 4.1", "Behat 3.4", "Behat Symfony2 Extension 2.1"]
+++

The other day I was creating a Symfony command that will be periodically executed by a cronjob. I decided to write a Behat test for it, to see what a test like that would look like. Plus, just because it is executed by the system from a command line, doesn't mean we can skimp on the business requirements.

We need [Symfony](https://symfony.com/), [Behat](http://behat.org/en/latest/), and [Behat Symfony2 extension](https://github.com/Behat/Symfony2Extension). In the `behat.yml` file we configure the Behat extension to boot up the Kernel for us and pass it in is a constructor argument to our Behat Context:

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

We enable and configure the Behat Symfony2 extension, and tell Behat that the `system` suite will use the `system.feature` feature file and the `SystemContext` context which takes one constructor argument, the `kernel`. I don't like to put everything into the default [`FeatureContext`](http://behat.org/en/latest/user_guide/context.html) for Behat, but rather split different contexts into, well, different contexts. That's why I created the separate `SystemContext`.

The `boostrap.php` file is created when installing the extension (at least, it was created for me as I installed it using [Symfony Flex](https://symfony.com/doc/current/setup/flex.html)):

<div class="filename">./features/bootstrap/bootstrap.php</div>
``` php
<?php
putenv('APP_ENV='.$_SERVER['APP_ENV'] = $_ENV['APP_ENV'] = 'test');
require dirname(__DIR__, 2).'/config/bootstrap.php';
```

The `system.feature` file doesn't have much, just an example scenario:

<div class="filename">./features/system.feature</div>
``` gherkin
Feature: System executed commands

  Scenario: Behat testing a Symfony command
    Given I am the system
    When I greet the world
    Then I should say "Hello World"
```

## The SystemContext

The `SystemContext` file is where it gets interesting:

<div class="filename">./features/bootstrap/SystemContext.php</div>
``` php
<?php

use App\Kernel;
use Behat\Behat\Context\Context;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Webmozart\Assert\Assert;

class SystemContext implements Context
{
    /**
     * @var Application
     */
    private $application;

    /**
     * @var BufferedOutput
     */
    private $output;

    public function __construct(Kernel $kernel)
    {
        $this->application = new Application($kernel);
        $this->output = new BufferedOutput();
    }
```

It implements the Behat `Context` interface so that Behat recognizes it as a context.

In the constructor we create a new console `Application` with the `Kernel` that the Behat Symfony2 extension created for us. We will use this application instance to run the command that we are testing. For all intents and purposes, this application instance acts the same as the application instance that gets created in the `bin/console` script that we usually use to run Symfony commands.

We also create a `BufferedOutput` in the constructor, that will hold the output that the command produces, which we can later on use to assert did the command produce the desired output.

## Behat step definitions

The steps are defined like so (it's in the same `SystemContext.php` file as the previous example):

<div class="filename">./features/bootstrap/SystemContext.php</div>
``` php
<?php

class SystemContext implements Context
{
    /**
     * @Given I am the system
     */
    public function iAmTheSystem()
    {
        Assert::same('cli', php_sapi_name());
    }

    /**
     * @When I greet the world
     */
    public function iGreetTheWorld()
    {
        $command = 'app:hello-world';
        $input = new ArgvInput(['behat-test', $command, '--env=test']);
        $this->application->doRun($input, $this->output);
    }

    /**
     * @Then I should say :sentence
     */
    public function iShouldSay($sentence)
    {
        $output = $this->output->fetch();

        Assert::same($sentence, $output);
    }
```

### I am the system

In the first Behat step we assert that the PHP interface is the `cli`. Not sure how it could be anything else in this case, but let's have that in there.

### I greet the world

The second Behat step is where the fun part happens, where we **run the command**. The `ArgvInput` takes an array of parameters from the CLI in the [`argv` format](http://php.net/manual/en/reserved.variables.argv.php). In the case of `bin/console` it ends up being populated from [`$_SERVER['argv']`](http://php.net/manual/en/reserved.variables.server.php). In this case though, we need to populate it on our own.

The first argument is always the name that was used to run the script and it ends up being just a "placeholder", hence the `behat-test` value. We can put in anything there, really.

The second parameter is the command that we want to run: `app:hello-world`. It is the same string we would use when executing that command through `bin/console`. Because we created an instance of the `Application` in the constructor, Symfony will know exactly what command that is.

The third parameter is an option to tell Symfony to run the command in the `test` environment.

Once we have the input ready, we tell the application to run using the `doRun` method, passing in the input and the output (which is a `BufferedOutput`).

### I should say :sentence

In the third Behat step we fetch the output and assert that it is the same as the output we expected it to be.

## Make it reusable

To make it a bit more reusable, the running of the command in the `iGreetTheWorld` step can be extracted to a private method so that it all reads a little bit nicer. The final result looks something like this:

<div class="filename">./features/bootstrap/SystemContext.php</div>
``` php
<?php

use App\Kernel;
use Behat\Behat\Context\Context;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArgvInput;
use Symfony\Component\Console\Output\BufferedOutput;
use Webmozart\Assert\Assert;

class SystemContext implements Context
{
    /**
     * @var Application
     */
    private $application;

    /**
     * @var BufferedOutput
     */
    private $output;

    public function __construct(Kernel $kernel)
    {
        $this->application = new Application($kernel);
        $this->output = new BufferedOutput();
    }

    /**
     * @Given I am the system
     */
    public function iAmTheSystem()
    {
        Assert::same('cli', php_sapi_name());
    }

    /**
     * @When I greet the world
     */
    public function iGreetTheWorld()
    {
        $this->runCommand('app:hello-world');
    }

    /**
     * @Then I should say :sentence
     */
    public function iShouldSay($sentence)
    {
        $output = $this->output->fetch();

        Assert::same($sentence, $output);
    }

    private function runCommand(string $command)
    {
        $input = new ArgvInput(['behat-test', $command, '--env=test']);
        $this->application->doRun($input, $this->output);
    }
```

Happy hackin'!
