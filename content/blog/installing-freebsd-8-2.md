+++
date = "2011-03-27T18:18:38+02:00"
title = "Installing FreeBSD 8.2"
slug = "installing-freebsd-8-2"
description = "Notes on installing freebsd 8.2 and the struggle with the wireless card."
tags = ["freebsd", "install", "realtek", "rtl8187", "wireless"]
categories = ["Development", "Software"]
2011 = ["03"]
+++
As I'm currently in the progress of installing <a href="http://www.freebsd.org/">FreeBSD</a> on my first machine (out of 4), writing the process down for future reference sounds like a pretty good idea :)

I've installed it <a href="http://www.freebsd.org/where.html">from the CD image</a>. The installation process was straightforward, altho either the boot loader or freebsd was getting confused in the first few attempts because I was installing it on the slave HDD. After installing it on the master, everything went fine.

On this machine I'm using a <a href="http://uk.level1.com/product_d.php?id=410">LevelOne WNC0305 USB wireless card</a> which uses realtek's dreaded RTL8187 chipset. After a bit of a googling, I ended up on the freebsd 8.2 hardware notes page, which in the <a href="http://www.freebsd.org/releases/8.2R/hardware.html#WLAN">wireless section</a> lists all the available wireless drivers. From there I figured I need to use the <a href="http://www.freebsd.org/cgi/man.cgi?query=urtw&sektion=4&manpath=FreeBSD+8.2-RELEASE">urtw driver</a>, that is to add:

``` bash
if_urtw_load="YES"
```

to the /boot/loader.conf file. After rebooting the machine, it recognised my wireless card as urtw0. Hooray! Now to connect to the wireless router and onto the world.

For that, this message about <a href="http://forum.nginx.org/read.php?23,41676,41698#msg-41698">(not) getting the ifconfig scan results</a> helped me out, this bit to be precise:

``` bash
# ifconfig wlan0 create wlandev urtw0
# ifconfig wlan0 up list scan
```

and it listed my router correctly. To make it stay that way after rebooting, I've added this to the /etc/rc.conf file (I might note that it was empty before this):

``` bash
wlans_urtw0="wlan0"
```

At this time I figured I just could ssh to one of the servers in the office (we run freebsds there) and "steal" rest of the configuration, so I ended up with a /etc/rc.conf file something like this:

``` bash
hostname="freebsd_box"
wlans_urtw0="wlan0"
ifconfig_wlan0="inet 192.168.0.100 netmask 255.255.255.0"
defaultrouter="192.168.0.1"
```

Reboot once again and I can ping anything via IP, but not via hostnames. Again, this (ooold) message about <a href="http://lists.freebsd.org/pipermail/freebsd-questions/2005-July/094364.html">DNS settings in freebsd</a> showed me the right direction - /etc/resolv.conf:

``` bash
nameserver ip.of.name.server1
nameserver ip.of.name.server2
```

Reboot and everything is working fine! Victory!

Next step was (is) to fetch/update the <a href="http://www.freebsd.org/doc/en_US.ISO8859-1/books/handbook/ports-using.html">ports database</a>:

``` bash
# csup -L 2 -h cvsup.freebsd.org /usr/share/examples/cvsup/ports-supfile
```

From here I believe it's all about installing software from the ports which should be all fine.

Happy hackin'!
