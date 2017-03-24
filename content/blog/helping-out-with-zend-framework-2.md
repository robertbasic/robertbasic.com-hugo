+++
date = "2011-07-27T19:45:24+02:00"
title = "Helping out with Zend Framework 2"
slug = "helping-out-with-zend-framework-2"
description = "A few ways you can help out with the development of Zend Framework 2!"
tags = ["contribute", "contributing", "help", "zend framework", "zend framework 2", "zf"]
categories = ["Development", "Programming"]
2011 = ["07"]
+++
OK, here are some tips and resources so you can start helping out and contributing to Zend Framework 2.0 :)

First, here's a nice wiki page with some links on <a href="http://framework.zend.com/wiki/pages/viewpage.action?pageId=42303506">how to start with Zend Framework 2</a>. Be sure to check out the Zend Framework 2.0 patterns tutorial <a href="http://www.slideshare.net/weierophinney/zend-framework-20-patterns-tutorial">slides</a> and the <a href="http://www.zend.com/en/webinar/Framework/70170000000bX3J-webinar-zf-2-patterns-20110330.flv">webinar</a> on the same topic (you need to log in to watch it, but the registration is free, so no excuses).

The development is happening on <a href="https://github.com/zendframework/zf2">github</a>, so that's a nice starting point to get your hands dirty with some code. On the wiki there's a <a href="http://framework.zend.com/wiki/display/ZFDEV2/Zend+Framework+Git+Guide">Zend Framework Git Guide</a> to get you started. Pay close attention to the "<a href="http://framework.zend.com/wiki/display/ZFDEV2/Zend+Framework+Git+Guide#ZendFrameworkGitGuide-WorkingonZendFramework">Working on Zend Framework</a>" chapter.

As Matthew noted in <a href="http://zend-framework-community.634137.n4.nabble.com/How-to-help-with-ZF2-td3698907.html">this thread</a> you can:

<h3>Fix unit tests!</h3>

Once you forked and cloned the github repo, cd to the zf2/tests directory and simply make the tests there pass! Of course, there are *a lot* of tests there, so you might want to start with something easy and small; for example I picked the Zend\Dojo component :P

Anyway, once you're in the tests directory, just type:

``` bash
robert@odin:~/www/zf2/tests$ phpunit --verbose Zend/Dojo
```

or:

``` bash
robert@odin:~/www/zf2/tests$ phpunit --verbose Zend/Dojo/DojoTest.php
```

and watch the tests pass or fail. If they pass, good, if they fail, try to fix them and make them pass! I tell you, it's fun! By using the "--verbose" flag you'll get more (helpful) info about the tests.

<h3>Port Zend\Service</h3>

I haven't look into it yet, so just quoting from the mailing list:

<blockquote>

 * Port Zend\Service classes that interest you to namespaces, new<br />
  exception usage, etc.

</blockquote>

but I believe if you start from the tests for the services too, you should be all set!

<h3>Port ZF1 patches to ZF2!</h3>

Even if ZF2 is under development, ZF1 is still taken care of: that means, a lot of patches are present in ZF1 which are not in ZF2 (cause they were added after ZF2 branched off of ZF1, obviously...). Some patches will probably not be needed thanks to the rewrite, but some patches will be! So head over to the <a href="http://framework.zend.com/issues/">issue tracker</a>, search for recently (where recently is, say... this year?) resolved and fixed issues, see if they have a patch attached, if yes, open the patch, see if that patch is already in ZF2, if not, add it, issue a pull request, move on to the next issue.

<h3>Play with the existing code!</h3>

The official Zend Framework <a href="https://github.com/weierophinney/zf-quickstart">Quickstart is also on github</a>, with different features on different branches! Fork it, clone it, test it, make it, break it, fix it... I myself am rewriting a ZF1 based application to ZF2, so you can <a href="https://github.com/robertbasic/zf2phpplaneta">have a look</a> at that too!

I have also created a <a href="https://gist.github.com/1110033">few</a> <a href="https://gist.github.com/1101633">gists</a> <a href="https://gist.github.com/1101245">about</a> <a href="https://gist.github.com/1101201">using</a> the new helper loaders/brokers/plugins.

That's it for now, if I remember/find anything else, I'll update the post. Of course, if you have to add something, fire away! :)

Happy hackin'! :)
