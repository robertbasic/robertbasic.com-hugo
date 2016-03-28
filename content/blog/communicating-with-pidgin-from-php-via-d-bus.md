+++
date = "2011-12-18T21:10:43+02:00"
title = "Communicating with Pidgin from PHP via D-Bus"
slug = "communicating-with-pidgin-from-php-via-d-bus"
description = "Playing around with D-Bus from PHP"
tags = ["communication", "dbus", "pecl", "php", "pidgin", "xmpp"]
categories = ["Development", "Programming"]
2011 = ["12"]
+++
Earlier this week I got an idea of trying to communicate with <a href="http://pidgin.im/">Pidgin</a>, a chat client, via the terminal. Sounded like a fun thing to hack on, plus, could be made useful (in my head, at least), for things like logging from a web application directly to IM, or, heck, even creating something like <a href="https://github.com/github/hubot">Github's Hubot</a>, commanding a server or an application just via chat. Surely I wasn't the first one to come up with this idea and after a bit of a googling found out that Pidgin's libpurple has a nice API for that, <a href="http://developer.pidgin.im/wiki/DbusHowto">exposed via D-Bus</a>.

I first planned to write some scripts for this in Python or C, but when I finally sat down over the weekend to hack on this, realized there is a <a href="http://pecl.php.net/package/DBus">PHP D-Bus extension</a>, thanks to <a href="http://derickrethans.nl/">Derick Rethans</a>! As I rarely have the opportunity/need to play with more "obscure" PHP extensions, decided to give this one a spin... (Note: apart from that D-Bus is used for processes communicating with each other, I have zero knowledge about it, so I might be wrong with some things down below.)

<h3>Installing D-Bus for PHP</h3>

As the extension requires the <code>dbus-devel</code> package, first make sure it is installed:

``` bash
$ yum install dbus-devel
```

The installation of the extension itself is pretty easy:

``` bash
$ pecl install dbus-beta
```

Add the <code>extension=dbus.so</code> line to your php.ini, restart Apache if needed and have a look at the <code>phpinfo();</code>, there should be an entry for D-Bus listed.

Note that there is no documentation for this extension at the moment, but, luckily, the sources include an <a href="http://svn.php.net/viewvc/pecl/dbus/trunk/examples/">examples directory</a> full of goodies! After fiddling around with those for an hour or so, got the basics of the extension figured out.

One thing I haven't figured out completely, is how to run scripts which use the Dbus extension via the browser, as in those cases the scripts are dying with a terrible X11 error message. So, run Dbus scripts from the console and all should be fine. 

<h3>The a-ha! moment</h3>

What I learned by looking at the examples, is that the Dbus class is used for creating a proxy, which can be used to call methods on the service/application we're interested in. But, what methods are available, what arguments do those methods accept (if any), and what will they return as a result?

This can easily be found out by <strong>introspection</strong>. Create a proxy to an object which implements the <code>Introspectable</code> interface and call the <code>Introspect</code> method on that proxy:

``` php
<?php

$dbus = new Dbus;

$proxy = $dbus->createProxy("im.pidgin.purple.PurpleService",
                            "/im/pidgin/purple/PurpleObject",
                            "org.freedesktop.DBus.Introspectable");

$data = $proxy->Introspect();

file_put_contents('introspect.xml', $data);
```

As the result of the introspection is returned in an XML and can be quite big, putting it in a file for easier viewing.

By looking at the XML file, it's pretty easy to figure out what's going on; method names, method arguments, their names and types, and the returned result:

``` xml
<method name="PurpleAccountGetUsername">
  <arg name="account" type="i" direction="in"></arg>
  <arg name="RESULT" type="s" direction="out"></arg>
</method>
```

With all this information at our disposal, it's easy to write a script which does something useful, like, listing all the connected accounts and the protocols they are using:

``` php
<?php

$dbus = new Dbus;

$proxy = $dbus->createProxy("im.pidgin.purple.PurpleService",
                            "/im/pidgin/purple/PurpleObject",
                            "im.pidgin.purple.PurpleInterface");

$accounts = $proxy->PurpleAccountsGetAllActive();

foreach ($accounts->getData() as $account) {
    if ($proxy->PurpleAccountIsConnected($account)) {
        $username = $proxy->PurpleAccountGetUsername($account);
        $protocolId = $proxy->PurpleAccountGetProtocolId($account);
        $protocolName = $proxy->PurpleAccountGetProtocolName($account);
        echo $username . " is connected on the " . $protocolName
                       . " (" . $protocolId . ") protocol.\n";
    }
}
```

A sample output would be something like: "robertbasic@irc.freenode.net is connected on the IRC (prpl-irc) protocol."

<h3>Next steps</h3>

Of course, this is far from a chat bot which can execute commands on a remote server, but at least we have some foundation to build on. In the coming days I'll try to figure out how to create a loop which can be used to listen to different purple events - when a contact comes online, a chat is sent, or received, etc.

Also, it is quite fun trying to figure out a PHP extension just by looking at examples and the C source itself. One can learn a lot this way.

Happy hackin'!

P.S.: Code samples are up on <a href="https://github.com/robertbasic/blog-examples/tree/master/dbus">Github</a>!

Update 2011-12-26: the 2nd post, <a href="http://robertbasic.com/blog/listening-to-dbus-signals-with-php/">listening to dbus signals with php</a>, is published!
