+++
date = "2011-11-12T20:39:49+02:00"
title = "Upgrading to Fedora 16"
slug = "upgrading-to-fedora-16"
description = "Some notes on my upgrade to Fedora 16."
tags = ["fedora", "grub2", "upgrade", "xfce"]
categories = ["Development", "Software"]
+++
Decided today to upgrade my laptop to <a href="http://fedoraproject.org/">Fedora 16</a>, which was released a few days ago. I first switched to Fedora (with XFCE as the desktop environment) from Ubuntu in August, I think. An excellent decision as it is working really great for me. <a href="http://xfce.org/">XFCE</a> is also great, really happy that I made this switch.

Anyway, the upgrade from Fedora 15 to 16 went smoothly (although a bit slow, thanks to my shitty internet connection), using the <a href="http://fedoraproject.org/wiki/How_to_use_PreUpgrade">PreUpgrade</a> script/process. I was a bit sceptical about doing an upgrade and not a cleanstall, but gave it a shot after all (note: every time I tried a dist-upgrade with Ubuntu it failed miserably). PreUpgrade was downloading stuff for a bunch of hours and (about) an hour of installing them, the upgrade was... Done. Fedora 16 just booted up and I was using my laptop just as before.

I did the post upgrade steps from the above linked article, but the <code>yum distro-sync</code> step failed; it was complaining something about a "Transaction Check Error" for a libdvdcss package. I simply disabled the <strong>rpm.livna.org</strong> software source, re-run the distro-sync, it did it's thing and then re-enabled the source.

The second thing that "wasn't working" is that Apache and MySQL were not starting on bootup, so I ran chkconfig for both of 'em:

{{< highlight bash >}}
$ chkconfig --levels 235 mysqld on
$ chkconfig --levels 235 httpd on
{{< /highlight >}}

Lastly, grub was upgraded to grub2. It was working fine, just that it was showing the grub menu on startup, which is a bit silly given that I'm running only one OS on this machine. Anyway, added the following lines to <code>/etc/default/grub</code>:

{{< highlight bash >}}
GRUB_DISABLE_RECOVERY=true
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
GRUB_TIMEOUT=0 # I actually edited this line, from 5 to 0
{{< /highlight >}}

and ran:

{{< highlight bash >}}
$ grub2-mkconfig -o /boot/grub2/grub.cfg
{{< /highlight >}}

I also thought for a while that there was an issue with my wifi, that it's dropping connection randomly, but it only happened once, so I don't know what to do with it.

Happy hackin'!
