+++
date = "2010-11-06T21:42:58+02:00"
title = "ape is a PHP editor"
slug = "ape-is-a-php-editor"
description = "ape - ape is a PHP editor"
tags = ["ape", "editor", "ide", "php", "pyqt", "python"]
categories = ["Development", "Programming"]
+++
A week ago I started working on a simple editor/<a title="Integrated development environment" rel="wikipedia" href="http://en.wikipedia.org/wiki/Integrated_development_environment">IDE</a> for <a title="PHP" rel="homepage" href="http://www.php.net/">PHP</a> called ape. That's my weak try on creating a <a title="Backronym" rel="wikipedia" href="http://en.wikipedia.org/wiki/Backronym">reverse acronym</a> as ape stands for - <strong>a</strong>pe is a <strong>P</strong>HP <strong>e</strong>ditor. This is kind of an introductory post into the whole developing process of it, as my intention is to blog about it a bit more :)

<h3>Why?</h3>

First, to answer the question everyone is giving me when I mention I'm writing ape:<br />
<em>"Why the hell do you do that (to yourself)?"</em>

Programming is fun. Programming is interesting. Programming makes me learn new things. I like having fun and I do this to learn more about programming and having even more fun. I'm writing web applications each and every day, so writing a desktop app requires a different way of thinking and leaving my "comfort zone" (altho, I'm quite comfortable in front of the keyboard hackin' away code). ape is written in python and pyqt, but again, it's not about the language used, for me <strong>it is about programming</strong>.

<h3>The idea</h3>

<a title="NetBeans" rel="homepage" href="http://www.netbeans.org/">Netbeans</a> is my main IDE for quite some time now and I love it. I know my way around vim, too. But, netbeans has too many features for my taste - I use <a title="Apache Subversion" rel="homepage" href="http://subversion.apache.org/">SVN</a>, git, (on rare occasions I write them) run unit tests from the console. As for vim, maybe I just don't get it enough, but I feel less productive with it. Debugging PHP apps ends up var_dump-ing things all over the place. So, basically what I want/need from an editor is grouping files into projects, regex search/replace, code coloring &amp; completion and, of course, file editing.

I plan to write a feature a day. On my personal projects I usually want to push out as much code as I can during one day as I'm highly motivated, but this time want to try a different approach. So far I didn't got far, figured out syntax highlighting, opening files from a file browser widget thingy and things like that, but more on that in other posts.

If anyone wants to take a look, the source code is up on <a href="https://github.com/robertbasic/ape">github</a>. It is licensed under GNU <a title="GNU General Public License" rel="wikipedia" href="http://en.wikipedia.org/wiki/GNU_General_Public_License">GPL v2</a>, as pyqt is licensed under it and I don't want to waste my time on figuring out could I use MIT or some other license.

Happy hackin'!
