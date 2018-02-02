+++
draft = false
date = 2018-01-30T21:30:30+01:00
title = "Docker nginx host not found in upstream error"
slug = "docker-nginx-host-not-found-in-upstream-error"
description = "That's what I get for not reading the documentation carefully"
tags = ["docker", "nginx", "selinux", "docker-ce", "docker-compose"]
categories = ["Development", "Software"]
2018 = ["01"]
+++

I've been toying around with [Docker](https://www.docker.com/) for the past couple of days, mostly to learn more about it, to understand it better. I just didn't bother with it until now.

I started from scratch. Installing Docker, configuring it (I really don't appreciate it filling my root partition with images), and, well, using it. I sort of figured out the `docker` command line interface, I get the difference between images and containers, I know how to write a `Dockerfile`, and when all the commands and options and flags start get confusing I know where to look in the help for help.

Happy with the progress I made, it was time to start connecting different containers so that they can talk to each other. Starting with a single container with nginx in it, and another container with php-fpm in it. Using their official images even.

To keep my sanity intact, as much as it is possible with software these days, I heeded [Vranac's](https://twitter.com/vranac) advice and installed docker-compose for that.

No cheating, so I wrote my own `docker-compose.yml` file using just the documentation:

``` yaml
version: '3'
services:

    php:
        image: php:7.2-fpm
        expose:
            - "9000"
        volumes:
            - ./app:/app

    nginx:
        image: nginx:stable
        ports:
            - "8080:80"
        volumes:
            - ./site.conf:/etc/nginx/conf.d/default.conf
            - ./app:/app
        depends_on:
            - php
```

And now let's build it and bring up the containers:

``` bash
$ docker-compose build
$ docker-compose up
```

Aaaaaaand... It dies with an error like:

``` text
nginx: [emerg] host not found in upstream "php" in /etc/nginx/conf.d/default.conf:15
```

Blergh. I guess I missed something from the documentation. Fast-forward 2 hours, dozens of google searches and articles, countless rewrites of the `docker-compose.yml` file, and zero luck. Whatever I did, same error: "host not found in upstream".

Then I finally remembered. What is the one thing that always causes me grief when trying to work with a web server? That's right: SELinux!

Turn off selinux, restart docker, build && up, and it works. Sonofa. Works even with the very first version of `docker-compose.yml` I wrote.

OK, turning off selinux can't be the solution, so I searched more... And no one, ever, recommends, or even mentions, that selinux might be the problem. I've installed the Docker SELinux package (it's `container-selinux` on my Fedora 26). It *should* be working!

Another hour later, more searches and articles, I end up at the beginning, at the ["Get Docker CE for Fedora"](https://docs.docker.com/install/linux/docker-ce/fedora/) documentation page. Docker CE? What the fresh hell is this?

Well, it's the docker version I should've installed in the first place.

Fedora's repos have docker version 1.13.something. Docker-CE is at 17.12.something.

Remove old docker, re-enable selinux, install new docker, ~~everything works just fine~~, and run the following:

``` bash
sudo ausearch -c 'iptables' --raw | audit2allow -M my-iptables
sudo semodule -X 300 -i my-iptables.pp
```

I have no idea what that does, but it was required to make it work.

*sigh*

Happy hackin'!
