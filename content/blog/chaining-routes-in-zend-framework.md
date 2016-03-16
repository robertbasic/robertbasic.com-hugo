+++
date = "2009-11-27T19:23:23+02:00"
title = "Chaining routes in Zend Framework"
slug = "chaining-routes-in-zend-framework"
description = "Example of using Zend_Router_Routes_Chain for adding multilanguage support to routes"
tags = ["example", "framework", "php", "route", "routing", "zend"]
categories = ["Development", "Programming"]
+++
<p>On a forum, there was a question today, about adding language "support" to the routes using <a class="zem_slink" href="http://framework.zend.com/" title="Zend Framework" rel="homepage">Zend Framework</a>. The guy wanted routes like <code>/en/foo/bar</code> or <code>/de/baz</code>. I wrote there an example for that using <a href="http://framework.zend.com/manual/en/zend.controller.router.html#zend.controller.router.routes.chain">Zend_Router_Routes_Chain</a>, so just posting that example here, too :)</p>
<div class="zemanta-img" style="margin: 1em; display: block;">
<div>
<dl style="width: 250px;" class="wp-caption alignright">
<dt class="wp-caption-dt"><a href="http://www.flickr.com/photos/66621443@N00/141114012"><img src="http://farm1.static.flickr.com/51/141114012_8cfe928eb5_m.jpg" alt="rusty chain" title="rusty chain" height="160" width="240"></a></dt>
<dd class="wp-caption-dd zemanta-img-attribution" style="font-size: 0.8em;">Image by <a href="http://www.flickr.com/photos/66621443@N00/141114012">shoothead</a> via Flickr</dd>
</dl>
</div>
</div>
<p>For what chains are for, is described in the manual, so I won't be covering that :P</p>
<p>Basically, we're prepending the language route to the other routes. This way, we have defined the route for the languages in one place only, plus, the other routes don't have to worry about the language, too.</p>
<pre name="code" class="php">// this goes in the bootstrap class
public function _initRoutes()
{
    $this-&gt;bootstrap('FrontController');
    $this-&gt;_frontController = $this-&gt;getResource('FrontController');
    $router = $this-&gt;_frontController-&gt;getRouter();

    $langRoute = new Zend_Controller_Router_Route(
        ':lang/',
        array(
            'lang' =&gt; 'en'
        )
    );
    $contactRoute = new Zend_Controller_Router_Route_Static(
        'contact',
        array('controller'=&gt;'index', 'action'=&gt;'contact')
    );
    $defaultRoute = new Zend_Controller_Router_Route(
        ':controller/:action',
        array(
            'module'=&gt;'default',
            'controller'=&gt;'index',
            'action'=&gt;'index'
        )
    );

    $contactRoute = $langRoute-&gt;chain($contactRoute);
    $defaultRoute = $langRoute-&gt;chain($defaultRoute);

    $router-&gt;addRoute('langRoute', $langRoute);
    $router-&gt;addRoute('defaultRoute', $defaultRoute);
    $router-&gt;addRoute('contactRoute', $contactRoute);
}
</pre>
<p>Assuming that we have an Index controller, with actions index and contact and a Foo controller with actions index and bar, paired with the routes from the above example, we could do requests like:</p>
<pre>/ =&gt; /index/index/lang/en
/de =&gt; /index/index/lang/de
/sr/contact =&gt; /index/contact/lang/sr
/en/foo =&gt; /foo/index/lang/en
/fr/foo/bar =&gt; /foo/bar/lang/fr
</pre>
<p>Requesting a page like, e.g. <code>/de/baz</code>, would give us a 404 page, cause we don't have a Baz controller.</p>
<p>HTH :)</p>
<p>Happy hacking!</p>
<div style="margin-top: 10px; height: 15px;" class="zemanta-pixie"><a class="zemanta-pixie-a" href="http://reblog.zemanta.com/zemified/ea22a463-b7d7-42d3-bf7c-0fcb2e89785b/" title="Reblog this post [with Zemanta]"><img style="border: medium none ; float: right;" class="zemanta-pixie-img" src="http://img.zemanta.com/reblog_e.png?x-id=ea22a463-b7d7-42d3-bf7c-0fcb2e89785b" alt="Reblog this post [with Zemanta]"></a><span class="zem-script more-related pretty-attribution"><script type="text/javascript" src="http://static.zemanta.com/readside/loader.js" defer="defer"></script></span></div>
