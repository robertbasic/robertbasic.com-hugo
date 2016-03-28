+++
date = "2014-12-19T20:54:40+02:00"
title = "Battery charge thresholds for Thinkpad T540p on Fedora 21"
slug = "battery-charge-thresholds-for-thinkpad-t540p-on-fedora-21"
description = "Setting battery charging threshold in Fedora 21 for a Thinkpad T540p"
tags = ["fedora", "laptop", "thinkpad", "t540p", "tpacpi-bat", "battery"]
categories = ["Software", "Development"]
2014 = ["12"]
+++
This week I got myself a new laptop, a Thinkpad T540p. One of the features it has is that the battery's life can be prolonged by setting custom charging thresholds.

The start charge threshold tells the battery to start charging only when the charge drops bellow that limit, and the stop charge threshold tells the battery to stop the charging when the upper limit is reached. I set the start threshold to 40% and the stop threshold to 70%. I think this should be good enough for me as I mainly use my laptop at home where it's always plugged in.

After a bit of a digging around, I managed to get it working under Fedora 21.

The main thing to know is that there is <a href="http://www.thinkwiki.org/wiki/Tp_smapi">tp_smapi</a> for older Thinkpad's, and <a href="https://github.com/teleshoes/tpacpi-bat">tpacpi-bat</a> for the newer ones. I have a T540p so it's the latter for me.

There is also <a href="http://linrunner.de/en/tlp/docs/tlp-linux-advanced-power-management.html">tlp</a>, but at the moment I couldn't get it to work completely because it has no packages for Fedora 21 yet. Fedora 20/19 should be OK though, and for those I would probably go with <code>tlp</code>.

After git cloning the repository, run the install perl script, and if all went OK, set the start threshold like:

``` bash
./tpacpi-bat -s ST 1 40
```

and the stop threshold:

``` bash
./tpacpi-bat -s SP 1 70
```

Where 1 is the battery number, starting from 1, and 40 and 70 are the start and the stop thresholds in percentage.

These settings should remain after a reboot, but what I noticed is that they are gone after taking out and putting the battery back in. When I tried to set the threshold parameters again, I couldn't do it as the system was complaining about the missing acpi_call kernel module. I re-run the perl install script from tpacpi-bat and got it working again.

I'll be on the lookout for the tlp packages for Fedora 21, that looks like it would work nicer than this.

Now the only last bit I'm missing is the battery cycle count, but seems current kernels don't support it yet.
