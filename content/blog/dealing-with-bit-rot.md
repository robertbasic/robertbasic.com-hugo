+++
draft = false
date = 2020-12-14T21:27:26+01:00
title = "Dealing with bit rot in a side project"
slug = "dealing-with-bit-rot-in-a-side-project"
description = "Not touching a project for a year makes it \"break\" on its own."
tags = ["composer", "php", "xdebug", "bit rot"]
categories = ["Programming", "Development"]
2020 = ["12"]
+++

As I wrote earlier, I'm "reviving" [a personal project](/blog/reviving-the-for-this-week-project/) that I didn't touch for a year. The development environment is dockerized, so the first task I need to do is to run the application it see what happens. As it turns out not much happens, as a mild case of ["bit rot"](https://en.wikipedia.org/wiki/Software_rot) set in.

Bringing up the docker environment works just fine, but when I run `composer install` to install the project dependencies, the process ends with an error:

```
Your lock file does not contain a compatible set of packages. Please run composer update.

  Problem 1
    - ocramius/package-versions is locked to version 1.4.2 and an update of this package was not requested.
    - ocramius/package-versions 1.4.2 requires composer-plugin-api ^1.0.0 -> found composer-plugin-api[2.0.0] but it does not match the constraint.

...

You are using Composer 2, which some of your plugins seem to be incompatible with. Make sure you update your plugins or report a plugin-issue to ask them to support Composer 2.
```

So, this seems like an error related to the [new major version of Composer](https://blog.packagist.com/composer-2-0-is-now-available/), 2.0. In my `Dockerfile` where I build the PHP image I have a line that copies composer from its official Docker image to my PHP image:

```
COPY --from=composer /usr/bin/composer /usr/bin/composer
```

As I say `--from=composer` docker uses whatever is the latest image with the name `composer`. Being a little more specific with the version numbers fixes the issue:

```
COPY --from=composer:1.10 /usr/bin/composer /usr/bin/composer
```

I choose to use the older version of composer as currently all I want to do is see in what state is the project. Upgrading packages to be compatible with Composer 2.0 could potentially lead me down a hole chasing rabbits I don't really want to chase right now.

After installing all the dependencies, I want to run the unit tests, but am greeted with yet another error instead:

```
Code coverage needs to be enabled in php.ini by setting 'xdebug.mode' to 'coverage'
```

That's... strange. I use Xdebug to generate code coverage for the unit tests. A quick look at `php -v` shows that the installed version of Xdebug is v3.0.something. I install Xdebug inside the docker image by using the `php7.2-xdebug` package. I don't see any way to tell `apt` which specific version of Xdebug to install. Lucas shared an idea of [installing an older version](https://twitter.com/lucasvanlierop/status/1336924635036790785) through pecl, but...

A look at the Xdebug docs to see what's this [`xdebug.mode`](https://xdebug.org/docs/install#mode) all about:

> This setting controls which Xdebug features are enabled.

and

> This setting can only be set in php.ini or files like 99-xdebug.ini that are read when a PHP process starts (directly, or through php-fpm), but not in .htaccess and .user.ini files where are read per-request.

Alright, I already have a `php-ini-overrides.ini` file that I mount inside the php container as `/etc/php/7.2/fpm/conf.d/99-overrides.ini`, so after adding the line:

```
xdebug.mode=develop,coverage,debug,profile
```

to that file and rebuilding the php image, the tests are green!

<img src="/img/posts/green-tests.png" />

Here I went with the option of "keeping" the newer version of Xdebug, instead of downgrading like I did with Composer, as Xdebug is more of an "outside" dependency than Composer is. Upgrading Xdebug didn't require me to upgrade any other packages, like composer did. Also, the fix, or better, the migration to Xdebug 3 was easy as I had to add a single line to my php.ini file. If it were more complicated than that, I would've either explore the option to downgrade to Xdebug 2, or turn off code coverage for the time being.

Happy hackin'!
