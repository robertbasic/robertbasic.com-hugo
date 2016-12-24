+++
draft = false
date = "2016-12-24T12:00:44+01:00"
title = "Issues with Vagrant after upgrading to Fedora 25"
slug = "issues-with-vagrant-after-upgrading-to-fedora-25"
description = "Ran into small issues with Vagrant after upgrading to Fedora 25"
tags = ["fedora", "vagrant", "akmod", "virtualbox", "vboxmanage"]
categories = ["Development", "Software"]
2016 = ["12"]

+++

[Fedora 25](https://getfedora.org/) was released over a month ago, so I decided it was time to upgrade from 24.

Using the `dnf` plugin `system-upgrade` the entire process went smooth. The Fedora Magazine, as always, has a nice post on [how to upgrade](https://fedoramagazine.org/upgrading-fedora-24-fedora-25/).

So far I ran into only a couple of minor issues with [Vagrant](https://www.vagrantup.com/).

The first one, which isn't really a problem, is that Vagrant got downgroaded to version `1.8.x` from `1.9.1` which I had installed in Fedora 24. The fix for that is easy, just install the
new version again:

``` bash
robert@odin ~$ sudo dnf install ~/Downloads/vagrant_1.9.1_x86_64.rpm
```

The second issue was that, well, vagrant didn't really want to work. When trying to run `vagrant up` it would spit out the usual kernel module is not loaded error.

``` text
The provider 'virtualbox' that was requested to back the machine
'default' is reporting that it isn't usable on this system. The
reason is shown below:

VirtualBox is complaining that the kernel module is not loaded. Please
run `VBoxManage --version` or open the VirtualBox GUI to see the error
message which should contain instructions on how to fix this error.
```

Running `VBoxManage --version` provided a helpful message, for once:

``` text
robert@odin ~$ VBoxManage --version
WARNING: The vboxdrv kernel module is not loaded. Either there is no module
         available for the current kernel (4.8.15-300.fc25.x86_64) or it failed to
         load. Please try load the kernel module by executing as root

           dnf install akmod-VirtualBox kernel-devel-4.8.15-300.fc25.x86_64
           akmods --kernels 4.8.15-300.fc25.x86_64 && systemctl restart systemd-modules-load.service

         You will not be able to start VMs until this problem is fixed.
5.1.10r112026
```

Looking at the list of installed packages with `dnf list installed` I saw that both the `akmod-VirtualBox` and the `kernel-devel` packages are installed.

Running the next command fixed the issue:

``` text
robert@odin ~$ akmods --kernels 4.8.15-300.fc25.x86_64 && systemctl restart systemd-modules-load.service
Checking kmods exist for 4.8.15-300.fc25.x86_64            [  OK  ]
```

VBoxManage shows no warnings any more:

``` text
robert@odin ~$ VBoxManage --version
5.1.10r112026
```

and Vagrant works just fine again.

Happy hackin'!
