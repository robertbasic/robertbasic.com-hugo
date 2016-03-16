+++
date = "2010-04-27T19:45:48+02:00"
title = "Quick Netbeans tip - task filters"
slug = "quick-netbeans-tip-task-filters"
description = "A quick tip to make the \"Tasks\" window in Netbeans more usable."
tags = ["filters", "ide", "netbeans", "tasks", "tip"]
categories = ["Development", "Software"]
+++
I'm using Netbeans as my main IDE for PHP and Python projects for over a year now, yet only now I have stumbled upon this feature - creating filters for tasks that show up in the "Tasks" window (Ctrl+6 shortcut to show/hide the window).

To be honest, I wasn't even using it (until now), cause, by default it shows all the todo-s and issues from all the files from the current project. This can produce a pretty big list if (like me) you have Zend Framework, Pear and other frameworks and libraries set on the include path for the project you're working in, as the little <code>@todo</code>-s will show up from those files, too.

Filters to the rescue. On the "Tasks" window there's that little icon of that whatever-it's-called showed on the first image, where you can create and edit filters. I've created a simple one, which excludes todo-s from files that have "Zend" in their location and includes only from PHP files (second image).

Me likes this feature.
