+++
date = "2009-02-22T18:22:15+02:00"
title = "pywst - setting up web projects quickly"
slug = "pywst-setting-up-web-projects-quickly"
description = "pywst, a Python script for quickly setting up web projects on Ubuntu"
tags = ["apache", "lamp", "project", "python", "script", "setup", "svn", "trac", "ubuntu", "web"]
categories = ["Development", "Programming", "Software"]
+++
<p>I wrote a Python script for automating the steps required to setup a web project environment on my local dev machine that runs on Ubuntu. Called it pywst: <strong>Py</strong>thon, <strong>W</strong>eb, <strong>S</strong>vn, <strong>T</strong>rac. That's the best I could do, sorry :P</p>
<p>The main steps for setting up a new project are:</p>
<ul>
<li>Create a virtual host</li>
<li>Add it to /etc/hosts</li>
<li>Enable the virtual host</li>
<li>Import the new project to the SVN repository</li>
<li>Checkout the project to /var/www</li>
<li>Create a TRAC environment for the project</li>
<li>Restart Apache</li>
</ul>
<p>After these steps I have http://projectName.lh/ which points to /var/www/projectName/public/, SVN repo under http://localhost/repos/projectName/ and the TRAC environment under http://localhost/trac/projectName/.</p>
<p>As I have this ability to forget things, I always forget a step or 2 of this process. Thus, I wrote <a href="http://robertbasic.com/downloads/pywst.txt">pywst</a> (note, this is a txt file, to use it, save it to your HDD and rename it to pywst.py). It's not the best and nicest Python script ever wrote, but gets the job done. All that is need to be done to setup a project with pywst is:</p>
<pre name="code" class="php">
sudo ./pywst.py projectName
</pre>
<p>2 things are required: to run it with sudo powers and to provide a name for the project.</p>
<h2>Future improvements</h2>
<p>The first, and the most important is to finish the <code>rollback()</code> method. Now, it only exits pywst when an error occurs, but it should undo all the steps made prior to the error.</p>
<p>Second, to make it work on other distros, not only on Ubuntu. That would require for me getting those other distros, set them up, look where they store Apache and stuff, where's the default document root, etc. Hmm... This will take a while :)</p>
<p>Third, support PHP frameworks - Zend Framework, CodeIgniter and CakePHP &#151; ZF is a must :P Under support I mean to create the basic file structure for them automagically.</p>
<p>Cheers!</p>
