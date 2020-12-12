+++
slug = "setting-up-a-custom-404-page"
description = "Configuring nginx to use a custom 404 page when a page can't be found."
tags = ["404", "nginx", "hugo", "template"]
categories = ["BlaBlaBla"]
draft = false
date = 2020-12-12T06:28:40+01:00
title = "Setting up a custom 404 page"
+++

The other day I realized that I don't have a custom 404 page up. Whenever someone requests a page that does not exist, nginx serves its custom 404 page. It's functional, tells the user what happened, but apart from that it's not really helpful.

Looking at the Hugo theme for my blog, there is a 404.html template there, but it's not used. When running the development server for Hugo and navigating to a non-existent page, it serves Hugo's deafult 404 page, not the one I have in the template. The Hugo documentation says: "`hugo server` will not automatically load your custom 404.html file, but you can test the appearance of your custom “not found” page by navigating your browser to /404.html."

I didn't configure the nginx site correctly. It's missing a `error_page 404 /404.html` line. I'll add that to `/etc/nginx/sites-available/robertbasic.com.conf`.

After updating the configuration file and reloading the web server, nginx serves the custom 404 page. Next step is to make it useful, instead of just writing down a "Page not found" message.

<img src="/img/posts/404.png" alt="A screenshot of the custom 404 page">

After a few versions of what to write, the end result turned out nice.

Happy hackin'!
