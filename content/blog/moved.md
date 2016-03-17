+++
date = "2010-07-11T11:58:18+02:00"
title = "Moved"
slug = "moved"
description = "Moved my stuff over to linode. Hooray!"
tags = ["about", "me", "moving"]
categories = ["Blablabla"]
2010 = ["07"]
+++
As I said 2 weeks earlier, I decided to move my stuff over to linode. Well, I did it. Kinda.

First step was to change the nameservers of the domain. I thought it's gonna take a while, so I took my time with moving the files and the database, but (at least on my end) the dns changes were alive and kickin' under an hour.

My original idea was to run everything on nginx, but that soon turned out to be a bad idea cause there was no way I could setup properly the rewriting - if PHP was working right, CSS was broken. If CSS was working right, PHP was broken. At one point I broke everything. Hooray for me. Then I just took down nginx and all that php-fastcgi stuff and installed apache. Everything is lovely once again, the world is all shiny and pink and full of rainbows and unicorns. But fear not, I will not let nginx beat me in this mad game of rewrites! Just have to do that somewhere else, not on a live server.

Now to setup the emails and my job here is done. Oh, and the sidebar is a tad broken. Sorry bout that.

Carry on now, nothing left to see here.
