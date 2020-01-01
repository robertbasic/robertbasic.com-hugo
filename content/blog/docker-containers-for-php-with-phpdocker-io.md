+++
draft = false
date = 2018-03-27T10:47:19+02:00
title = "Docker containers for PHP with PHPDocker.io"
slug = "docker-containers-for-php-with-phpdocker-io"
description = "PHPDocker.io makes it easy to get a Docker environment for a PHP project"
tags = ["php", "docker", "phpdocker.io"]
categories = ["Programming", "Development", "Software"]
2018 = ["03"]
+++

<p>This past weekend I was playing around on some pet projects and wanted to get up and running quickly. My initial reaction was to reach for a Vagrant box provisioned with Ansible. After all, that&rsquo;s what I&rsquo;ve been using for a really long time now.</p>

<p>Recently I&rsquo;ve been also learning a bit more about <a href="https://www.docker.com/">Docker</a>, so I figured maybe this pet project would be a good project to replace the standard Vagrant set up and go with Docker instead. When it comes to Docker, by now I believe I have a fairly good understanding of how it works and how it&rsquo;s meant to be used in a development environment. I&rsquo;ve learned a lot about it from <a href="http://blog.code4hire.com/">Vranac</a>, as well as poked around it <a href="/blog/docker-nginx-host-not-found-in-upstream-error/">on my own</a>.</p>

<p>While trying to write a set of Docker files and Docker compose files for this project, I thought there must be an easier way to do this&hellip; And then I remembered that some time ago I came across a generator to generate Docker environments for PHP projects: <a href="https://phpdocker.io/">PHPDocker.io</a>. As they state on their website:</p>

<blockquote>
PHPDocker.io is a tool that will help you build a typical PHP development environment based on Docker with just a few clicks. It supports provisioning of the usual services (MySQL/MariaDB, Redis, Elasticsearch...), with more to come. PHP 7.1 is supported, as well as 7.0 and 5.6.
</blockquote>

<h3 id="click-click-click-done">Click-click-click&hellip; done.</h3>

<p>What I like about PHPDocker is that it takes a couple of clicks and filling out a couple of text fields to get a nice zip with all the things needed to get a project up and running. It has support for a &ldquo;generic&rdquo; PHP application, like Symfony 4, Zend Framework and Expressive, or Laravel, as well as for applications based on Symfony <sup>2</sup>&frasl;<sub>3</sub>, or Silex. PHP versions supported range from 5.6 to 7.2 and a variety of extensions can be additionally enabled. Support for either MySQL, MariaDB, or Postgres is provided, as well as a couple of &ldquo;zero-config&rdquo; services like Redis or Mailhog.</p>

<p>The zip file comes with a <code>phpdocker</code> directory that holds the configurations for the specific containers such as the <code>nginx.conf</code> file for the nginx container. In the &ldquo;root&rdquo; of the zip there&rsquo;s a single <code>docker-compose.yml</code> file which configures all the services we told PHPDocker we need:</p>

<p><div class="filename">docker-compose.yml</div></p>

<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-yaml" data-lang="yaml"><span style="color:#75715e">###############################################################################</span>
<span style="color:#75715e">#                          Generated on phpdocker.io                          #</span>
<span style="color:#75715e">###############################################################################</span>
version: <span style="color:#e6db74">&#34;3.1&#34;</span>
services:

    mysql:
      image: mysql:<span style="color:#ae81ff">5.7</span>
      container_name: test-mysql
      working_dir: /application
      volumes:
        - .:/application
      environment:
        - MYSQL_ROOT_PASSWORD=root
        - MYSQL_DATABASE=test
        - MYSQL_USER=test
        - MYSQL_PASSWORD=test
      ports:
        - <span style="color:#e6db74">&#34;8082:3306&#34;</span>

    webserver:
      image: nginx:alpine
      container_name: test-webserver
      working_dir: /application
      volumes:
          - .:/application
          - ./phpdocker/nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      ports:
       - <span style="color:#e6db74">&#34;8080:80&#34;</span>

    php-fpm:
      build: phpdocker/php-fpm
      container_name: test-php-fpm
      working_dir: /application
      volumes:
        - .:/application
        - ./phpdocker/php-fpm/php-ini-overrides.ini:/etc/php/<span style="color:#ae81ff">7.2</span>/fpm/conf.d/<span style="color:#ae81ff">99</span>-overrides.ini</code></pre></div>
<p>Run <code>docker-compose up</code> in the directory where the <code>docker-compose.yml</code> file is located and it&rsquo;ll pull and build the required images and containers, and start the services. The application will be accessible from the &ldquo;host&rdquo; machine at <code>localhost:8080</code>, as that&rsquo;s the port I defined I wanted exposed in this case. You can see that in the <code>ports</code> section of the <code>webserver</code> service.</p>

<p>One thing I noticed is that the <code>mysql</code> service doesn&rsquo;t keep the data around, but that can be fixed by adding a new line to the <code>volumes</code> section of that service: <code>./data/mysql:/var/lib/mysql</code>. The <code>mysql</code> service definition should now read:</p>

<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-yaml" data-lang="yaml">    mysql:
      image: mysql:<span style="color:#ae81ff">5.7</span>
      container_name: test-mysql
      working_dir: /application
      volumes:
        - .:/application
        - ./data/mysql:/var/lib/mysql
      environment:
        - MYSQL_ROOT_PASSWORD=root
        - MYSQL_DATABASE=test
        - MYSQL_USER=test
        - MYSQL_PASSWORD=test
      ports:
        - <span style="color:#e6db74">&#34;8082:3306&#34;</span></code></pre></div>
<p>Other than this, I didn&rsquo;t notice any issues (so far) with the environment.</p>

<p>Inside the <code>phpdocker</code> folder there&rsquo;s also a <code>README</code> file that provides additional information how to use the generated Docker environment, what services are available on what port, a small &ldquo;cheatsheet&rdquo; for Docker compose, as well as some recommendations how to interact with the containers.</p>

<p>Happy hackin&rsquo;!</p>
