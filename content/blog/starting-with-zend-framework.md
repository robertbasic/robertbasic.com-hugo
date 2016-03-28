+++
date = "2008-10-07T13:13:02+02:00"
title = "Starting with Zend Framework"
slug = "starting-with-zend-framework"
description = "Introduction to Zend Framework with example file structure, bootstrap file and htaccess file, explaining the basics of Zend Framework"
tags = ["framework", "introduction", "php", "zend"]
categories = ["Development", "Programming", "Software"]
2008 = ["10"]
+++
<a href="http://framework.zend.com" target="_blank">Zend Framework</a> is a big & heavy object-oriented framework for PHP. I started working with ZF a couple of months ago, I liked it's <a href="http://framework.zend.com/manual/en/" target="_blank">documention</a> (it's very well documented) and decided to stick with this framework. Here is the <a href="http://framework.zend.com/download/latest" target="_blank">latest</a> version of the framework &#151; at the time of writing v1.6.1.

It supports the <a href="http://en.wikipedia.org/wiki/Model-view-controller" target="_blank">MVC pattern</a>, which helps separating business logic from viewing logic. It supports a great number of <acronym title="Application Programming Interface">API's</acronym>, such as Delicious API, Flickr API, Yahoo API, <a href="http://akismet.com/" target="_blank">Akismet</a> API and many more.

The advantages of using a framework is that it is enforcing the developer to write code using a <a href="http://framework.zend.com/manual/en/coding-standard.html" target="_blank">coding standard</a>, it is well documented and well <a href="http://framework.zend.com/community/overview" target="_blank">supported</a>, and it is a lot easier to work in a 2+ person team using a framework. If you are a one&#151;man team, someday you may want to add more developers to your projects; the process of their settling in will be very comfortable if you are using a framework.

Choose yourself a <a href="http://en.wikipedia.org/wiki/Comparison_of_web_application_frameworks" target="_blank">framework</a> that best suits your needs, or write your own (be sure to make good documentation, also!). To be honest, I wasn't looking at other frameworks, just ZF, but I knew right away that it is good for me. Prior to this post I did a little research on other frameworks, and I'm still sure that I made the right choice by choosing ZF.

You can read a bit more about ZF in general on the <a href="http://framework.zend.com/manual/en/introduction.html" target="_blank">overview</a> page.

<h2>How does it work?</h2>

Before anything, we should take a look how does the ZF work, when used in the MVC manner. ZF has a thingy, called Front Controller. When a user is accessing a web page, the Front Controller is called: it's determining what should be done with the input and which further objects should be instantiated and methods called, and in what order.

E.g., if one makes a page request like: <code>http://example.com/news/last/</code>, first, the Front Controller is called. The Front Controller sets up the environment, loads up some files and classes, etc., then it calls a controller called &#147;News&#148; and an action called &#147;Last&#148; which is to be found inside the &#147;News&#148; controller. If it fails to find the &#147;News&#148; controller or the &#147;Last&#148; action, than it can show the user some error page, or to print out the error itself, depending how it is set up. If everything is OK, then it shows the user the content...

This explanation is very basic, as I intend to dedicate one big post to the Front Controller itself, going deep into details...

<h2>Some terms explained</h2>

<strong>Bootstrap file:</strong> all page requests are routed through this file, the Front Controller object is created here.

A <strong>module</strong> is a part of an application which has it's own controllers, actions, view scripts, models, configuration files. For example, a page can have a default module and a blog module, where each module has its own Index Controller, Administrator Controller, and have its own unique controllers, like a Comments Controller for the blog module.

A <strong>controller</strong> is a class which has its own actions and can have its own functions. It controls the data received from the user or from the database, and decides what to do with it. The controller is responsible for one set of things, e.g. a News Controller would list latest news, list news from a particular source, show the archive, etc.

An <strong>action</strong> is a function inside a controller, which is responsible for doing some action, e.g. action for showing news.

A <strong>model</strong> receives data from the Controller, and sends data to the Controller. Database related stuff &#151; selecting, inserting, updating, deleting &#151; should be only in the model. Filtering data that is to be inserted into the database should be done in the Controller, not in the model.

A <strong>view</strong> script is responsible to show the data received from the Controller to the user.

A <strong>view helper</strong> script is to help to do some automating in the view scripts, like formatting dates, generating form elements, etc.

