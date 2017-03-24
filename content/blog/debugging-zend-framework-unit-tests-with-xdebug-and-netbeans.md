+++
date = "2011-07-24T13:38:20+02:00"
title = "Debugging Zend Framework unit tests with Xdebug and NetBeans"
slug = "debugging-zend-framework-unit-tests-with-xdebug-and-netbeans"
description = "Setting up Netbeans and Xdebug to debug Zend Framework unit tests."
tags = ["netbeans", "tests", "unit testing", "xdebug", "zend dojo", "zend framework", "zf"]
categories = ["Development", "Programming", "Software"]
2011 = ["07"]
+++
I've spent this weekend hacking on some <a href="https://github.com/robertbasic/zf2/tree/dojo">unit tests for Zend\Dojo</a> and I ran into an issue where I need Xdebug to, well, debug. Note, that this is not for debugging a Zend Framework application, but for debugging Zend Framework itself. I am using Netbeans + Xdebug to debug regular code, but debugging unit tests was something completely new for me. Turns out, it's not entirely different from "regular" debugging.

Greatest help to figure out this was Raphael Dohms' blog post <a href="http://blog.rafaeldohms.com.br/2011/05/13/debugging-phpunit-tests-in-netbeans-with-xdebug/">"Debugging PHPUnit tests in Netbeans with Xdebug"</a>. Almost worked out fine, but Netbeans complained about a missing index file and the autoload of files was... not really working. After a bit of poking around, the solution was to go to File -> Project Properties -> Run Configuration and set the "Index File" to /path/to/zend_framework_2/tests/_autoload.php - no more missing index file and the autoload works too!

Starting the debug session stays the same as explained in Raphael's post: click "Debug project" (CTRL+F5), go to the terminal and just type something like:

``` bash
robert@odin:~/www/zf2/tests$ /path/to/phpunit-debug Zend/Dojo/DojoTest.php
```

Netbeans will pick up the connection and debugging can start!

Happy hackin'!
