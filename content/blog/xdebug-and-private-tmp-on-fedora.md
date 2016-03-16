+++
date = "2014-12-16T12:10:18+02:00"
title = "Xdebug and private /tmp on Fedora"
slug = "xdebug-and-private-tmp-on-fedora"
description = "systemd PrivateTmp makes services have their own private temporary directories"
tags = ["xdebug", "php", "fedora", "systemd"]
categories = ["Development", "Software", "Programming"]
+++
<p>This one was a bit weird and needed some figuring out. Xdebug profiler output files were not being generated in the <code>/tmp</code> directory.<br>

</p>

<p>I wanted to do some profiling with <a href="http://xdebug.org">xdebug</a>. I set all the <a href="http://xdebug.org/docs/all_settings#profiler_enable_trigger">necessary configuration settings</a>  in my php.ini, restarted apache, confirmed xdebug is present and configured correctly with <code>php -i | grep xdebug</code>, appended <code>?XDEBUG_PROFILE=1</code> aaaand! Nothing. Nothing in <code>/tmp</code>, the default profiler output directory. Double checked paths, permissions, nope, nothing. No profiler files were generated.</p>

<p><code>find /tmp -name "cachegrind*"</code></p>

<p> listed the files in</p>

<p><code>/tmp/systemd-httpd.service-X9iE20R/tmp/</code></p>

<p>What the?</p>

<p>Apparently systemd services in Fedora can have this setting called <b>PrivateTmp</b> and services with this setting set to true are started with a private /tmp directory. Something something security.</p>

<p>Well then. I created a <code>/var/log/xdebug</code> directory, changed the owner to apache and set the <code>xdebug.profiler_output_dir</code> to that new directory and all is well again.</p>

<p>Hey, I learned something new today.<br>

</p>