<em>Just for the record</em>, in further examples, &#147;Dummy&#148; will be referring to a module, &#147;Foo&#148; will be referring to a controller inside the &#147;Dummy&#148; module and &#147;Bar&#148; will be referring to an action inside the &#147;Foo&#148; controller.

<h2>Basic file structure</h2>

Here's an example of a file structure for a ZF based application &#151; after the # sign are comments:

``` bash
/
|--library/
|  |--Zend/ # Zend core
|--application/ # Core of our application
|   |--default/ # The Default module
|       |--config/ # Some configuration files
|          |--config.ini
|       |--controllers/ # Controllers go here
|          |--IndexController.php
|          |--FooController.php
|       |--models/ # Models...
|          |--ModelName.php
|       |--views/ # View related stuff...
|          |--helpers/
|          |--scripts/
|             |--index/ # View files for the Index Controller
|               |--index.phtml # For the default index action
|             |--foo/ # View files for the Foo Controller
|               |--index.phtml # For the default index action
|               |--bar.phtml # For a bar action in the Foo Controller
|             |--layout.phtml # For layout
|   |--dummy/ # A Dummy module...
|       |--config/
|          |--config.ini
|       |--controllers/
|          |--IndexController.php
|          |--FooController.php
|       |--models/
|       |--views/
|          |--helpers/
|          |--scripts/
|             |--index/
|               |--index.phtml
|             |--foo/
|               |--index.phtml
|               |--bar.phtml
|--public/
   |--css/
   |--images/
   |--js/
   |--.htaccess
   |--index.php
```

With this file structure, <code>http://example.com/</code> should point to the <strong>public</strong> folder; this way, the application or the library can not be accessed through the browser, which improves security of the application.

<h2>The .htaccess file</h2>

The .htaccess file's responsibility is to route requests to existing resources (existing symlinks, non-empty files, or non-empty directories) accordingly, and all other requests to the front controller. Example:

``` php
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule .* index.php
```

<h2>The bootstrap file</h2>

The biggest problem is setting up correctly the bootstrap file. Here's an example of my bootstrap file, I use it on several projects, never had any problems :)

``` php
<?php
/**
* This is a general bootstrap file, change it to fit your needs
* Pay attention to the paths
*
*/
error_reporting(E_ALL|E_STRICT);
ini_set('display_errors',1); // set this to 0 on live version

// This is my timezone, change it to yours
// See timezones here: http://www.php.net/timezones
date_default_timezone_set("Europe/Belgrade");

/**
* We need to set some include paths
* To the library
* And to the models
* And add it to the current include path
*
*/
set_include_path('.' . PATH_SEPARATOR . '../library' .
					   PATH_SEPARATOR . '../application/default/models' .
                       PATH_SEPARATOR . '../application/dummy/models' .
					   PATH_SEPARATOR . get_include_path());

include("Zend/Loader.php");

/**
* This little fella loads up a class when needed
* So we don't need to bother with including class files
*
*/
Zend_Loader::registerAutoload();

/**
* This config part is needed only when you
* store stuff for db connections in a .ini file
* I do it this way all the time, so it's a part of my general bootstrap
*
*/
$config = new Zend_Config_Ini('../application/default/config/db_config.ini', 'offline');
$registry = Zend_Registry::getInstance();
$registry->set('config',$config);

// Only needed if you plan to use layouts in your app
Zend_Layout::startMVC();

/**
* Get an instance of the Front Controller
* Tell him where to look for controllers
* And off we go!
*
*/
$frontcontroller = Zend_Controller_Front::getInstance();
$frontcontroller->throwExceptions(true);
$frontcontroller->setControllerDirectory(array(
        'default'   =>  '../application/default/controllers',
        'dummy'       =>  '../application/dummy/controllers'
        ));
$frontcontroller->dispatch(); // GO!!!
```

This kind of bootstrap file should be enough in most cases; it is for me.

This post is starting to get out of control, so I'll stop here for now. Next time I'll show some basic stuff with controllers, actions, views etc. Until then be sure to get familiar with the <a href="http://framework.zend.com/manual/en/coding-standard.html" target="_blank">coding standard</a>, especially with the <a href="http://framework.zend.com/manual/en/coding-standard.naming-conventions.html">naming conventions</a>.

Hope that this text isn't too confusing. I tried to keep it simple and explain all that is needed for starting with Zend Framework.

Any thoughts on ZF, or frameworks in general? Do you use any?
