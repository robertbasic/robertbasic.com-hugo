+++
date = "2009-08-09T17:05:20+02:00"
title = "Playing with Zend_Navigation and routes"
slug = "playing-with-zend_navigation-and-routes"
description = "An example of using Zend_Navigation and routes with Zend Framework"
tags = ["example", "framework", "navigation", "php", "routing", "zend"]
categories = ["Development", "Programming"]
+++
<div class="zemanta-img" style="margin: 1em; display: block;">
<div>
<dl style="width: 250px;" class="wp-caption alignright">
<dt class="wp-caption-dt"><a href="http://www.flickr.com/photos/95124659@N00/2570224124"><img src="http://farm4.static.flickr.com/3031/2570224124_07e06c809f_m.jpg" alt="&quot;Zend Framework&quot; and &quot;PHP is th..." title="&quot;Zend Framework&quot; and &quot;PHP is th..." height="180" width="240"></a></dt>
<dd class="wp-caption-dd zemanta-img-attribution" style="font-size: 0.8em;">Image by <a href="http://www.flickr.com/photos/95124659@N00/2570224124">Aurelijus ValeiÅ¡a</a> via Flickr</dd>
</dl>
</div>
</div>
<p>O hai. First things first â€” someone should slap me for being such a lazy blogger. Somehow I lost all the motivation I had in the beginning, but looks like it's back now :) I finally had the time to play around with the latest <a class="zem_slink freebase/guid/9202a8c04000641f8000000000b66a0f" href="http://framework.zend.com/" title="Zend Framework" rel="homepage">Zend Framework</a> version (v 1.9 now). I managed to skip the whole 1.8.x version, so this whole Zend_Application stuff is quite new to me. I spent a few days poking around the manual and the code to make it work. And it works! Yey for me! And yey for <a href="http://twitter.com/akrabat">Rob Allen</a> for his post on <a href="http://akrabat.com/2009/07/08/bootstrapping-modules-in-zf-1-8/">Bootstrapping modules in ZF 1.8</a>!</p>
<p>Zend_Tool is an awesome tool. Creating a new project is like â€œzf create project project_nameâ€ :) And the new <a class="zem_slink" href="http://en.wikipedia.org/wiki/Bootstrapping" title="Bootstrapping" rel="wikipedia">bootstrapping</a> process with the Bootstrap class is somehow much clearer to me now... Anyways, lets skip to the code.</p>
<h2>The goal</h2>
<p>I wanted to set up routes in such way that when a user requests a page, all requests for non-existing controllers/modules are directed to a specific controller (not the error controller). In other words, if we have controllers IndexController, FooController and PageController, anything but http://example.com/index and http://example.com/foo is directed to the PageController. This can be useful for CMSs or blogs to make pretty links. Here's where the <a href="http://twitter.com/jaspertandy/status/3205493310">Zend_Controller_Router_Route_Regex</a> stuff comes in:</p>
<pre class="php" name="code">$route = new Zend_Controller_Router_Route_Regex(
    '(?(?=^index$|^foo$)|([a-z0-9-_.]+))',
    array(
        'controller' =&gt; 'page',
        'action' =&gt; 'view',
        'slug' =&gt; null
    ),
    array(
        1 =&gt; 'slug',
    ),
    '%s'
    );

