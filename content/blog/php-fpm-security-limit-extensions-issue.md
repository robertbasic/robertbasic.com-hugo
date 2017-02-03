+++
draft = false
date = "2017-02-03T11:47:11+01:00"
title = "PHP-FPM security limit extensions issue"
slug = "php-fpm-security-limit-extensions-issue"
description = "A php-fpm security.limit_extensions issue turns out to be really a case of missing include fasctgi.conf"
tags = ["php-fpm", "nginx", "configuration", "security", "limit_extensions", "fastcgi"]
categories = ["Software", "Development"]
2017 = ["02"]

+++

For the first time ever I saw this error:

``` bash
2017/02/03 11:45:04 [error] 14656#0: *1 FastCGI sent in stderr: "Access to the script '/var/www/web' has been
denied (see security.limit_extensions)" while reading response header from upstream, client: 127.0.0.1, server:
proj.loc, request: "GET / HTTP/1.1", upstream: "fastcgi://unix:/var/run/php-fpm/www.sock:", host: "proj.loc"
```

I mean... what? `security.limit_extensions`? I honestly never heard of this before.

The [PHP manual](http://php.net/manual/en/install.fpm.configuration.php#security-limit-extensions) describes it as:

 > Limits the extensions of the main script FPM will allow to parse. This can prevent configuration mistakes on the web server side. You should only limit FPM to .php extensions to prevent malicious users to use other extensions to execute php code. Default value: .php .phar

Basically to avoid executing what an application might consider as a non-PHP file as a PHP file.

OK, cool, but why am I getting this error?

The currently top answer on Google suggests setting the list of limited extensions to an empty string, to practically disable the `security.limit_extensions` configuration. That fixes the error, but I'm really not comfortable with setting a security related configuration to a blank value, especially when people smarter than me set that configuration to a sane default value.

There must be a better, proper way to fix this, and this does feel like I misconfigured something in the nginx/php-fpm stack.

## Accessing a folder as a script?

The `Access to the script '/var/www/web' has been denied` part of the error messages also looks weird. Why would php-fpm try to access `/var/www/web`, which is a directory, as a script? Seems like it doesn't see the actual PHP script, and that sounds awfully similar to that old, dreaded `No input file specified` error message.

And that one is, in most cases, caused by not including the `fastcgi.conf` params file in the `location` block in the nginx configuration files. I double checked the configuration file and yup, I missed to include the fastcgi params file:

``` bash
server {
    # configuration for the server
    location ~ \.php$ {
        # configuration for php
        include fastcgi.conf; # << I missed this!
    }
}
```

I restarted nginx and everything works just fine, without touching the `security.limit_extensions` configuration.

Happy hackin'!
