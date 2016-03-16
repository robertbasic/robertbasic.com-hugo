+++
date = "2010-04-27T19:45:48+02:00"
title = "Quick Netbeans tip - task filters"
slug = "quick-netbeans-tip-task-filters"
description = "A quick tip to make the \"Tasks\" window in Netbeans more usable."
tags = ["filters", "ide", "netbeans", "tasks", "tip"]
categories = ["Development", "Software"]
+++
<p>I'm using Netbeans as my main IDE for PHP and Python projects for over a year now, yet only now I have stumbled upon this feature - creating filters for tasks that show up in the "Tasks" window (Ctrl+6 shortcut to show/hide the window).</p>
<div id="attachment_899" class="wp-caption alignright" style="width: 300"><a href="http://robertbasic.com/blog/wp-content/uploads/2010/04/screenshot-phpplaneta-netbeans-ide-68.png"><img src="http://robertbasic.com/blog/wp-content/uploads/2010/04/screenshot-phpplaneta-netbeans-ide-68-300x192.png" alt="Task filters" title="screenshot-phpplaneta-netbeans-ide-68" width="300" height="192" class="size-medium wp-image-899" /></a><p class="wp-caption-text">Task filters</p></div>
<div id="attachment_900" class="wp-caption alignright" style="width: 300"><a href="http://robertbasic.com/blog/wp-content/uploads/2010/04/screenshot-task-list-filter.png"><img src="http://robertbasic.com/blog/wp-content/uploads/2010/04/screenshot-task-list-filter-300x127.png" alt="Setting rules for the filter" title="screenshot-task-list-filter" width="300" height="127" class="size-medium wp-image-900" /></a><p class="wp-caption-text">Setting rules for the filter</p></div>
<p>To be honest, I wasn't even using it (until now), cause, by default it shows all the todo-s and issues from all the files from the current project. This can produce a pretty big list if (like me) you have Zend Framework, Pear and other frameworks and libraries set on the include path for the project you're working in, as the little <code>@todo</code>-s will show up from those files, too.</p>
<p>Filters to the rescue. On the "Tasks" window there's that little icon of that whatever-it's-called showed on the first image, where you can create and edit filters. I've created a simple one, which excludes todo-s from files that have "Zend" in their location and includes only from PHP files (second image).</p>
<p>Me likes this feature.</p>
