+++
date = "2009-12-21T21:21:30+02:00"
title = "Bad Firebug!"
slug = "bad-firebug"
description = "Some ranting on how Firebug can be used to do bad stuff to a web application."
tags = ["escaping", "example", "filter", "firebug", "php", "security"]
categories = ["Development", "Programming", "Software"]
2009 = ["12"]
+++
We all know about <a href="http://www.getfirebug.com/" title="Firebug" rel="homepage">Firebug</a>, probably the best developer add-on out there, and how awesome it is and how many times it helped us debug some nasty Javascript code, mess around with CSS and HTML on-the-fly, to track the time load of every external page element our app loads... It's so cool that it even has it's own add-ons! (<a href="http://www.firephp.org/" title="FirePHP" rel="homepage">FirePHP</a>, <a href="http://developer.yahoo.com/yslow/" title="YSlow" rel="homepage">YSlow</a> and FireCookie). Really, it helps our developer lives to suck a bit less.

<strong>Note: the following text is not about bashing other developers and their works, but to highlight the importance of proper input filtering. I myself have failed on this, several times.</strong>

 Let's go back to the part where we mess with the HTML by the means of this, may I say, application. You can add, hide, remove HTML elements, add, alter, remove, attributes from HTML elements... Adding, hiding, deleting - boring; altering - fun! I have this urge to try to break every form on every website I find. Not to do any harm, just to take a look how my fellow developer did his job and if I see anything that's not right, I try to contact him to fix that, cause, y'know, I'm a nice person... Anyhow, I recently found some sites where all the textfields and textareas were filtered properly and no harm could be done - all my "hack" attempts were caught by their application. Nice. Oh, look, a select box! Right-click, inspect element, value="xyz", change that to value="abc", submit the form... and poof! A sexy SQL error. All that with the help of our li'l friend, Firebug. The elements where the user is required to provide some information "by hand" were processed correctly, but the select box was not.

OK, let's take this one step further. On a site where the user can register an account and afterwards can edit his or hers profile. I register, go to the user panel, the usual stuff - change email, password, location, DoB (Date of Birth)... A quick inspection of the source - a hidden field "id" with a number in it. Hmm... Quickly, I register another account, note the "id" on that second account, go back to the first account, change the "id" of the first account to the "id" of the second account, change the DoB (just to see any actual information changing), click submit... "Your profile has been updated successfully." Mine? Not really, the DoB is like it was in the first place... Go to the second account... Oh boy. I successfully changed the DoB of the second account, with my first account. Now, I haven't seen their source code, but I can imagine what was going on. Something like this:

``` php
<?php
$id = (int)$_POST['id'];
$dob = $_POST['dob'];

$sql = "UPDATE users SET dob = '" . $dob . "' WHERE id = " . $id;
```

On the positive side, when I entered letters in that hidden field, I was told by the app that I haven't filled all the fields correctly, which means they filtered even the hidden field, but skipped to check if that "id" is actually me.

OK, I know, the title is "Bad Firebug!" and the problems are actually about filtering user input, but I needed a catchy title to have your attention on Twitter :P

Even tho a field seems "unchangeable", with a help of an awesome little app, it becomes changeable. And dangerous.

Filter input, escape output :)

P.S.: On the image above you can see my profile on a bulletin board, where I changed my year of birth from 1986 to 986 with Firebug. The years are in a select box; the lowest value is 1910. You can see my actual profile <a href="http://www.dizajnzona.com/forums/index.php?s=&amp;setlanguage=1&amp;langid=en&amp;showuser=12706&amp;cal_id=0">here</a>.
