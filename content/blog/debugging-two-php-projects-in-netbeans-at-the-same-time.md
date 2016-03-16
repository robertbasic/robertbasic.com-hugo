+++
date = "2011-08-19T08:48:54+02:00"
title = "Debugging two PHP projects in Netbeans at the same time"
slug = "debugging-two-php-projects-in-netbeans-at-the-same-time"
description = "A quick tip how to debug two projects at the same time with netbeans and xdebug."
tags = ["debugging", "netbeans", "xdebug", "xdebug_break"]
categories = ["Development", "Programming", "Software"]
+++
<p>I'm currently working on some Symfony2 bundles and I have one Netbeans project for the main Symfony2 app and one project for the bundle. The bundle files are completely separated from the app and they are just linked (<code>ln -s</code>) together. It works great, except for the case when I need to debug some part of the bundle's code with Netbeans + xdebug. The debugger starts for the "main" project, which is the Symfony2 app, but setting breakpoints with Netbeans (y'know, by clicking the line number) for the bundle doesn't really work, as those are in the other project and not in the debugged one, rendering the whole debugging useless.</p>
<p><a href="https://lh6.googleusercontent.com/-KhpIuTwjVCI/Tk4h6npl_jI/AAAAAAAAAq0/oFw9naQjc8w/s144/Screenshot.png"><img alt="" src="https://lh6.googleusercontent.com/-KhpIuTwjVCI/Tk4h6npl_jI/AAAAAAAAAq0/oFw9naQjc8w/s400/Screenshot.png" title="xdebug_break at work" class="alignright" width="400" height="70" /></a></p>
<p>The solution is pretty easy actually: instead of setting breakpoints with Netbeans, use <code>xdebug_break()</code> where you want the break to happen and it will happily be caught by the IDE. After the break happened use the "Step into" (F7) functionality to see what's going on.</p>
