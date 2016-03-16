+++
date = "2011-12-26T13:50:17+02:00"
title = "Listening to Dbus signals with PHP"
slug = "listening-to-dbus-signals-with-php"
description = ""
tags = ["dbus", "events", "listen", "php", "pidgin", "signals", "xmpp"]
categories = ["Development", "Programming"]
+++
<p>In my previous post I described (tried, at least) <a href="http://robertbasic.com/blog/communicating-with-pidgin-from-php-via-d-bus/">how to communicate with Pidgin from PHP</a>, by using the Dbus PHP extension.</p>
<p>The good part is that not can we only call different methods against Pidgin's libpurple API, we can also listen to different signals on different events, that are sent via Dbus. Some of the events that are signalled are when a chat message is recieved, a friend comes online, a file is sent, or any other from a list of some 110 different events.</p>
<p>The PHP Dbus extension allows us to watch for one exact signal on an interface, or for all signals on an interface. Of course, we can add watches on multiple interfaces at once.</p>
<h3>Watching for signals</h3>
<p>Once we know the interface and/or the specific signal we're interested in, we can add a watch on it. This is done by calling the <code>addWatch</code> method on the Dbus object, were the first parameter is the interface, and the second, <strong>optional</strong> parameter is the exact signal we want to listen to.</p>
<pre name="code" class="php">
&lt;?php

$dbus = new Dbus(Dbus::BUS_SESSION);

// watching for a specific signal
$dbus-&gt;addWatch("im.pidgin.purple.PurpleInterface", "ReceivedImMsg");
// or watching on an entire interface
// $dbus-&gt;addWatch("im.pidgin.purple.PurpleInterface");
// also can listen to different interfaces at the same time
$dbus-&gt;addWatch("org.freedesktop.Hal.Device");
</pre>
<p>Next, we need a way to actually get these signals when the events occur. For this we are using the <code>waitLoop</code> method of the Dbus class. That method accepts a number as a parameter, which is the number of miliseconds it should wait between requests. If an event happened on the interface we're watching, it will return the signal, which is a <code>DbusSignal</code>; otherwise we'll get a null:</p>
<pre name="code" class="php">

do {
    $signal = $dbus-&gt;waitLoop(1000);

    if ($signal instanceof DbusSignal) {
        // even if we watch only for one signal on one interface
        // we still can get rubbish, so making sure this is what we need
        if($signal-&gt;matches("im.pidgin.purple.PurpleInterface","ReceivedImMsg")){
            // data is in this weird DbusSet object thingy
            $data = $signal-&gt;getData()-&gt;getData();
            echo "Got stuff!\n";
        }
    }
} while (true);
</pre>
<p>Once we got the signal, to make sure that the signal is really the one we're interested in, we call the <code>matches</code> method on it. The first parameter is the interface and the second is the signal.</p>
<p>Each event has (can have? not sure yet) additional data associated with it. To get to it, for some odd reason, we need to call <code>getData()->getData()</code> on the signal; note that this is in case of listening on libpurple's interfaces, not sure about others. Experiment. Also, what kind of data is returned, again, depends on the interface and/or the event - some return arrays, some strings.</p>
<p>Have a look at the <a href="https://github.com/robertbasic/blog-examples/tree/master/dbus">Github repo</a> for some more examples (the dbus-signals* files).</p>
<p>In the third, and probably last post in this dbus mini-series, I'll try to build a bot with which I can communicate and issue out commands to.</p>
<p>Happy hackin'!</p>
