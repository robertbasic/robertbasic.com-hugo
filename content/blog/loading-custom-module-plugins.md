+++
date = "2010-07-20T12:24:28+02:00"
title = "Loading custom module plugins"
slug = "loading-custom-module-plugins"
description = "A quick post on loading module plugins."
tags = ["framework", "loading", "php", "plugin", "zend"]
categories = ["Development", "Programming"]
+++
<p>OK, here's a quicky one from the office :P</p>
<p>I was trying to load a Front Controller plugin which resides in <code>app/modules/my_module/controllers/plugins/</code> and not in the "usual" <code>lib/My_App/Plugin/</code>. I want this plugin to be called in every request and I want the plugin file to be under it's "parent" module.</p>
<p>Here's what I did: added the path to the plugin and it's namespace to the Zend_Application_Module_Autoloader as a new resource type and then just register the plugin in the front controller in an other _init method.</p>
<p>Code is better, here's some:</p>
<pre class="php" name="code">class News_Bootstrap extends Zend_Application_Module_Bootstrap
{
    /**
     * Autoloader for the "news" module
     *
     * @return Zend_Application_Module_Autoloader
     */
    public function _initNewsAutoload()
    {
        $moduleLoader = new Zend_Application_Module_Autoloader(
                                array(
                                    'namespace' =&gt; 'News',
                                    'basePath' =&gt; APPLICATION_PATH . '/modules/news'
                                )
                            );

        // adding model resources to the autoloader
        $moduleLoader-&gt;addResourceTypes(
                array(
                    'plugins' =&gt; array(
                        'path' =&gt; 'controllers/plugins',
                        'namespace' =&gt; 'Controller_Plugin'
                    )
                )
            );

        return $moduleLoader;
    }

    public function _initPlugins()
    {
        $this-&gt;bootstrap('frontcontroller');
        $fc = $this-&gt;getResource('frontcontroller');

        $fc-&gt;registerPlugin(new News_Controller_Plugin_Scheduler());
    }
}
</pre>
<p>If anyone knows a better way for doing this, please do share it with me.</p>
<p>Now back to work. Cheerio.</p>
