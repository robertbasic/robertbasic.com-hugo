+++
date = "2010-11-09T17:53:35+02:00"
title = "Connecting signals and slots with PyQt - the new style"
slug = "connecting-signals-and-slots-with-pyqt-the-new-style"
description = "A short story on my troubles with connecting signals and slots with pyqt."
tags = ["ape", "pyqt", "python", "signals", "slots"]
categories = ["Development", "Programming"]
+++
<p>While working on ape I had a problem with figuring out how to properly connect a signal to a slot, where the signal is emitted by a QTreeView widget. As this is not my first app with python and pyqt, I was doing something like (this is, btw, the "old style"):</p>
<pre class="python" name="code">
self.connect(widget, SIGNAL("emitted_signal()"), self.my_slot)
</pre>
<p>but it simply didn't work. Nothing happened. I was trying all different of connect/signal/slot combinations but everything was just dead silent. Google gave only pretty much old posts talking about QT3. Then I figured that, because the QTreeView is "sitting" inside a QDockWidget, maybe that dock widget thingy is somehow intercepting/taking over the signals. Nope. Wth? Wtf is going on? Current pyqt version is (on my machine) 4.6. Last time I used pyqt it was something like 4.2 or 4.3. Something must've been changed in the mean time. Off to the pyqt docs I go (btw, I use the official QT docs, the C++ version, there isn't really a big difference from pyqt): PyQt reference, chapter 7 - <a href="http://www.riverbankcomputing.co.uk/static/Docs/PyQt4/pyqt4ref.html#new-style-signal-and-slot-support">"New-style Signal and Slot Support"</a>. A-ha! They changed it! Here is an example of the "new style":</p>
<pre class="python" name="code">
widget.emmited_signal.connect(self.my_slot)
</pre>
<p>Oh my, isn't that just beautiful?! Much more readable and simpler, for me at least. And it works! Yay! The QTreeView signals are happily connected to slots, thus, I'm happy too.</p>
<p>A few paragraphs later, turns out that the "old style" isn't thrown out, it should still work. Why it didn't work for me escapes me at the moment, but honestly, I don't really care as long as the new style is working.</p>
<p>Happy hackin'!</p>
<p>P.S.: The syntax highlighter is a bit out dated thus breaking python code. Will fix it. Some day.</p>