$router-&gt;addRoute('viewPage', $route);
</pre>
<p>Basically the regex does the following: if it's index or foo don't match anything, thus calling up those controllers, in any other case match what's requested and pass it to the PageController's viewAction as the slug parameter. The fourth parameter, the '%s', is needed so that ZF can rebuild the route in components like the Zend_Navigation.</p>
<p>Now, when the PageController, viewAction get's called up, we can check, for example, if a page with that slug exists (like, in a database). If it exists, show the content, otherwise call up a 404 page with the error controller. In this fancy and sexy way we can call up pages without passing ID's or even letting the user know what part of the website is working on his request. He just request's http://example.com/some_random_article and kaboom! he get's the content :)</p>
<h2>Page navigation</h2>
<p>Oh the joy when I saw Zend_Navigation in the library! And it even includes view helpers to help us render links and menus and breadcrumbs! Yey! There are a <a href="http://blog.ekini.net/2009/05/25/zend-framework-making-the-built-in-breadcrumb-helper-work/">several</a> <a href="http://blog.ekini.net/2009/06/10/zend-framework-navigation-and-breadcrumbs-with-an-xml-file-in-zf-18/">blog posts</a> which go in details <a href="http://www.zendcasts.com/zend_navigation-dynamically-creating-a-menu-a-sitemap-and-breadcrumbs/2009/06/">about Zend_Navigation</a>, so I won't be bothering with that. What I wanted to make with Zend_Navigation is to have a menu of all the pages rendered everywhere. Here's where action helpers kick in. I made an action helper which makes up the structure of the links/pages. Something like this:</p>
<pre name="code" class="php">&lt;?php
class Zend_Controller_Action_Helper_LinkStructure extends
        Zend_Controller_Action_Helper_Abstract{
function direct(){
$structure = array(
    array(
         'label'=&gt;'Home page',
         'uri'=&gt;'/'
    ),
    array(
         'label'=&gt;'Articles',
         'uri'=&gt;'',
         'pages'=&gt;array(array(
                                  'label'=&gt;'Article 1',
                                  'uri'=&gt;'article_1'),
                              array(
                                  'label'=&gt;'Article 2',
                                  'uri'=&gt;'article_2'),
                         )
    )
);
return new Zend_Navigation($structure);
}
}
</pre>
<p>This is a simple example of the structure; I'm actually making it out from the database, with all the categories, subcategories and pages.</p>
<h2>Links everywhere</h2>
<p>To have this menu on all pages, we need to render it in the layout.phtml. Rendering is quite simple:</p>
<pre name="code" class="php">// somewhere in layout.phtml
&lt;?php echo $this-&gt;navigation()-&gt;menu(); ?&gt;
</pre>
<p>Of course, we need to pass the menu to the navigation helper somehow. To avoid doing <code>$this-&gt;navigation($this-&gt;_helper-&gt;linkStructure());</code> in all the controllers, we could do that once in the bootstrap (any other ways to make it happen?):</p>
<pre name="code" class="php">// in Bootstrap.php somewhere in the Bootstrap class
function _initView(){

        $view = new Zend_View();
        $view-&gt;doctype('XHTML1_STRICT');
        $view-&gt;headMeta()-&gt;appendHttpEquiv('Content-Type', 'text/html; charset=UTF-8');

        // our helper is in app/controllers/helpers folder, but ZF doesn't know that, so tell him
        Zend_Controller_Action_HelperBroker::addPath(APPLICATION_PATH.'/controllers/helpers');
        // now get the helper
        $linkStructure = Zend_Controller_Action_HelperBroker::getStaticHelper('LinkStructure');
        // and assign it to the navigation helper
        $view-&gt;navigation($linkStructure-&gt;direct());

        $viewRenderer = Zend_Controller_Action_HelperBroker::getStaticHelper('ViewRenderer');
        $viewRenderer-&gt;setView($view);

        return $view;
}
</pre>
<p>There. Now we have our menu rendered on all pages. Sexy isn't it? :)</p>
<p>That's it for now. Hope someone will find this useful :) Now I gotta go, need to get ready for a punk rock concert tonight!</p>
<p>Happy hacking!</p>
<div style="margin-top: 10px; height: 15px;" class="zemanta-pixie"><a class="zemanta-pixie-a" href="http://reblog.zemanta.com/zemified/900cdd04-8f9e-4bc3-9de1-03e0bd23457c/" title="Reblog this post [with Zemanta]"><img style="border: medium none ; float: right;" class="zemanta-pixie-img" src="http://img.zemanta.com/reblog_e.png?x-id=900cdd04-8f9e-4bc3-9de1-03e0bd23457c" alt="Reblog this post [with Zemanta]"></a><span class="zem-script more-related more-info pretty-attribution paragraph-reblog"><script type="text/javascript" src="http://static.zemanta.com/readside/loader.js" defer="defer"></script></span></div>
