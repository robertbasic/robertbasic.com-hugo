+++
draft = false
date = "2016-12-13T16:12:49+01:00"
title = "Renewing Let's Encrypt certificates"
slug = "renewing-lets-encrypt-certificates"
description = "Renewing Let's Encrypt certificates turns out to be really simple"
tags = ["certbot", "certificate", "let's encrypt", "ssl", "tls"]
categories = ["Development", "Software"]
2016 = ["12"]

+++

Back in July I wrote how to set up [SSL certificates with Let's Encrypt](/blog/setting-up-ssl-certificates-with-lets-encrypt/). One of my certificates was due to a renewal, and
anticipating some work to renew it, I decided to blog how to renew a [Let's Encrypt](https://letsencrypt.org/) certificate.

It was quite anticlimactic:

``` bash
sudo certbot renew
```

That's it. All that was required to renew a certificate. `certbot` even figures out which of the certificates is due to a renewal and renews only those.

Guess I can go back and do other things now.

Happy hackin'!
