+++
date = "2010-02-04T21:39:58+02:00"
title = "Toggler"
slug = "toggler"
description = "toggler, a jQuery plugin for togglering elements around..."
tags = ["jquery", "plugin", "toggler"]
categories = ["Development", "Programming"]
+++
At the office we're starting out on a new project, which will require (thanks to our designer) a lot off divs and images and whatnot to slide up and down. All these elements will of course have it's own ID's and classes, so writing one function to slide/toggle them all is impossible, plus the design of these elements is so weird that the built-in animation effects are of no use. So I hacked together my first! jQuery plugin which will hopefully help us with this task.

As I was more inspired to write code, than to come up with names, I called this little fella <a href="http://robertbasic.com/toggler/">toggler</a>, a jQuery plugin for togglering elements around...

What it does is actually calling <code>.animate()</code> on <del>the height</del> the top of the element that is to be togglered.

Setting it up is easy: include the <code>jquery-toggler.js</code> script, call the <code>toggler()</code> function on any clickable element and set the <code>rel</code> attribute of that element to match the ID of the element which is to be togglered (clearly, if you look in the source of the example, you'll understand that better than my jibberish).

The default <del>height</del> when the element is closed (togglered up) is 0px, when the element is open (togglered down) is 200px and the default speed of this magical animation is set to 1000 (1 second). You can of course change these by passing them to the <code>toggler({speed:500})</code> function.

toggler is available at GitHub: <a href="http://github.com/robertbasic/toggler">http://github.com/robertbasic/toggler</a>

Example is here: <a href="http://robertbasic.com/toggler/">http://robertbasic.com/toggler/</a>

toggler yourself out.

<strong>Edit Februray 6th:</strong> Apparently I completely misunderstood the designer what kind of effect he wants, thus now I changed the code. The new code is pushed to github and the example is updated.
