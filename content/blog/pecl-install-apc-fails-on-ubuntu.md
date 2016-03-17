+++
date = "2011-04-10T10:29:58+02:00"
title = "pecl install apc fails on Ubuntu"
slug = "pecl-install-apc-fails-on-ubuntu"
description = ""
tags = ["apc", "libpcre3", "pecl"]
categories = ["Development", "Software"]
2011 = ["04"]
+++
I was just installing APC on an Ubuntu server (what else to do on a Sunday morning?) with the standard set of commands:

{{< highlight bash >}}
sudo apt-get install php-pear php5-dev
sudo pecl install apc
{{< /highlight >}}

but the <code>pecl install apc</code> died with a bunch of "/tmp/pear/temp/APC/apc.c:430: error: "apc_regex" has no member named "preg"" and similar messages. Luckily, I can use google which led me to this <a href="http://serverfault.com/questions/206633/failed-to-instal-apc-via-pecl-install-apc/209577#209577">serverfault answer</a>: I was missing the "libpcre3-dev" package. After doing a quick <code>sudo apt-get install libcpre3-dev</code> APC got installed correctly.
