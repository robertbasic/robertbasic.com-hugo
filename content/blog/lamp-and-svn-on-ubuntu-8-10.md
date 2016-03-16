+++
date = "2008-11-24T20:00:33+02:00"
title = "LAMP and SVN on Ubuntu 8.10"
slug = "lamp-and-svn-on-ubuntu-8-10"
description = "Setup a basic LAMP server and SVN on Ubuntu 8.10 using VirtualBox"
tags = ["apache", "lamp", "setup", "subversion", "svn", "ubuntu", "virtualbox"]
categories = ["Development", "Programming", "Software"]
+++
<p>This post is a rewrite of one of my older posts, <a href="http://robertbasic.com/blog/ubuntu-as-a-dev-machine/">Ubuntu as a dev machine</a>, but this time I'll explain also how to setup a basic SVN besides the LAMP.</p>
<p><a href="http://www.ubuntu.com/">Ubuntu 8.10</a> was released bout a month ago and today I wasn't in the mood of doing any coding so I decided to try out the new Ubuntu. Once again, I'm installing it under <a href="http://www.virtualbox.org/">VirtualBox</a> (VB), cause it seems that they still haven't fixed the bug related to the rtl8187 chipset. Oh well...</p>
<p>Be sure to use VB v2.x.x. (v2.0.6. is the latest now), cause it's recognizing the correct screen resolution, not like VB v.1.6.4, whit which I had to configure manually the xorg.conf file...</p>
<h2>Setting up LAMP</h2>
<p>Here are the commands:</p>
<pre name="code" class="php">
sudo apt-get install apache2
sudo apt-get install php5 libapache2-mod-php5
sudo /etc/init.d/apache2 restart
sudo apt-get install mysql-server
sudo apt-get install libapache2-mod-auth-mysql php5-mysql phpmyadmin
sudo /etc/init.d/apache2 restart
sudo a2enmod rewrite
sudo /etc/init.d/apache2 restart
</pre>
<p>If mod_rewrite doesn't work, do the following:</p>
<pre name="code" class="php">
sudo gvim /etc/apache2/sites-available/default
</pre>
<p>And change <code>AllowOverride None</code> to <code>AllowOverride All</code>.</p>
<h2>Setting up SVN</h2>
<p>I'm not gonna explain how SVN works or the terms, this is just how to set it up. If you are not familiar with versioning and Subversion, read this book: <a href="http://svnbook.red-bean.com/">Version Control with Subversion</a>. It's free, available for download and contains probably everything you need to know about SVN. Be sure to learn the commands like commit, import, export, checkout, add, info, etc...</p>
<p>There are 2 ways for setting up SVN: as an Apache module or to use svnserve which is designed for SVN. As I already have Apache installed, the best solution is to use Apache for SVN. It's using a module called mod_dav_svn.</p>
<p>The setup presented here is very basic, it has no authentication and probably is insecure, but it's good for my needs on localhost.</p>
<p>The commands:</p>
<pre name="code" class="php">
sudo apt-get install subversion
sudo a2enmod dav
sudo /etc/init.d/apache2 restart
sudo apt-get install libapache2-svn
sudo /etc/init.d/apache2 restart
</pre>
<p>Now we have all packages installed, only the configuration left.</p>
<p>First, I create a folder called <code>svn</code> under the <code>var</code> folder:</p>
<pre name="code" class="php">
sudo mkdir /var/svn
</pre>
<p>Now I need to create a folder under the svn folder where all my repositories will be:</p>
<pre name="code" class="php">
sudo svnadmin create /var/svn/repos
</pre>
<p>We use the <code>svnadmin create</code> command to create the repository; <code>mkdir</code> is not good for this.</p>
<p>Next, open up the <code>httpd.conf</code> file and add the following lines to it:</p>
<pre name="code" class="php">
&lt;Location /repos&gt;
    DAV svn
    SVNPath /var/svn/repos
&lt;/Location&gt;
</pre>
<p>I've seen people creating a new user and group for SVN. I think (I haven't looked into it detailed) that's for the authentication stuff. I did a much simpler thing: I added the ownership over <code>/var/svn</code> to www-data (Apache user):</p>
<pre name="code" class="php">
sudo chown -R www-data /var/svn
</pre>
<p>This is probably a big security hole, but again: I use it only on localhost so I can live with that.</p>
<p>We are now ready to import a project into SVN, i.e. to add a project to the repository:</p>
<pre name="code" class="php">
svn import -m "First import to SVN" /import/from/here/project file:///var/svn/repos/project/trunk
</pre>
<p>To start working on that project we need to checkout it:</p>
<pre name="code" class="php">
svn checkout http://localhost/repos/project/trunk /var/www/project
</pre>
<p>Now the &#147;project&#148; is under SVN which should ease the development process. Since I'm using SVN I have no more backups of projects all over the place; if something goes wrong I know it's under SVN and I can revert to any older working version of my project.</p>
<p>Cheers!</p>
