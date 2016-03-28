+++
date = "2010-07-20T12:24:28+02:00"
title = "Loading custom module plugins"
slug = "loading-custom-module-plugins"
description = "A quick post on loading module plugins."
tags = ["framework", "loading", "php", "plugin", "zend"]
categories = ["Development", "Programming"]
2010 = ["07"]
+++
OK, here's a quicky one from the office :P

I was trying to load a Front Controller plugin which resides in <code>app/modules/my_module/controllers/plugins/</code> and not in the "usual" <code>lib/My_App/Plugin/</code>. I want this plugin to be called in every request and I want the plugin file to be under it's "parent" module.

Here's what I did: added the path to the plugin and it's namespace to the Zend_Application_Module_Autoloader as a new resource type and then just register the plugin in the front controller in an other _init method.

Code is better, here's some:

``` php
<?php
class News_Bootstrap extends Zend_Application_Module_Bootstrap
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
                                    'namespace' => 'News',
                                    'basePath' => APPLICATION_PATH . '/modules/news'
                                )
                            );

        // adding model resources to the autoloader
        $moduleLoader->addResourceTypes(
                array(
                    'plugins' => array(
                        'path' => 'controllers/plugins',
                        'namespace' => 'Controller_Plugin'
                    )
                )
            );

        return $moduleLoader;
    }

    public function _initPlugins()
    {
        $this->bootstrap('frontcontroller');
        $fc = $this->getResource('frontcontroller');

        $fc->registerPlugin(new News_Controller_Plugin_Scheduler());
    }
}
```

If anyone knows a better way for doing this, please do share it with me.

Now back to work. Cheerio.
