+++
date = "2012-02-09T12:03:13+02:00"
title = "No more Wordpress"
slug = "no-more-wordpress"
description = "A short post about moving away from wordpress"
tags = ["wordpress", "blog", "custom"]
categories = ["Blablabla", "Development"]
+++
Over the weekend I finally had enough of wordpress and the bloat it 
became, so I ended up writing my own blog engine thing. Basically I just
 slapped together all the ZF modules and pieces I wrote over the past 
few years.<br /><br />The main goal was that the front end should remain as 
it was under wordpress. Think I got that part pretty well, even improved
 it in a few places (for example using sprites for the smaller icons, 
the header image is finally clickable ...). Gave a short thought about 
changing the theme, but even tho I'm using it for 3.5 years now, I still
 like it, so it stays as it is.<br /><br />The old content is pretty much 
all here; posts, tags, categories and comments are all imported. I 
intentionally left out the &quot;pingbacks&quot;. Probably will end up writing a 
separate post just about the importing of the content.<br /><br />The admin 
area still needs some work, but it's in usable state. If anyone is 
interested, the &quot;template&quot; I'm using for the admin area can be found <a href="https://github.com/robertbasic/admin" target="_self">on Github</a>,
 uses Dojo a lot. I still haven't decided will I end up open sourcing 
all of the PHP code, don't think there's anything new or &quot;revolutional&quot; 
in it - just good ol' time proven ZF code.<br />
<br />
Currently my main &quot;concern&quot; is the RSS feed, hopefully I didn't break 
it. If you notice anything broken with the site, please leave a comment 
or give me a shout on <a href="https://twitter.com/#!/robertbasic" target="_self">twitter</a>.<br />
<br />
Happy hackin'!<br />
