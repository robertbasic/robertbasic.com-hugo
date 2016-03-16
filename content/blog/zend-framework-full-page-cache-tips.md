+++
date = "2012-02-11T10:06:14+02:00"
title = "Zend Framework full page cache tips"
slug = "zend-framework-full-page-cache-tips"
description = "A post on two issues I had with full page caching and how I fixed them."
tags = ["zend framework", "full page cache", "caching"]
categories = ["Development", "Programming"]
+++
When I started rewriting this blog, I knew from start that I want to use Zend Framework's <a href="http://framework.zend.com/manual/en/zend.cache.frontends.html#zend.cache.frontends.page" target="_self">full page caching</a>,
 as, I think, that's the best cache for this purpose. Not much going on 
on the front end, much more reads than writes, no ajax or any other 
&quot;dynamic&quot; content. While implementing the cache, I ran into two issues.<br /><br />The
 first problem was that the cache files were created, but they were 
never valid - on each request a new cache file was created. It was a 
noob(ish) mistake - I had two calls to Zend_Session::startSession() in 
my code, which made the session ID always to change which made the cache
 validity test to fail. Removed the second call and all was well. Or so I
 thought...<br /><br />I moved the code to staging to run some final tests 
before pushing it live, but the cache started failing again. This time 
the cache files weren't even being created! The same code works on my 
machine, fails on staging. The only difference was that I had turned off
 the loading of Google Analytics in the development environment. But... 
that can't be it, right? Wrong. On every request the values of the GA 
cookies are different. The full page cache has a set of settings which 
dictates what variables are taken into account when creating an ID for 
the cache: <i>make_id_with_xxx_varialbes</i> where &quot;xxx&quot; is one of get, post, files, session, cookie and by default all are set to true. Setting <i>make_id_with_cookie_variables</i> to false made the cache to disregard the always changing GA cookies which made the cache start working again.<br /><br />So,
 if Zend Framework's full page cache starts failing for you, check the 
contents and behaviours of all the variables - get, post, files, 
session, cookie - and play around with the cache settings until it 
starts working again.<br /><br />Happy hackin'!
