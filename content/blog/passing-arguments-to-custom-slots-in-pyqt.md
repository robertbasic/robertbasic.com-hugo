+++
date = "2010-11-30T21:52:06+02:00"
title = "Passing arguments to custom slots in PyQt"
slug = "passing-arguments-to-custom-slots-in-pyqt"
description = "Passing programmatically arguments to custom defined slots in PyQt"
tags = ["ape", "lambda", "pyqt", "python", "signals", "slots"]
categories = ["Programming"]
+++
<p>While hacking on ape, I came to a situation where I need to pass some arguments to a custom defined slot. The slot is being called from different signals, one where the argument is passed by PyQt itself and a second one where I need to programmatically pass the argument to the slot.</p>
<p>First I tried with something like:</p>
<pre class="python" name="code">
action = QAction("My action", parent)
action.triggered.connect(my_slot(my_argument))
</pre>
<p>which ended in an error: <em>TypeError: connect() slot argument should be a callable or a signal, not 'NoneType'</em></p>
<p>After a bit of poking around I passed a lambda function to the connect() method:</p>
<pre class="python" name="code">
action = QAction("My action", parent)
action.triggered.connect(lambda arg=my_argument: my_slot(arg))
</pre>
<p>Works like a charm.</p>
<p>Also this is my first try to use github gists as a way to embed/highlight code. Hope it'll work out.</p>
<p>Happy hackin'!</p>