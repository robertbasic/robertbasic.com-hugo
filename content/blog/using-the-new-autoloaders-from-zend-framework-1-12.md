+++
date = "2012-06-22T11:10:02+02:00"
title = "Using the new autoloaders from Zend Framework 1.12"
slug = "using-the-new-autoloaders-from-zend-framework-1-12"
description = "A quick post on how to setup a ZF1 application to use the new autoloaders from ZF1.12"
tags = ["zend framework", "autoloader", "classmaps", "performance"]
categories = ["Development", "Programming"]
+++
<p>The latest, and last, release of the Zend Framework 1.x series is just around the corner as <a href="http://zend-framework-community.634137.n4.nabble.com/Zend-Framework-1-12-0RC1-Released-td4655323.html">ZF 1.12.0RC1 was announced this week</a>. As I still have projects running ZF1 I thought about giving the most interesting new feature (for me) a spin - the new autoloaders which are backported from ZF2.</p>
<p><b>Note: the code below was updated to work with ZF 1.12.0RC2.</b> Should still work with RC1, too.<br>
</p>

<p>I decided using the classmap autoloader as the main autoloader, and the good ol' standard autoloader as the fallback autoloader. For the classmap autoloader to work we need to create a classmap. ZF1.12 comes with a tool, located in the <code>bin</code> directory, called <code>classmap_generator.php</code>, which will generate the classmap for us:</p>


<pre name="code" class="bash">$ cd /path/to/project/library
$ php /path/to/zf1.12/bin/classmap_generator.php 
</pre>

<p>
This will generate a PHP file called <code>autoload_classmap.php</code> in the <code>library</code> directory and it will have classname - filename mappings of the classes/files from that directory.
</p>

<p>
Next, need to change the <code>index.php</code> a bit to tell ZF to use the new autoloaders:
</p>


<pre name="code" class="php">// normal setting up of APPLICATION_PATH and other constants here ...
// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));
require_once '../library/Zend/Loader/AutoloaderFactory.php';
// As of ZF1.12.0RC2 the Zend prefix is not autoregistered
// with the standard autoloader, so we need to require explicitly
// the ClassMapAutoloader.php
require_once '../library/Zend/Loader/ClassMapAutoloader.php';
Zend_Loader_AutoloaderFactory::factory(
    array(
        'Zend_Loader_ClassMapAutoloader' =&gt; array(
            __DIR__ . '/../library/autoload_classmap.php',
            __DIR__ . '/../application/autoload_classmap.php'
        ),
        'Zend_Loader_StandardAutoloader' =&gt; array(
            'prefixes' =&gt; array(
                'Zend' =&gt; __DIR__ . '/../library/Zend'
            ),
            'fallback_autoloader' =&gt; true
        )
    )
);
// set up Zend_Application as normal here ...
</pre>

<p>
and that's about it - the autoloader will load classes from the classmaps, but if it fails to do so, it will fall back to the standard autoloader.
</p>

<h3>Stripping out require_once calls</h3>

<p>
The Zend Framework manual has a section on <a href="http://framework.zend.com/manual/en/performance.classloading.html">how to improve performance of the framework</a>  itself, and one of the suggestion is to strip out the <code>require_once</code> calls from the library. I had to alter that find/sed command combination a bit in order to make it work with the classmaps:
</p>


<pre name="code" class="bash">$ find . -name '*.php' \
  -not -wholename '*/Application.php' \
  -not -wholename '*/Loader*' \
  -print0 | xargs -0 \
  sed --regexp-extended \
  --in-place 's/(require_once)/\/\/ \1/g'
</pre>

<p>
If I'm not wrong in reading my "debugging" echo statements, the standard autoloader gets called only once - to load the classmap autoloader itself - everything else is loaded via the classmaps. Pretty cool.
</p>

<p>
Happy hackin'!
</p>
