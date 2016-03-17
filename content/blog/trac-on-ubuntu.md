+++
date = "2009-01-27T13:26:32+02:00"
title = "Trac on Ubuntu"
slug = "trac-on-ubuntu"
description = "How to install Trac on Ubuntu with SVN and user authentication."
tags = ["apache", "example", "lamp", "linux", "setup", "svn", "trac", "ubuntu"]
categories = ["Development", "Software"]
2009 = ["01"]
+++
Today I was messing around with <a href="http://trac.edgewall.org/">Trac</a>, installing it and doing some basic configuration. While my dev machine gets updated, I want to share my process of installing Trac.

<h2>What is Trac?</h2>

As said on the Trac homepage:

<blockquote>
Trac is an enhanced wiki and issue tracking system for software development projects.
</blockquote>

It's free, it's open source, it comes under the <a href="http://trac.edgewall.org/wiki/TracLicense">BSD license</a> and it's really awesome. You can write a wiki with it, have a ticket system, connect it with SVN, so you can browse the sources from the browser and see all the commit messages, when was something changed, added... It can support one project, it can support multiple projects. It can be viewable/editable by anyone, or you can close it down for your little team...

Trac is big. It has lots of <a href="http://trac.edgewall.org/wiki/TracPlugins">plug-ins</a>, so you can extend and customize your Trac. I haven't played with them yet, but as soon as I will, you'll get <a href="http://feeds2.feedburner.com/robertbasic/blog/">notified</a> ;)

It's written in <a href="http://python.org/">Python</a>. It can run on it's own server, or it can run under Apache (where there are also <a href="http://trac.edgewall.org/wiki/TracInstall#WebServer">several options</a>). It can use SQlite, PostrgeSQL or MySQL databases. Currently it can connect only to SVN.

I'll show you how to setup a basic Trac 0.11-dot-something-dot-something. It will run under Apache with <a href="http://code.google.com/p/modwsgi/">mod_wsgi</a>, use a SQlite database, connect to the SVN repository and require user authentication.

<!--more-->

<h2>Installing Trac</h2>

Before anything, I want to say that my machine where I installed Trac has LAMP and SVN <a href="http://robertbasic.com/blog/lamp-and-svn-on-ubuntu-8-10/">configured like this</a>. So, this post is kinda the next part of that post.

First, I installed a Python tool, called Easy Install. It's here to make our installation process easier. Lovely. Go to <a href="http://pypi.python.org/pypi/setuptools/">http://pypi.python.org/pypi/setuptools/</a>, scroll down to the downloads section and choose a Python egg to download (match it to your currently installed Python version &#151; I have Python 2.5 so I downloaded &#147;setuptools-0.6c9-py2.5.egg&#148;).

Fire up a console and type:

{{< highlight bash >}}
sudo sh setuptools-0.6c9-py2.5.egg
{{< /highlight >}}

Of course, you need to match this to your own setuptools file.

Next, type:

{{< highlight bash >}}
sudo easy_install Trac
{{< /highlight >}}

EasyInstall will now locate Trac and it's dependencies, download and install them.

Download the mod_wsgi:

{{< highlight bash >}}
sudo apt-get install libapache2-mod-wsgi
{{< /highlight >}}

It will install and enable mod_wsgi. And, in my case, it only tried to restart Apache, but for an unknown reason it fails to do so. If that happens, just do a quick:

{{< highlight bash >}}
sudo /etc/init.d/apache2 restart
{{< /highlight >}}

If you want Subversion with your Trac, you'll need the python-subversion package:

{{< highlight bash >}}
sudo apt-get install python-subversion
{{< /highlight >}}

If you have it already, it'll just skip it. If you want SVN, but you don't have this package, later on it will show an error message like: Unsupported version control system "svn".

Now to make a folder for Trac, where it will keep all the Trac projects and stuff.

{{< highlight bash >}}
sudo mkdir /var/trac /var/trac/sites /var/trac/eggs /var/trac/apache
sudo chown -R www-data /var/trac
{{< /highlight >}}

Under <code>/var/trac/sites</code> will be the files for Trac projects. The <code>/var/trac/eggs</code> folder will be used as a cache folder for Python eggs. <code>/var/trac/apache</code> will hold a wsgi script file.

