+++
date = "2013-01-22T16:00:34+02:00"
title = "Gnucash 4.2 with SQLite3 on GNU/Linux"
slug = "gnucash-4-2-with-sqlite3-on-gnu-linux"
description = "Missing dependencies in 2013. Go figure."
tags = ["xml", "gnucash", "sqlite3"]
categories = ["Software", "Development"]
+++
<img src="http://i.imgur.com/EWJjCjD.png" style="float:right;padding:10px;" unselectable="on">

For a while I was trying to figure out how to convert the <a href="http://gnucash.org/">Gnucash</a>  XML file to an SQLite3 database. From version 4.2, Gnucash supports <a href="http://wiki.gnucash.org/wiki/FAQ#Q:_Is_the_Postgres_DB_.2F_SQL_backend_supported.3F">PostrgreSQL, MySQL and SQLite3.</a> Since then, the conversion is apparently simple as choosing File -> Save As ... and picking a different data format. Thing is, my Gnucash instance didn't have that! After some google-fu, turns out I was missing a library called <code>libdbi-dbd-sqlite</code>. After installing the missing library, suddenly the save works as it should. Why Gnucash didn't pull this dependency (even if it's optional) when I first installed it, is beyond me. But it's there now and I can be on my marry way to draw fancy graphs with all this easily accessible, sweet data.
