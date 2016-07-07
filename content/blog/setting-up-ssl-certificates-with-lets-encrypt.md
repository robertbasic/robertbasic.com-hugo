+++
draft = false
date = "2016-07-06T06:30:22+02:00"
title = "Setting up SSL certificates with Let's Encrypt"
slug = "setting-up-ssl-certificates-with-lets-encrypt"
description = "Describing how I got a Let's Encrypt certificate installed and configured on my server"
tags = ["let's encrypt", "ssl", "tls", "certificate", "nginx", "certbot"]
categories = ["Development", "Software"]
2016 = ["07"]

+++

<img alt="SSL Report Summary" title="A+ rating on the Qualys SSL Server Test" style="cursor: default; float: right; margin: 0px 0px 10px 10px;" unselectable="on" src="/img/posts/ssl-rating.png">

This past week I finally got around to setting up SSL certificates using [Let's Encrypt](https://letsencrypt.org/). Let's Encrypt is an [open certificate authority](https://letsencrypt.org/about/) that provides free SSL/TLS certificates. It's goal is to make creating, renewing and using SSL certs painless.

And it most certainly is. I was expecting a lot more hassle to set up all this, but it was really easy to do.

## Install certbot

[Certbot](https://certbot.eff.org/) is a Let's Encrypt client that helps setting up a certificate by obtaining and installing it on your servers. There are many more clients out there, but certbot is the recommended one to use.

I simply installed certbot using `dnf`:

``` bash
sudo dnf install certbot
```

but if your OS has no package for it yet, there's always the [manual way](https://certbot.eff.org/docs/intro.html#installation).

## Creating a certificate

Certbot has a number of [plugins](https://certbot.eff.org/docs/using.html#plugins) that can be used to create and install a certificate on a server. I chose the `webroot` plugin which only gets the certificate for me and leaves the webserver configuration up to me.

``` bash
sudo certbot --text --renew-by-default --agree-tos --webroot \
--email youremail@domain.tld \
--domains domain.tld,www.domain.tld \
--webroot-path /path/to/site/public \
certonly
```

This will create the certificate and it's private key in the `/etc/letsencrypt/live/domain.tld/` directory.

## Configuring nginx

The next step is to configure nginx by enabling SSL, providing the paths to the certificate and the private key, and which protocols and ciphers to use. I added these to the `server` block:

``` nginx
listen 443 ssl;

ssl on;
ssl_certificate /etc/letsencrypt/live/domain.tld/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/domain.tld/privkey.pem;
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:ECDH+3DES:DH+3DES:RSA+AESGCM:RSA+AES:RSA+3DES:!aNULL:!MD5:!DSS;
```

After restarting nginx, you should be able to load up your site through `https`. Just remember to allow traffic on the 443 port:

``` bash
sudo firewall-cmd -add-service=https --permanent
sudo firewall-cmd reload
```

## Additional configuration

To further harden the Diffie-Helman key exchange, create new parameters for it using `openssl`:

``` bash
sudo mkdir /etc/nginx/ssl
cd /etc/nginx/ssl
sudo openssl dhparam -out dhparams.pem 2048
```

I told nginx to use it by adding it to the same `server` block where I set up the SSL configuration:

``` nginx
ssl_dhparam /etc/nginx/ssl/dhparams.pem;
```

I also did some SSL optimizations and enabled Strict Transport Security:

``` nginx
ssl_session_timeout 10m;
ssl_session_cache shared:SSL:10m;
ssl_buffer_size 8k;
add_header Strict-Transport-Security max-age=31536000;
```

This blog post explains [HTTP Strict Transport Security](https://scotthelme.co.uk/hsts-the-missing-link-in-tls/) nicely.

All this and my website gets an A+ rating on the [Qualys SSL Server Test](https://www.ssllabs.com/ssltest/analyze.html).

Thanks to [Goran Jurić](http://gogs.info/) for pointing out to enable [OCSP stapling](https://www.digicert.com/enabling-ocsp-stapling.htm). I did so by adding this to the nginx `server` config:

``` nginx
ssl_stapling on;
ssl_stapling_verify on;
```

According to the [nginx documentation](http://nginx.org/en/docs/http/ngx_http_ssl_module.html#ssl_stapling) the `ssl_trusted_certificate` directive is needed only when the `ssl_certificate` file does not contain intermediate certificates, but the `fullchain.pem` created by Let's Encrypt does contain them, so I'm skipping that.

To test whether OCSP stapling is enabled, reload nginx, and from a local terminal run the following:

``` bash
openssl s_client -connect domain.tld:443 -status
```

The output should have something like:

``` bash
OCSP response:
======================================
OCSP Response Data:
    OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
    Version: 1 (0x0)
    Responder Id: C = US, O = Let's Encrypt, CN = Let's Encrypt Authority X3
```
