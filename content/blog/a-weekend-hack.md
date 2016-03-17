+++
date = "2012-08-15T20:40:05+02:00"
title = "A weekend hack"
slug = "a-weekend-hack"
description = "Wrote an android app in a weekend hack."
tags = ["hacking", "php", "android", "app", "server", "pictures", "photos"]
categories = ["Development", "Programming", "Software"]
2012 = ["08"]
+++
For a while now I couldn't really make myself sit down in my spare time and do some programming just for the sake of programming. I'd rather read a book, cruise around on my longboard, or whatever. So, this past weekend I decided to try and "hack" together something in a weekend. To see can I still just sit down and write a piece of software, just because I <strike>like</strike> love doing it, and not because it's my job.

And yes, yes I can. For the better part of the Saturday and Sunday nights, I was just sitting in front of the computer and turning ideas in my head into bits and bytes. Now, this "app" is nothing revolutionary, nothing exciting, but it feels just damn good that I wrote it.

<h3>Photos</h3>

What does this "app" do? It's an Android app to post pictures from my phone to my server. That's it.

What's good about it, for me, is that it has two parts: the Android app itself, written in Java, and the server side code, written in PHP.

The good part about the server side code is that it's still the technologies I use everyday, but with more... liberty. It's basically just an "old-skul" top-down procedural style script.

The good part about the Android app is, well, that it's an Android app. Something I don't get to do everyday and, even tho it's Java, a "break out" technology from my day to day routine. The workflow is rather simple - pick a picture from the gallery of existing pictures on the SD card and send it to the server in a background, async task. Everything was rather simple and straightforward to write, except for the part on making the HTTP client in Java to work with self-signed certificates. That was scary, and probably deserves a blog post on its own. Probably.

I'll be using this app on a regular, daily basis (hopefully). If anyone's interested, have a look at the <a href="http://robertbasic.com/photos/">photos</a>. Note, at the time of writing this post, there's only one photo; a photo of me writing this very post. Heh.

Happy hackin'!
