+++
date = "2011-04-14T16:47:31+02:00"
title = "A hack for Zend Framework's translated route segments"
slug = "zend-frameworks-translated-route-segments-hack"
description = "A dirty hack to work around a translated route segment issue."
tags = ["locale", "route", "translate", "zend framework"]
categories = ["Development", "Programming"]
+++
Today I came across on a little "gotcha" when using the translated route segments in a multilanguage web site and thought about sharing the dirty little hack I used to get around it.

Note: I"ve changed the title on this post. The first one sounded a bit like that ZF code itself contains a hack and not that I wrote a hack to solve a particular problem of mine. Sorry about that.

The set up of the router and translator is done "by the book", err, <a href="http://framework.zend.com/manual/en/zend.controller.router.html#zend.controller.router.routes.standard.translated-segments">by the manual</a>.

<h3>The problem</h3>

The web site's default locale, language, is English. If the user has no locale in the session/cookie, she, or he, will get the English version of the web site. If, for example, the user's first visit is on the <code>http://example.com/news</code> URL, there's no problem, the router will route that URI to the news module, index controller, index action and the user will get the news, in English, because the default locale is English. 

But! If the user's first visit is on the <code>http://example.com/vesti</code> URL ("vesti" is "news" in Serbian), the router can't route that because it depends on the locale and the default locale is English and not Serbian, thus directing the user to the 404 page. Of course, that is not good, because the requested URL is perfectly valid, just in a different language and the user should get the news in Serbian and not an error page.

<h3>The <del datetime="2011-04-14T16:00:06+00:00">solution</del> dirty hack</h3>

I hacked up a front controller plugin which in the postDispatch hook, if needed, changes the web sites locale to Serbian and dispatches the request all over again. If all goes well, the router will now route correctly the URL and the user will get the content.

{{< highlight php >}}
<?php

class App_Plugin_TranslatedRoute extends Zend_Controller_Plugin_Abstract
{

    public function postDispatch(Zend_Controller_Request_Abstract $request)
    {
        $request = $this->getRequest();
        $action = $request->getActionName();

        if($action != 'error') {
            return false;
        }

        $translator = Zend_Registry::get('Zend_Translate');
        $locale = $translator->getLocale();

        // English is the default
        // if the current locale is not the default, we might have been here earlier...
        if($locale != 'en') {
            return false;
        }

        $translator->setLocale('sr');
        Zend_Registry::set('Zend_Translate', $translator);

        $front = Zend_Controller_Front::getInstance();
        $front->getResponse()->clearBody();
        try {
            $front->dispatch();
        } catch(Exception $e) {
            // Haven't figured out a nicer way to redirect the user to the error controller
            header("Location: " . $request->getRequestUri());
            exit();
        }
    }
}
{{< /highlight >}}

<h3>The hack for the hack</h3>

That terrible, ugly, I-should-have-never-written-it piece of code at the end, the one with the <code>header("Location...</code> code in it is a hack for a hack. If in the second dispatching some error occurs, which at this point is a "valid" error, the user should be directed to the error controller/action. I haven't figured out a nicer way to do this. I tried several different things like doing the dispatch for the 3rd time, setting the request's controller/action to the error controller/action and whatnot but to no avail, every time I just end up a with blank page (yes, with error reporting turned on. Y'know, I'm one of those nuts who develops with E_NOTICEs on).

If anyone has some tips on fixing this problem in a more cleaner way, please do share them.

Happy hackin'!
