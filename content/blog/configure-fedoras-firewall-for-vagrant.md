+++
draft = false
date = "2016-12-09T08:54:33+01:00"
title = "Configure Fedora's firewall for Vagrant"
slug = "configure-fedoras-firewall-for-vagrant"
description = "A quick post how to enable a Vagrant interface in FirewallD"
tags = ["vagrant", "firewall", "fedora", "configuration"]
categories = ["Development", "Software"]
2016 = ["12"]

+++

This one's been in my drafts for a long time, might as well publish it.

FirewallD, Fedora's firewall, has a set of zones, which basically enables to configure trusted network connections inside these zones. You can read more about FirewallD on it's [wiki page](https://fedoraproject.org/wiki/Firewalld).

Whenever I bring up a Vagrant box for the first time, Fedora's firewall blocks the NFS shares, because the new Vagrant network interface does not belong to any zone. The usual symptom of
this is that Vagrant gets stuck on the mounting NFS shares step.

I have a zone called `FedoraWorkstation` that I use for all the Vagrant boxes I have on my laptop. This zone has a list of services that are allowed:

``` bash
robert@odin ~$ sudo firewall-cmd --zone FedoraWorkstation --list-services
dhcpv6-client rpc-bind nfs mountd ssh samba-client
```

You can use any other zone you like, but you need to have the `rpc-bind`, `nfs` and `mountd` services allowed for that zone.

After bringing up the Vagrant box, we need to figure out what's the name of the new Vagrant interface and add it to the firewall zone. Vagrant interfaces follow the naming schema of
`vboxnetX` where `X` is a number:

``` bash
robert@odin ~$ ip link show | grep "state UP" | grep "vbox"
7: vboxnet3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
```

From this we can see that the name of the interface is `vboxnet3`.

Let's add it to the FedoraWorkstation zone and reload:

``` bash
robert@odin ~$ sudo firewall-cmd --zone FedoraWorkstation --add-interface vboxnet3 --permanent
success
robert@odin ~$ sudo firewall-cmd --reload
success
```

Finally let's make sure that the interface was indeed added:

``` bash
robert@odin ~$ sudo firewall-cmd --zone FedoraWorkstation --list-interfaces
vboxnet3 vboxnet2 vboxnet0
```

And that's it. Happy hackin'!
