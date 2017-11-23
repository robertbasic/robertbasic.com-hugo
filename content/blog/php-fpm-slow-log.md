+++
draft = false
date = 2017-11-23T16:12:18+01:00
title = "PHP FPM slow log"
slug = "php-fpm-slow-log"
description = "php-fpm has a slow log, which can be used to find slow requests"
tags = ["php", "php-fpm", "slow log", "optimization"]
categories = ["Programming", "Development"]
2017 = ["11"]
+++

The other day I was going through the configuration file for php-fpm, when I noticed a [configuration](https://secure.php.net/manual/en/install.fpm.configuration.php) directive I haven't before: `slowlog`. I guess it's been around for a while, I just never noticed it.

The php-fpm slow log is a pool configuration, meaning that we configure it in `www.conf`, and has two directives for it:

 - the `slowlog`, which is a path to a file where the slow requests will be logged,
 - and `request_slowlog_timeout` is a time unit after which PHP will dump a backtrace for that request in to the slow log file. We can configure it to be in seconds, minutes, hours, or days.

## What's in the ~~box~~ backtrace?

It has the date and time for when the slow request happened, the pool and PID for the php-fpm process. `script_filename` is the entry point to the request, and the backtrace includes a list of function calls up until the moment when the `request_slowlog_timeout` was hit.

``` text
[23-Nov-2017 15:28:21]  [pool www] pid 8992
script_filename = /var/www/example/web/app_dev.php
[0x00007efe32a14a40] sleep() /var/www/example/src/AppBundle/Controller/DefaultController.php:18
[0x00007efe32a149d0] indexAction() /var/www/example/vendor/symfony/symfony/src/Symfony/Component/HttpKernel/HttpKernel.php:153
[0x00007efe32a14960] call_user_func_array() /var/www/example/vendor/symfony/symfony/src/Symfony/Component/HttpKernel/HttpKernel.php:153
[0x00007efe32a14470] handleRaw() /var/www/example/vendor/symfony/symfony/src/Symfony/Component/HttpKernel/HttpKernel.php:68
[0x00007efe32a14320] handle() /var/www/example/vendor/symfony/symfony/src/Symfony/Component/HttpKernel/Kernel.php:169
[0x00007efe32a14250] handle() /var/www/example/web/app_dev.php:29
```

Even though it doesn't reveal too much, together with other profiling tools, like [Xdebug](https://xdebug.org/) and kcachegrind, it can help us a great deal on finding and fixing performance problems in web applications.

Happy hackin'!
