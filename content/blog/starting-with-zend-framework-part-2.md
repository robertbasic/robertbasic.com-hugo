+++
date = "2008-10-20T15:42:58+02:00"
title = "Starting with Zend Framework - part 2"
slug = "starting-with-zend-framework-part-2"
description = "Zend Framework basics on controllers, actions, view scripts and view helpers find a small example"
tags = ["example", "framework", "introduction", "php", "zend"]
categories = ["Development", "Programming", "Software"]
+++
<p>This post is the second part of my introductory text on Zend Framework, <a href="http://robertbasic.com/blog/2008/10/07/starting-with-zend-framework/">Starting with Zend Framework</a>. This time I cover the basics about controllers, actions, view scripts and view helpers. On request routing and the Front Controller I will write one (or more) big post(s), so this part won't be explained now. I will also skip explaining the models; they deserve their own post :)</p>
<p>If anyone is into writing a guest-post on models, <a href="http://robertbasic.com/#form_contact">let me know!</a></p>
<h2>The Controllers</h2>
<p>The Controllers are the heart of every MVC based application. They control the execution of the application, what to do with the data, what to show the user, what to write to the database, etc. The Controllers that you will write all the time, are called <a href="http://framework.zend.com/manual/en/zend.controller.action.html" target="_blank">Action Controllers</a>. These Controllers subclass the Zend_Controller_Action <a href="http://www.php.net/oop5.abstract" target="_blank">abstract class</a>. Every application module must have a default Controller, which will be accessed if no specific Controller is requested. The default name for this default Controller is Index. Examples of the IndexController and FooController:</p>
<pre name="code" class="php">
&lt;?php

// The IndexController class must be placed in the controllers folder
// and saved as IndexController.php
class IndexController extends Zend_Controller_Action
{
    public function init()
    {
    }

    public function indexAction()
    {
    }
}

// The FooController class must be placed in the controllers folder
// and saved as FooController.php
class FooController extends Zend_Controller_Action
{
    public function init()
    {
    }

    public function indexAction()
    {
    }

    public function barAction()
    {
    }

    public function someRandomFunctionDoingSomeFunkyStuff()
    {
    }
}
</pre>
<p><!--more--></p>
<p>The Controllers must contain at least the <code>indexAction()</code> function; the others are arbitrary. I always have an <code>init()</code> function, in which I setup the cache object, call up the models, etc. Controller names that are not in the &#147;default&#148; module, must be prefixed with the Title-cased name of the module and an underscore:</p>
<pre name="code" class="php">
&lt;?php

// An example of the IndexController in the
// dummy module
// The file name remains IndexController.php!!!
class Dummy_IndexController extends Zend_Controller_Action
{
}

// An example of the FooController in the
// dummy module
// The file name remains FooController.php!!!
class Dummy_FooController extends Zend_Controller_Action
{
}
</pre>
<h2>The actions</h2>
<p>Actions are methods of the Controller class. Use them to do some specific task: show users, list news, insert to database (the actual INSERT SQL statement should be in the model), etc. As stated before, every Controller must have an index action &#151; this one is called if no specific action is requested. By default the view object is instantiated, so if you don't turn it off, you must create a view script with the same name as the action (without the &#147;Action&#148; word) in the <code>views/scripts/foo/</code> folder.</p>
<p>Assigning variables to the view scripts is simple:</p>
<pre name="code" class="php">
public function indexAction()
{
    $this-&gt;view-&gt;someVariable = "some value...";
}
</pre>
<h2>The view scripts</h2>
<p>View scripts are, well, for viewing. This is the only place where you should have statements like <code>echo</code> and <code>print</code>. The default templating engine is PHP itself, but it's possible to change it to something like Smarty. I leave PHP; it has everything for templating, so why would I change it? The default file extension for view scripts is &#147;phtml&#148; &#151; but as with everything, this can also be changed :)</p>
<p>Getting variables that are assigned from the action:</p>
<pre name="code" class="php">
// Output: some value...
&lt;?= this-&gt;someVariable ?&gt;
</pre>
<h2>The view helpers</h2>
<p>The view helpers are simple classes that help in view scripts with things like formatting dates, creating links, etc. Here's an example view helper that I use to show dates in &#147;Serbian&#148; format:</p>
<pre name="code" class="php">
File name: views/helpers/SrDateFormat.php
&lt;?php
/**
* View helper for returning dates in Serbian format
* dd.mm.yyyy.
*
*/
class Zend_View_Helper_SrDateFormat
{
    public function srDateFormat($dateToFormat)
    {
        return date('d.m.Y.', strtotime($dateToFormat));
    }
}
</pre>
<p>Usage is quite simple:</p>
<pre name="code" class="php">
// somewhere in some view script...
&lt;?= $this-&gt;srDateFormat($someDateToShow); ?&gt;
</pre>
<h2>Bringing it all together</h2>
<p>Just for an overview, here is an example of a Foo Controller in the Dummy module with index and bar actions and their view scripts.</p>
<pre name="code" class="php">
&lt;?php
// File name: application/dummy/controllers/FooController.php
class Dummy_FooController extends Zend_Controller_Action
{
    public function indexAction()
    {
        $this-&gt;view-&gt;sayHello = "Hi there!";
    }

    public function barAction()
    {
        $this-&gt;view-&gt;sayHelloAgain = "Hi here :)";
    }
}
</pre>
<p>And the view scripts:</p>
<pre name="code" class="php">
<!-- File name: application/dummy/views/scripts/foo/index.phtml -->
&lt;h1&gt;Saying hello&lt;/h1&gt;
&lt;?= $this-&gt;sayHello ?&gt;

<!-- File name: application/dummy/views/scripts/foo/bar.phtml -->
&lt;h1&gt;Saying hello again&lt;/h1&gt;
&lt;?= $this-&gt;sayHelloAgain ?&gt;
</pre>
<p>So if you direct your browser to &#147;http://example.com/dummy/foo/&#148; or to &#147;http://example.com/dummy/foo/bar&#148; you should get the &#147;Saying hello&#148; or the &#147;Saying hello again&#148; page...</p>
<p>This would be my introductory text to Zend Framework. Hope it's not confusing and is easy to follow. I just want to help newcomers to ZF help settling in easily :) For a tutorial application with ZF, I recommend <a href="http://akrabat.com/" target="_blank">Rob Allen's</a> <a href="http://akrabat.com/zend-framework-tutorial/" target="_blank">Zend Framework tutorial</a>.</p>
<p>In the coming days/weeks I'll write a detailed post about the Front Controller, so if you wish, <a href="http://feeds.feedburner.com/robertbasic/blog/">grab the feed</a> or <a href="http://www.feedburner.com/fb/a/emailverifySubmit?feedId=2400813&loc=en_US">subscribe by E-mail</a> to stay tuned.</p>
<p>Cheers!</p>
