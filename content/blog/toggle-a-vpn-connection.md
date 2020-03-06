+++
draft = false
date = 2020-03-06T17:14:59+01:00
title = "Toggle a VPN connection"
slug = "toggle-a-vpn-connection"
description = "I wrote a small bash script that helps me turn a VPN connection on and off."
tags = ["bash", "vpn"]
categories = ["Development"]
2020 = ["03"]
+++

At work I often have to turn a VPN connection on and off. Clicking through the network manager, finding the right VPN connection, connect to it... Feels like a waste of time, no? There has to be a better way. And there is :)

It uses the `nmcli` command line tool that comes with the Network Manager on Ubuntu:

<div class='filename'>toggle-vpn.sh</div>

``` bash
#! /bin/bash

VPN=$1

if [ -z "$VPN" ]
then
    exit 1
fi

ACTIVE=`nmcli con show --active | grep "$VPN"`

if [ -z "$ACTIVE" ]
then
    nmcli con up id "$VPN"
else
    nmcli con down id "$VPN"
fi

exit 0
```

We pass it one argument, the name (ID) of the VPN connection. Set it as an executable for the current user and link it to somewhere that's in our `$PATH`, like `/usr/local/bin`:
 
``` text
chmod u+x toggle-vpn.sh
sudo ln -s /home/robert/projects/toggle-vpn/toggle-vpn.sh /usr/local/bin/toggle-vpn
```

Running `toggle-vpn myvpn` for the first time will turn the VPN `myvpn` on, running it again will turn it off.

Now that we have it as a system wide command, we can create a keyboard shortcut for it through `Settings > Devices > Keyboard`. I have set it as `Ctrl+Super+V`.

Happy hackin'!
