+++
date = "2012-09-11T21:49:31+02:00"
title = "Working with custom view helpers in Zend Framework 2"
slug = "working-with-custom-view-helpers-in-zend-framework-2"
description = "Some usage tips on custom view helpers in Zend Framework 2."
tags = ["zend framework 2", "custom", "php", "view helpers"]
categories = ["Development", "Programming", "Software"]
2012 = ["09"]
+++
<a href="http://framework.zend.com/">Zend Framework</a> hit a big milestone as <a href="http://framework.zend.com/blog/zend-framework-2-0-0-stable-released.html">version 2 was released last week</a>. Sadly, I didn't have time to contribute to it, or even to poke around it much. I decided to slowly, as time permits, port this blog to ZF2; it should be a good enough learning playground.

I took the skeleton application, made it even skinnier by throwing out some (for me) unneeded parts and just put it all besides my old ZF1 code. <i>Note: I think it could be possible to have a ZF1 and a ZF2 app run side by side, something like <a href="https://twitter.com/skoop">Stefan</a> did for <a href="http://www.leftontheweb.com/message/Introducing_IngewikkeldWrapperBundle">Symfony1 and Symfony2</a>. Need to investigate on this.</i> The first problem I ran into was using custom view helpers, especially view helpers that are more general and don't fit into one specific module. Where to put the code? How to access them in views? The second problem was how to access the service manager from a view helper? And the third problem was how to tell the helper to use a specific value when inside a specific module?

<img unselectable="on" src="/img/posts/zf2viewhelpermodule.png" style="float: right; padding: 5px;">

<h3>Custom view helpers</h3>

As I found out, custom view helpers can live in different places (at least two) - in the <code>vendor/</code> directory, or in the <code>module/</code> directory as a part of a module. Both ways are probably good solutions, but for me it's way easier to use the custom view helpers when they are "packaged" as a module:

On the image you can see I put the helpers in a module called <code>Hex</code>. The <code>module.config.php</code> file is something like:

{{< highlight php >}}<?php
return array(
    'view_helpers' => array(
        'invokables' => array(
            'customHelper' => 'Hex\View\Helper\CustomHelper',
            // more helpers here ...
        )
    )
);
{{< /highlight >}}

The <code>Module.php</code> file is completely basic, it just has the <code>Module</code> class, implementing the <code>getConfig()</code> and the <code>getAutoloaderConfig()</code> methods. Include the module in the application's main configuration file (<code>config/application.config.php</code>) and now the <code>customHelper</code> can be simply called from the view files as:

{{< highlight php >}}<php echo $this->customHelper(); ?>
{{< /highlight >}}

<h3>Service manager in a view helper</h3>

To access the service manager in a view helper, it needs to implement the <code>ServiceLocatorAwareInterface</code> and two methods, <code>setServiceLocator()</code> and <code>getServiceLocator()</code>. In code, this would be something like:

{{< highlight php >}}<?php
namespace Hex\View\Helper;
use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
class CustomHelper extends AbstractHelper implements ServiceLocatorAwareInterface
{
    /**
     * Set the service locator.
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return CustomHelper
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
        return $this;
    }
    /**
     * Get the service locator.
     *
     * @return \Zend\ServiceManager\ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
    public function __invoke()
    {
        $serviceLocator = $this->getServiceLocator();
        // use it at will ...
    }
}
{{< /highlight >}}

Now, if you call <code>getServiceLocator()</code>, you'll actually get the <code>Zend\View\HelperPluginManager</code> which gives access to other view helpers. If you want to access the "application wide" service locator, you need to call <code>getServiceLocator()</code> again on the HelperPluginManager. Confused yet?

{{< highlight php >}}<?php
// first one gives access to other view helpers
$helperPluginManager = $this->getServiceLocator();
// the second one gives access to... other things.
$serviceManager = $helperPluginManager->getServiceLocator();
{{< /highlight >}}

<h3>Module specific values in view helpers</h3>

The problem (a bit simplified): how to tell the view helper to show "Welcome to my site!" on all routes/modules, except for the blog module, where it should show "Welcome to my blog!". This one was the trickiest, as it can be solved in way too many ways. I first tried 2-3 different approaches, but they either didn't work at all, or were just plain ugly hacky solutions. The final solution came to me when I answered a different question: <b>what would be the easiest way to unit test this code?</b> First, the custom view helper:

{{< highlight php >}}<?php
namespace Hex\View\Helper;
use Zend\View\Helper\AbstractHelper;
use Zend\ServiceManager\ServiceLocatorAwareInterface;
use Zend\ServiceManager\ServiceLocatorInterface;
class Greeter extends AbstractHelper implements ServiceLocatorAwareInterface
{
    protected $message = null;
    /**
     * Set the service locator.
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return CustomHelper
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
        return $this;
    }
    /**
     * Get the service locator.
     *
     * @return \Zend\ServiceManager\ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }
    public function getMessage()
    {
        if ($this->message === null) {
            // for example, get the default value from app config
            $sm = $this->getServiceLocator()->getServiceLocator();
            $config = $sm->get('application')->getConfig();
            $this->setMessage($config['message']);
        }
        return $this->message;
    }
    public function __invoke()
    {
        $message = $this->getMessage();
        return $message;
    }
{{< /highlight >}}

And the blog module specific part, where we hook to the "preDispatch" event:

{{< highlight php >}}<?php
namespace Blog;
class Module
{
    public function onBootstrap($e)
    {
        $eventManager = $e->getApplication()->getEventManager();
        $eventManager->attach('dispatch', array($this, 'preDispatch'), 100);
    }
    public function preDispatch($e)
    {
        $matchedRoute = $e->getRouteMatch()->getMatchedRouteName();
        // check for the matched route
        // and change the greeter message if needed
        if ($matchedRoute == 'blog') {
            $moduleConfig = $this->getConfig();
            $sm = $e->getApplication()->getServiceManager();
            $helper = $sm->get('viewhelpermanager')->get('greeter');
            $helper->setMessage($moduleConfig['message']);
        }
    }
{{< /highlight >}}

And that would be it. I think.

Happy hackin'!