The wsgi script is actually a Python script, but with the .wsgi extension, used by mod_wsgi. With this script, Trac will be able to run as a WSGI application.<br />
File: <code>/var/trac/apache/trac.wsgi</code>

{{< highlight bash >}}
import sys
sys.stdout = sys.stderr

import os
os.environ['TRAC_ENV_PARENT_DIR'] = '/var/trac/sites'
os.environ['PYTHON_EGG_CACHE'] = '/var/trac/eggs'

import trac.web.main

application = trac.web.main.dispatch_request
{{< /highlight >}}

With this kind of script, one single Trac installation will be able to manage multiple projects (you can see <a href="http://code.google.com/p/modwsgi/wiki/IntegrationWithTrac">here</a> some other scripts).

Configure Apache, add this to your <code>httpd.conf</code> file:

{{< highlight bash >}}
WSGIScriptAlias /trac /var/trac/apache/trac.wsgi

<Directory /var/trac/apache>
    WSGIApplicationGroup %{GLOBAL}
    Order deny,allow
    Allow from all
</Directory>
{{< /highlight >}}

Restart Apache:

{{< highlight bash >}}
sudo /etc/init.d/apache2 restart
{{< /highlight >}}

If you go to <a href="http://localhost/trac/">http://localhost/trac/</a> in your browser, you should see an empty list of Available Projects. It's empty, cause we haven't added any project yet.

Now, let's asume that we have a project called &#147;testProject&#148; with it's source located in <code>/var/www/testProject</code> and a SVN repo located in <code>/var/svn/repos/testProject</code>. I'll show how to add that project to Trac.

In console type:

{{< highlight bash >}}
sudo trac-admin /var/trac/sites/testProject initenv
{{< /highlight >}}

Note that you need to provide the full path to <code>/var/trac/sites</code>, cause it will create a Trac project in the current folder you're in.

It will ask you now a few things:

<ul>
<li>Project Name &#151; the name of the project, e.g. &#147;Trac testing project&#148;</li>
<li>Database connection string &#151; leave it empty, and it will use SQlite</li>
<li>Repository type &#151; leave it empty, and it will use SVN</li>
<li>Path to repository &#151; path to the project repo, e.g. <code>/var/svn/repos/testProject</code>
</ul>

It will start to print out a bunch of lines, about what is it doing. In the end you'll get a message like &#147;Project environment for 'testProject' created.&#148; and a few more lines. One more thing. We need to add the whole project to www-data user, so it can manage the files:

{{< highlight bash >}}
sudo chown -R www-data /var/trac/sites/testProject
{{< /highlight >}}

If you direct your browser again to <a href="http://localhost/trac/">http://localhost/trac/</a>, you will now see a link for the <code>testProject</code>. Click it. There, a fully working basic Trac environment for your project. A wiki, a ticket/bug tracking system, a repo browser in only a few minutes. How cool is that? Very.

This Trac environment can now be accessible by everyone. If we do not want that, we need to add this to the <code>httdp.conf</code> file:

{{< highlight bash >}}
<Location /trac>
    AuthType Basic
    AuthName "Trac login"
    AuthUserFile /var/trac/.htpasswd
    Require valid-user
</Location>
{{< /highlight >}}

Create the <code>.htpasswd</code> file:

{{< highlight bash >}}
sudo htpasswd -bcm /var/trac/.htpasswd your_username your_password
{{< /highlight >}}

All set. You'll now have to login to Trac to be able to work on it. As I'm the big boss on my localhost, I gave myself some super-power privileges for Trac: TRAC_ADMIN. It's like root on *NIX.

{{< highlight bash >}}
sudo trac-admin /var/trac/sites/testProject permission add robert TRAC_ADMIN
{{< /highlight >}}

Read more about <a href="http://trac.edgewall.org/wiki/TracPermissions">privileges</a>.

That would be it. With this kind of setup, for now, it's working perfectly for me. For Trac that's available from the whole Internet, more security measures are needed, but this is only on localhost, so this is enough for me.

Comments, thoughts, ideas? 

Happy hacking!
