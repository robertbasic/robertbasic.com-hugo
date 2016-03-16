+++
date = "2011-08-04T08:19:25+02:00"
title = "Changing Jenkins' home directory on Ubuntu"
slug = "changing-jenkins-home-directory-on-ubuntu"
description = "Quick post how to change Jenkins' home directory in Ubuntu."
tags = ["hack", "jenkins", "ubuntu"]
categories = ["Development", "Software"]
+++
<p>I've started to play around with <a href="http://jenkins-ci.org/">Jenkins</a> yesterday and I kinda don't like that it's default home directory is /var/lib/jenkins so I changed it to /home/jenkins, so I'm throwing the steps needed out here for future reference.</p>
<p>First, stop jenkins:</p>
<pre name="code" class="bash">
robert@odin:~$ sudo /etc/init.d/jenkins stop
</pre>
<p>Create the new home directory and move existing stuff from the old home to the new one:</p>
<pre name="code" class="bash">
robert@odin:~$ sudo usermod -m -d /home/jenkins jenkins
</pre>
<p>Now, I didn't manage to set the ENV JENKINS_HOME to the new home, it was always using the old one, so I edited the init.d script:</p>
<pre name="code" class="bash">
robert@odin:~$ sudo vi /etc/init.d/jenkins
</pre>
<p>and in the "DAEMON_ARGS=..." line change JENKINS_HOME env to <code>--env=JENKINS_HOME=/home/jenkins</code>. In the end the whole line reads something like:</p>
<pre name="code" class="bash">
DAEMON_ARGS="--name=$NAME --inherit --env=JENKINS_HOME=/home/jenkins --output=$JENKINS_LOG --pidfile=$PIDFILE"
</pre>
<p>Update on September 20th: Vranac blogged about how to change the <a href="http://blog.code4hire.com/2011/09/changing-the-jenkins-home-directory-on-ubuntu-take-2/">JENKINS_HOME properly</a></p>
<p>Start jenkins</p>
<pre name="code" class="bash">
robert@odin:~$ sudo /etc/init.d/jenkins start
</pre>
<p>and go to <code>http://server:port/configure</code> and verify that jenkins works as before and is using the new home.</p>
<p>Happy hackin'!</p>
