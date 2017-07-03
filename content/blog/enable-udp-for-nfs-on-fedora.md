+++
draft = false
date = "2017-07-03T09:52:48+02:00"
title = "Enable UDP for NFS on Fedora"
slug = "enable-udp-for-nfs-on-fedora"
description = "nfs-utils 2.1.1 disabled UDP by default for NFS"
tags = ["udp", "fedora", "nfs"]
categories = ["Software", "Development"]
2017 = ["07"]

+++

Recently bringing up Vagrant boxes started acting up when mounting the NFS shared folders. This is the error message I get:

``` bash
==> default: Mounting NFS shared folders...
The following SSH command responded with a non-zero exit status.
Vagrant assumes that this means the command failed!

mount -o vers=3,udp 192.168.33.1:/home/robert/projects/project/application /var/www

Stdout from the command:



Stderr from the command:

mount.nfs: requested NFS version or transport protocol is not supported
```

For some reason NFS doesn't like UDP on my machine, but as far as I know, UDP is the default in Vagrant.

This can be changed by telling Vagrant to not use UDP for synced folders, by adding `nfs_udp: false`:

``` ruby
  config.vm.synced_folder "./application", "/var/www", type: "nfs", nfs_udp: false
```

But as this is something only I have experienced in my team so far, "fixing" it on a project level seems like a bad choice. And when the next project comes, I'll probably have the same problem all over again.

Digging a bit deeper, I've came across this [ServerFault answer](https://serverfault.com/questions/848410/nfs-server-did-not-start-anymore-on-fedora-25-after-resent-update/848435#848435), which says that since `nfs-utils` version 2.1.1 UDP support for NFS is disabled by default.

The solution is to edit `/etc/sysconfig/nfs` and add `--udp` to `RPCNFSDARGS`:

``` text
RPCNFSDARGS="--udp"
```

Restarting the NFS server and Vagrant mounts the shared folders without problems again!

Happy hackin'!
