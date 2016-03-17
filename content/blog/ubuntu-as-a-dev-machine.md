+++
date = "2008-10-15T07:04:15+02:00"
title = "Ubuntu as a dev machine"
slug = "ubuntu-as-a-dev-machine"
description = "A short note on setting up a LAMP server using VirtualBox and Ubuntu 8.04"
tags = ["apache", "lamp", "linux", "mysql", "php", "setup", "ubuntu", "virtualbox"]
categories = ["Development", "Software"]
2008 = ["10"]
+++
<em>This post is more of a note to myself, 'cause I keep forgetting all these Linux commands, and spend hours setting up stuff right...</em>

I'm installing <a href="http://www.ubuntu.com/" target="_blank">Ubuntu</a> 8.04 on <a href="http://virtualbox.org" target="_blank">VirtualBox</a>, with windows xp as the host machine. I must do it this way, because my wireless card is having some problems with Linux, something with the drivers. The <strong>possible</strong> solution includes kernel compiling &#151; thanks, but no thanks.

Anyway... The installation itself is no trouble, so I'll skip that. I always keep the apt-cache from previous installations, sparing hours of updating the system... On the host I have a folder that I share between the host OS and the client OS and first I need to reach that folder, to get from it the apt-cache.

First, need to install the Guest Additions. In Virtualbox go to Devices &#151;> Install Guest Additions. In the console run:

{{< highlight bash >}}
sudo /media/cdrom/VBoxLinuxAdditions.run
{{< /highlight >}}

After it's finished, we need to mount the shared folder:

{{< highlight bash >}}
sudo mount -t vboxsf name_of_the_sharing_folder /path/to/mount_point
{{< /highlight >}}

Now, for me, this command shows some error. Here's what I have to do:

{{< highlight bash >}}
sudo modprobe vboxfs
sudo mount -t vboxsf name_of_the_sharing_folder /path/to/mount_point
{{< /highlight >}}

Something with some modules not being loaded into the kernel, not bothered with it really... Now I can copy the apt-cache to where it needs to be:

{{< highlight bash >}}
sudo cp -r /path/to/mount_point/apt-cache /var/cache/apt/archives
{{< /highlight >}}

Now do the system update. If the system update includes a kernel update, you'll have to install Guest Additions once more...

Next installing the LAMP:

{{< highlight bash >}}
sudo apt-get install apache2
sudo apt-get install php5 libapache2-mod-php5
sudo /etc/init.d/apache2 restart
sudo apt-get install mysql-server
sudo apt-get install libapache2-mod-auth-mysql php5-mysql phpmyadmin
sudo /etc/init.d/apache2 restart
sudo a2enmod rewrite
sudo /etc/init.d/apache2 restart
{{< /highlight >}}

That should do it. But hey! mod_rewrite still doesn't work!

{{< highlight bash >}}
sudo gvim /etc/apache2/sites-available/default
{{< /highlight >}}

And change <code>AllowOverride None</code> to <code>AllowOverride All</code>.

There. I have a basic LAMP on Ubuntu under VirtualBox. I made a few snapshots of the VirtualBox image, in case I trash it (which probably will happen soon), so I don't need to reinstall over again.

Now, I'm of to setup SVN...
