+++
date = "2008-11-04T17:41:45+02:00"
title = "Powered by WordPress 2.7 beta 1"
slug = "powered-by-wordpress-27-beta-1"
description = "A quick look back on upgrading to WordPress 2.7 beta 1"
tags = ["blog", "upgrade", "wordpress"]
categories = ["Blablabla", "Free time", "Software"]
2008 = ["11"]
+++
I've decided to upgrade to <a href="http://wordpress.org/development/2008/11/wordpress-27-beta-1/" target="_blank">WordPress 2.7 beta 1</a>, just for fun. For now, no major problems occurred, just a few smaller ones, all which are caused by my hacking of the WordPress core &#151; I wasn't keeping track of all hacks I did, so there were some random errors, but everything should be fine now.

I don't recommend to no one upgrading to this version, unless you are OK with possible problems caused by this beta version. And even if you decide to upgrade now, do a backup of your database! Heck, do 2 backups!

First I did was backing up... No, I lie. First I did was start copying files of the <code>wp-admin</code> folder up to the server, when it came to my mind that I forgot to backup the database. Silly me. While it was copying I did a backup. Then I copied the contents of the <code>wp-includes</code> folder and then the files under the root folder of my blog. I haven't uploaded nothing from the <code>wp-content</code> folder.

Oh yeah. Under the root folder, skip copying one file (if it's there): the <code>wp-config.php</code> file, just to prevent overriding the configurations.

I tried to login to the dashboard. A message waited me, saying something like the database needs to be upgraded, blablabla, with a big a button. So I pressed the button. And everything went well. I logged in to the dashboard, to find out that I can finally find my way around the dashboard. It's soooo much better now!! Errmm... I even saw a screenshot of it some where on the Internet... Meh. Can't find it now.

After fixing those little errors I saw that my custom made template is working just fine and the plugins too &#151; all 3 of them.

So there. My blog is now powered with WordPress 2.7 beta 1. I thought to write a tutorial on upgrading from WP 2.6.x to WP 2.7 but as it all comes down to uploading the files and hitting that &#147;Upgrade database&#148; there is no need for a tutorial.

Oh, and in case you missed it: <strong>do a bloody backup first!</strong>

Cheers!

P.S.: If someone finds some errors or the blog starts misbehaving <a href="http://robertbasic.com/#form_contact">let me know!</a> Thanks!
