+++
date = "2010-12-27T20:25:06+02:00"
title = "A real gem - PHP_CompatInfo"
slug = "a-real-gem-php_compatinfo"
description = "PHP_CompatInfo is a PEAR package that can tell everything about a PHP file or library."
tags = ["extensions", "info", "information", "php", "version"]
categories = ["Development", "Programming"]
+++
<p>Last night I was pondering how nice would it be to have a tool of some sort, that would simply spit out what version of PHP does my app require. Something like: here are my .php files, what PHP version and/or extensions do I need for it? First I thought about jumping right in and writing it myself, but hey, this kind of a tool sounds way to useful not to be written already! After a bit of a googling there it was: <a href="http://pear.php.net/package/PHP_CompatInfo">PHP_CompatInfo</a>. A nice PEAR package that can tell me everything I want about my code and even a bit more.</p>
<p>It tells what's the minimum overall PHP version needed, all the PHP extensions used and the PHP versions and extensions file by file.</p>
<p>Installing PHP_CompatInfo is easy: <code>pear install php_compatinfo</code> and that's about it. Using it isn't much harder:</p>
<pre class="php" name="code">
&lt;?php

require_once 'PHP/CompatInfo.php';

$source = '/home/robert/www/Zend/';

$driverType = 'xml';
$driverOptions = array();

$info = new PHP_CompatInfo($driverType, $driverOptions);
$info-&gt;parseDir($source);
</pre>
<p>Include the main PHP_CompatInfo file, set the path to the file or directory you want to check and then just run it. By default it'll just var_dump the results, which is pretty much OK for a few files and directories. For a library like Zend Framework, I found the XML output to be the best. Besides the var_dumping and XML, there are other options for the output like CSV, a simple HTML table and Text, which is used when using the CLI. Oh, right, you can run it either from the console or from your web browser. <a href="http://pear.php.net/manual/en/package.php.php-compatinfo.tutorial.php">PHP_CompatInfo's documentation</a> is very well written and describes all part of it, so I won't be bugging you with that.</p>
<p>So yea, this little gem goes right into my box of must have tools.</p>
