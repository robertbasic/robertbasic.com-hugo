+++
draft = false
date = 2018-03-24T10:45:22+02:00
title = "Connecting to MySQL 8"
slug = "connecting-to-mysql-8"
description = "Installing MySQL 8 client to be able to connect to MySQL 8 server"
tags = ["mysql", "authentication"]
categories = ["Software", "Development"]
2018 = ["03"]
+++

<p>I&rsquo;ve used recently <a href="https://phpdocker.io/">PHPDocker.io</a> to generate a set of Docker files for a pet project and it had the option to use MySQL 8 and of course I went with that. The problem was when I wanted to connect to the database that was on this MySQL 8 server.</p>

<p>I had locally installed the MySQL 5.7 client version and when trying to connect to the MySQL 8 server it complained about a missing authentication plugin:</p>
<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-text" data-lang="text">ERROR 2059 (HY000): Authentication plugin &#39;caching_sha2_password&#39; cannot be loaded:
/usr/lib64/mysql/plugin/caching_sha2_password.so: cannot open shared object file: No such file or directory</code></pre></div>
<p>Turns out, in MySQL 8 this <code>caching_sha2_password</code> is the default authentication plugin instead of the <code>mysql_native_password</code>. This new authentication plugin is described in <a href="https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html">the documentation</a>. I didn&rsquo;t want to change anything in the MySQL docker image, so instead I decided to upgrade to MySQL 8 client on my Fedora. First I removed all traces of MySQL I had:</p>
<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-text" data-lang="text">sudo dnf remove mysql</code></pre></div>
<p>Then I installed the RPM from MySQL:</p>
<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-text" data-lang="text">sudo dnf install https://dev.mysql.com/get/mysql57-community-release-fc27-10.noarch.rpm</code></pre></div>
<p>And finally installed the MySQL 8 client:</p>
<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-text" data-lang="text">sudo dnf --enablerepo=mysql80-community install mysql-community-client</code></pre></div>
<p>And now I can connect to the MySQL 8 server inside the Docker container:</p>
<div class="highlight"><pre style="color:#f8f8f2;background-color:#272822;-moz-tab-size:4;-o-tab-size:4;tab-size:4"><code class="language-text" data-lang="text">mysql -P 8082 -h 127.0.0.1 --protocol=tcp -utest -p test</code></pre></div>
<p>Happy hackin&rsquo;!</p>
