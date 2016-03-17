+++
date = "2012-01-30T13:13:22+02:00"
title = "Xdebug is full of awesome"
slug = "xdebug-is-full-of-awesome"
description = "Xdebug is full of awesome."
tags = ["debugging", "xdebug"]
categories = ["Development", "Programming"]
2012 = ["01"]
+++
<img alt="" src="http://lh6.googleusercontent.com/-T6KPtpQIrCA/TyaW4TSDKvI/AAAAAAAAAss/dGguCKJ4ONs/s400/400x200.png" title="debugging eval&#039;d code with xdebug" class="alignright" width="400" height="220" style='float:right' />

I'm currently trying to fix <a href="https://github.com/padraic/mockery/issues/33">a Mockery bug</a> and, while deep in the code, I came across a piece of code which gets eval'd. Mainly to understand better what's going on, I wanted to step debug it. I first set a breakpoint before the eval call and then tried to step into the eval'd code, but that didn't work out, Netbeans just moves along to the next line.

What *did* work, is setting a <code>xdebug_break()</code> call inside of the code that will be eval'd - and BAM! it works! Netbeans picks up the signal and everything works just as with regular code - you can view the values of the variables, step in, step out and step over code.

Xdebug is full of awesome.

Happy hackin'!
