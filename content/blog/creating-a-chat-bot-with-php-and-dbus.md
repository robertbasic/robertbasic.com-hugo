+++
date = "2012-01-08T19:22:52+02:00"
title = "Creating a chat bot with PHP and Dbus"
slug = "creating-a-chat-bot-with-php-and-dbus"
description = "A simple chat bot script using DBus, PHP and Pidgin."
tags = ["bot", "dbus", "events", "php", "pidgin", "signals"]
categories = ["Development", "Programming"]
+++
<p>Now that we know how to <a href="http://robertbasic.com/blog/communicating-with-pidgin-from-php-via-d-bus/">use DBus to communicate with Pidgin from PHP</a> and how to <a href="http://robertbasic.com/blog/listening-to-dbus-signals-with-php/">listen to DBus signals</a>, it's time to put it all together by creating a simple chat bot! Nothing fancy, just a simple script that runs somewhere on some server and, by using a Pidgin account, can respond to some basic queries we send it.</p>
<h3>What did we get?</h3>
<p>As we want our script to receive messages from an other account, first we need to listen to the <code>ReceivedImMsg</code> event on the <code>im.pidgin.purple.PurpleInterface</code> interface. The data we get with that event is the ID of receiver's account, the sender of the message, the actual message and the conversation's ID (and some flags which we're not interested in):</p>
<pre name="code" class="php">
$interface = "im.pidgin.purple.PurpleInterface";
$method = "ReceivedImMsg";
if ($signal-&gt;matches($interface, $method)) {
    $data = $signal-&gt;getData()->getData();
    $receiver = $data[0];
    $sender = $data[1];
    $message = $data[2];
    $conversation = $data[3];
}
</pre>
<p>Of course, this is only for this one event, for data associated with other events see <a href="http://developer.pidgin.im/doxygen/dev/html/pages.html">Pidgin's manual</a>.</p>
<h3>Who's there?</h3>
<p>The event we are listening for will fire for any and all accounts, no matter who is the sender or the receiver of the message. We need to make sure that the receiving and the sending accounts are the correct ones, that the receiver is connected and that the receiver and the sender are contacts, "buddies":</p>
<pre name="code" class="php">
if ($receiver == 2034 && $proxy-&gt;PurpleAccountIsConnected($receiver)
    && $proxy-&gt;PurpleFindBuddy($receiver, $sender) == 3681) {
</pre>
<p>The numbers 2034 and 3681 are the account IDs for my accounts I used in this example; you'll need to figure out yours. </p>
<h3>Sending a response</h3>
<p>Now that we know who's talking to whom, we can act upon the received message, do something with it, create a response message and send it back! The data we got with the event, has the ID of the conversation between the two accounts. We create a new instant message for that conversation and send it on it's merry way with our clever response message:</p>
<pre name="code" class="php">
$im = $proxy-&gt;PurpleConvIm($conversation);
$proxy-&gt;PurpleConvImSend($im, $responseMessage);
</pre>
<p>As for what action the script can take upon a new message, is really up to the developer: it can do simple stuff like sending back the current uptime of the server or the current IP, running other tools like <a href="https://github.com/enygma/usher">usher</a> and sending that result back, or whatever is necessary.</p>
<h3>Daemonizing</h3>
<p>As this little bot is supposed to run on some server, the easiest way to run it as a "daemon" is to put the script in a background job via <a href="http://en.wikipedia.org/wiki/Nohup">nohup</a>:</p>
<pre name="code" class="php">
$ nohup php chat.php &
</pre>
<p>If needed, <a href="http://kevin.vanzonneveld.net/techblog/article/create_daemons_in_php/">creating daemons in PHP</a> can be done too.</p>
<p>And that's about all what's needed to create a chat bot. See a complete example <a href="https://github.com/robertbasic/blog-examples/blob/master/dbus/chat.php">here on Github</a>.</p>
<p>As for, is PHP the right tool for creating this kind of thing, I don't know, maybe, maybe not. What I do know, is that I had fun writing all this and I learned a lot along the way :)</p>
<p>Happy hackin'!</p>
