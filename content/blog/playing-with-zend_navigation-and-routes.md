+++
date = "2009-08-09T17:05:20+02:00"
title = "Playing with Zend_Navigation and routes"
slug = "playing-with-zend_navigation-and-routes"
description = "An example of using Zend_Navigation and routes with Zend Framework"
tags = ["example", "framework", "navigation", "php", "routing", "zend"]
categories = ["Development", "Programming"]
+++
O hai. First things first - someone should slap me for being such a lazy blogger. Somehow I lost all the motivation I had in the beginning, but looks like it's back now :) I finally had the time to play around with the latest <a class="zem_slink freebase/guid/9202a8c04000641f8000000000b66a0f" href="http://framework.zend.com/" title="Zend Framework" rel="homepage">Zend Framework</a> version (v 1.9 now). I managed to skip the whole 1.8.x version, so this whole Zend_Application stuff is quite new to me. I spent a few days poking around the manual and the code to make it work. And it works! Yey for me! And yey for <a href="http://twitter.com/akrabat">Rob Allen</a> for his post on <a href="http://akrabat.com/2009/07/08/bootstrapping-modules-in-zf-1-8/">Bootstrapping modules in ZF 1.8</a>!

Zend_Tool is an awesome tool. Creating a new project is like "zf create project project_name" :) And the new <a href="http://en.wikipedia.org/wiki/Bootstrapping" title="Bootstrapping" rel="wikipedia">bootstrapping</a> process with the Bootstrap class is somehow much clearer to me now... Anyways, lets skip to the code.

<h2>The goal</h2>

I wanted to set up routes in such way that when a user requests a page, all requests for non-existing controllers/modules are directed to a specific controller (not the error controller). In other words, if we have controllers IndexController, FooController and PageController, anything but http://example.com/index and http://example.com/foo is directed to the PageController. This can be useful for CMSs or blogs to make pretty links. Here's where the <a href="http://twitter.com/jaspertandy/status/3205493310">Zend_Controller_Router_Route_Regex</a> stuff comes in:

{{< highlight php >}}<?php
$route = new Zend_Controller_Router_Route_Regex(
    '(?(?=^index$|^foo$)|([a-z0-9-_.]+))',
    array(
        'controller' => 'page',
        'action' => 'view',
        'slug' => null
    ),
    array(
        1 => 'slug',
    ),
    '%s'
    );

$router->addRoute('viewPage', $route);
{{< /highlight >}}

Basically the regex does the following: if it's index or foo don't match anything, thus calling up those controllers, in any other case match what's requested and pass it to the PageController's viewAction as the slug parameter. The fourth parameter, the '%s', is needed so that ZF can rebuild the route in components like the Zend_Navigation.

Now, when the PageController, viewAction get's called up, we can check, for example, if a page with that slug exists (like, in a database). If it exists, show the content, otherwise call up a 404 page with the error controller. In this fancy and sexy way we can call up pages without passing ID's or even letting the user know what part of the website is working on his request. He just request's http://example.com/some_random_article and kaboom! he get's the content :)

<h2>Page navigation</h2>

Oh the joy when I saw Zend_Navigation in the library! And it even includes view helpers to help us render links and menus and breadcrumbs! Yey! There are a <a href="http://blog.ekini.net/2009/05/25/zend-framework-making-the-built-in-breadcrumb-helper-work/">several</a> <a href="http://blog.ekini.net/2009/06/10/zend-framework-navigation-and-breadcrumbs-with-an-xml-file-in-zf-18/">blog posts</a> which go in details <a href="http://www.zendcasts.com/zend_navigation-dynamically-creating-a-menu-a-sitemap-and-breadcrumbs/2009/06/">about Zend_Navigation</a>, so I won't be bothering with that. What I wanted to make with Zend_Navigation is to have a menu of all the pages rendered everywhere. Here's where action helpers kick in. I made an action helper which makes up the structure of the links/pages. Something like this:

{{< highlight php >}}<?php
class Zend_Controller_Action_Helper_LinkStructure extends
        Zend_Controller_Action_Helper_Abstract{
function direct(){
$structure = array(
    array(
         'label'=>'Home page',
         'uri'=>'/'
    ),
    array(
         'label'=>'Articles',
         'uri'=>'',
         'pages'=>array(array(
                                  'label'=>'Article 1',
                                  'uri'=>'article_1'),
                              array(
                                  'label'=>'Article 2',
                                  'uri'=>'article_2'),
                         )
    )
);
return new Zend_Navigation($structure);
}
}
{{< /highlight >}}

This is a simple example of the structure; I'm actually making it out from the database, with all the categories, subcategories and pages.

<h2>Links everywhere</h2>

To have this menu on all pages, we need to render it in the layout.phtml. Rendering is quite simple:

{{< highlight php >}}<?php
// somewhere in layout.phtml
<?php echo $this->navigation()->menu(); ?>
{{< /highlight >}}

Of course, we need to pass the menu to the navigation helper somehow. To avoid doing <code>$this->navigation($this->_helper->linkStructure());</code> in all the controllers, we could do that once in the bootstrap (any other ways to make it happen?):

{{< highlight php >}}<?php
// in Bootstrap.php somewhere in the Bootstrap class
function _initView(){

        $view = new Zend_View();
        $view->doctype('XHTML1_STRICT');
        $view->headMeta()->appendHttpEquiv('Content-Type', 'text/html; charset=UTF-8');

        // our helper is in app/controllers/helpers folder, but ZF doesn't know that, so tell him
        Zend_Controller_Action_HelperBroker::addPath(APPLICATION_PATH.'/controllers/helpers');
        // now get the helper
        $linkStructure = Zend_Controller_Action_HelperBroker::getStaticHelper('LinkStructure');
        // and assign it to the navigation helper
        $view->navigation($linkStructure->direct());

        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
        $viewRenderer->setView($view);

        return $view;
}
{{< /highlight >}}

There. Now we have our menu rendered on all pages. Sexy isn't it? :)

That's it for now. Hope someone will find this useful :) Now I gotta go, need to get ready for a punk rock concert tonight!

Happy hacking!
