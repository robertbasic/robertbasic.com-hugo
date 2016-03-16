+++
date = "2008-11-21T01:12:26+02:00"
title = "TickTweet WordPress plug-in"
slug = "ticktweet-wordpress-plug-in"
description = "A WordPress plug-in that will show any tweet from Twitter public time-line where the searched term is mentioned."
tags = ["about", "blog", "php", "plugin", "site", "wordpress"]
categories = ["Blablabla", "Development", "Programming", "Software"]
+++
Few weeks ago <a href="http://twitter.com/imjustcreative">@imjustcreative</a> mentioned on Twitter that he would like a WordPress plug-in that would scroll (tick) tweets where &#147;soultweet&#148; is mentioned. As I wanted to do a plug-in for some time, but never had any good ideas, I told him that I'll take up the job. So I started to work on this in my free time.

Before I even started looking at anything, I decided that I want this plug-in to be fast, to work with smallest possible data to save bandwidth and to keep the number of calls towards Twitter low.

First I looked into the <a href="http://apiwiki.twitter.com/Search+API+Documentation">Twitter Search API documentation</a>, to see how data can be retrieved from Twitter &#151; in Atom or in JSON.

<h2>The first idea...</h2>

As a JSON document is smaller than an XML document, I decided to retrieve data in JSON. Of course, once retrieved it would be cached locally in a file for some time (5 minutes is my default).

I also wanted to avoid the possibility of the page waiting to retrieve the data from Twitter, so I figured that it would be the best to call it up with Ajax. That way, when the plug-in is called up, it sends an Ajax request to himself, the page continues loading normally and in the background runs the Ajax request.

The draft was there, I looked at the WordPress <a href="http://codex.wordpress.org/Writing_a_Plugin">writing a plug-in</a> page and in a week or so the first version of the plug-in was ready to go out.

I tested it locally on my Windows machine (a basic WAMP setup) and on my Ubuntu machine (a basic LAMP setup), on this server and on another one which has a ton of security limitations (server of my College). I was glad to see that it worked like a charm on all 4 servers. I put up a <a href="http://robertbasic.com/dev/ticktweet/">TickTweet page</a>, and let it out in the wild through <a href="http://twitter.com/robertbasic">Twitter</a>.

The retweet madness started immediately. <a href="http://twitter.com/imjustcreative">@imjustcreative</a>, <a href="http://twitter.com/jonimueller">@jonimueller</a> and <a href="http://twitter.com/bishop1073">@bishop1073</a> downloaded it right away. Soon as they enabled the plug-in, the short and exciting life of TickTweet started to end. Errors, bugs... Joni's server is running on PHP 4, and I had a few PHP 5 only functions. My bad. On Graham's and Bishop's server who knows what went wrong. <a href="http://imjustcreative.com/" title="Professional Logo Designer & Creative Freelancer">Graham</a> helped me a lot tracing down the bugs, a few of them were found and squashed, but that was not enough. So I decided to pull back TickTweet, rethink it and possibly rewrite it.

<h2>The second idea...</h2>

OK, this JSON &#151; Ajax thingy won't work. Back to the paper. I started looking at the WordPress core to see what functions and/or classes are available in it for this kind of task... Didn't took me long to find the <a href="http://codex.wordpress.org/Function_Reference/fetch_rss"><code>fetch_rss()</code></a> function. Man I was happy to find that! It's using the <a href="http://magpierss.sourceforge.net/">MagpieRSS</a> and the <a href="http://sourceforge.net/projects/snoopy/">Snoopy</a> classes to retrieve the data. I figured, those are included in WP's core, they're gonna do the job just fine. So I've rewritten it.

Testing again. The College's server was dropped out right away, no way around that security. On others it worked fine. I tested for a couple of days just to make sure. When I thought it was OK, I've let it go once again. I contacted Joni, Graham and Bishop to tell them that the new rewritten version is out. On <a href="http://blog.pixelita.com/">Joni's</a> site it worked. Awesome. On <a href="http://canddbishop.com/blog/">Bishop's</a> site worked. Kinda. On Graham's site didn't work. He tried it on another site. Worked. Cool. Finally it works. I was happy.

But not for long. The next day I saw that on my site it's ticking some ol' tweets. What?! Then started the bug hunting again. I looked at each line of code, <code>var_dump</code>ed every variable. No luck. Somehow, all of a sudden, my server is not getting the data from Twitter. No changes on the server configuration, no change in the code, but it just won't work.

<h2>The third idea...</h2>

The third idea is to leave this &#147;plug-in&#148; as&#151;is, and to stop working on it. It just doesn't pay off. Sure, I could trace down where it hangs on my server, going backwards through the code, but it's just not worth it. Those who are interested in this plug-in, you can find it at the <a href="http://robertbasic.com/dev/ticktweet/">TickTweet page</a>, use it, rewrite it, change it, trash it.

Cheers!
