+++
date = "2009-11-27T19:23:23+02:00"
title = "Chaining routes in Zend Framework"
slug = "chaining-routes-in-zend-framework"
description = "Example of using Zend_Router_Routes_Chain for adding multilanguage support to routes"
tags = ["example", "framework", "php", "route", "routing", "zend"]
categories = ["Development", "Programming"]
+++
On a forum, there was a question today, about adding language "support" to the routes using <a href="http://framework.zend.com/" title="Zend Framework" rel="homepage">Zend Framework</a>. The guy wanted routes like <code>/en/foo/bar</code> or <code>/de/baz</code>. I wrote there an example for that using <a href="http://framework.zend.com/manual/en/zend.controller.router.html#zend.controller.router.routes.chain">Zend_Router_Routes_Chain</a>, so just posting that example here, too :)

For what chains are for, is described in the manual, so I won't be covering that :P

Basically, we're prepending the language route to the other routes. This way, we have defined the route for the languages in one place only, plus, the other routes don't have to worry about the language, too.

{{< highlight php >}}// this goes in the bootstrap class
<?php
public function _initRoutes()
{
    $this->bootstrap('FrontController');
    $this->_frontController = $this->getResource('FrontController');
    $router = $this->_frontController->getRouter();

    $langRoute = new Zend_Controller_Router_Route(
        ':lang/',
        array(
            'lang' => 'en'
        )
    );
    $contactRoute = new Zend_Controller_Router_Route_Static(
        'contact',
        array('controller'=>'index', 'action'=>'contact')
    );
    $defaultRoute = new Zend_Controller_Router_Route(
        ':controller/:action',
        array(
            'module'=>'default',
            'controller'=>'index',
            'action'=>'index'
        )
    );

    $contactRoute = $langRoute->chain($contactRoute);
    $defaultRoute = $langRoute->chain($defaultRoute);

    $router->addRoute('langRoute', $langRoute);
    $router->addRoute('defaultRoute', $defaultRoute);
    $router->addRoute('contactRoute', $contactRoute);
}
{{< /highlight >}}

Assuming that we have an Index controller, with actions index and contact and a Foo controller with actions index and bar, paired with the routes from the above example, we could do requests like:

{{< highlight php >}}
/ => /index/index/lang/en
/de => /index/index/lang/de
/sr/contact => /index/contact/lang/sr
/en/foo => /foo/index/lang/en
/fr/foo/bar => /foo/bar/lang/fr
{{< /highlight >}}

Requesting a page like, e.g. <code>/de/baz</code>, would give us a 404 page, cause we don't have a Baz controller.

HTH :)

Happy hacking!
