+++
date = "2013-02-06T13:30:36+02:00"
title = "When a package update goes wrong"
slug = "when-a-package-update-goes-wrong"
description = "Managed to revert a broken package update with yum"
tags = ["linux", "fedora", "packages", "yum", "history", "undo"]
categories = ["Development", "Software"]
2013 = ["02"]
+++
I am running Fedora 17 on my laptop, and yesterday there were some packages to update. Nothing unusual, updates on Fedora are quite frequent and, up until yesterday, there was not a single problem I remember with any update. And it was a small update, four packages in total. What could possibly go wrong, right?

After a reboot an odd thing happened. My laptop did not automatically connect to the wifi. Huh. So I clicked on the little network manager icon to pick the wifi. The list of scanned wifis was empty. Not a single network on the list. Then I did all the usual things one could do in a situation like this - turn on/off the wifi via the network manager, turn on/off the wifi via the keyboard shortcut, reboot the laptop a couple of times. Still nothing. At this point I started panicking.

I started suspecting the update. But I have no idea what packages were actually updated, what those packages do, or how I could see what packages were updated. After a bit of a googling from my phone, the answer was <code>yum history</code>. Apparently, this command will list recent changes to the system done by <code>yum</code>. Each change has a <b>Transaction ID</b>. More information about each change can be get with <code>yum history info TID</code>, where TID would be the transaction ID of the change you're after. That will nicely list when did the change occur, which user made the changes, and what packages were affected in what way by that change.

<img style="cursor: default;" unselectable="on" src="http://robertbasic.com/static/img/posts/yumhistory.png" style="float:right;">

One package caught my eye, called <code>crda</code>. It was updated from version 1.1.2 to 1.1.3. Google told me that <a href="http://wireless.kernel.org/en/developers/Regulatory/CRDA">crda</a> has something to do with wireless. So, that was probably the culprit of my broken wireless. I started searching for possible bugs for this, or maybe even a workaround or a fix, but to no avail. I am not really good at debugging things like this, so I started looking for a way to somehow revert the update to this package and hopefully fix my wireless problems.

Yet again Google was involved and yet again <code>yum history</code> came to rescue. Apparently, besides tracking changes to the packages, it can also undo these changes: <code>yum history undo TID</code>, where TID is the ID of the transaction you want undone. It will try to undo changes to all packages, and in my case, it failed to undo some (hi Java!), but the crda package was reverted back to version 1.1.2 and after another reboot, the wireless was up and running once again, like nothing happened.

Yey for <b>yum</b>!

I have submitted <a href="https://bugzilla.redhat.com/show_bug.cgi?id=908267">a bug to Fedora's bugzilla</a> to hopefully figure out what went wrong and help the developers find a fix for this.
