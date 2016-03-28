+++
date = "2010-11-05T12:21:56+02:00"
title = "Backup script for mysql"
slug = "backup-script-for-mysql"
description = "A bash script that backups a database, gzipit and deletes all backups older than 3 days."
tags = ["backup", "mysql", "script", "shell"]
categories = ["Development"]
2010 = ["11"]
+++
This post is more of a reminder for myself. Anywayz, a little bash script that backups a database, gzipit and deletes all backups older than 3 days.

``` bash
#!/bin/bash

DBUSER="user"
DBPASS="pass"
DBDB="dbname"
NOW=$(date +"%Y-%m-%d-%H-%M-%S")
BACKUPROOTDIR="/tmp"
BACKUPSQL="$BACKUPROOTDIR/mysqlbackup-$NOW.sql"
BACKUPGZIP="$BACKUPSQL.gz"

mysqldump -u$DBUSER -p$DBPASS $DBDB > "$BACKUPSQL"
gzip -c $BACKUPSQL > $BACKUPGZIP
rm $BACKUPSQL
find $BACKUPROOTDIR -type f -name "mysqlbackup\*" -mtime +3 | xargs rm
```

Kudos to <a href="http://twitter.com/zsteva">@zsteva</a> for looking at it to spot any errors I might have made.
