+++
date = "2012-02-13T21:58:16+02:00"
title = "Automatically upload screenshots in XFCE4"
slug = "automatically-upload-screenshots-in-xfce4"
description = "A short script to automatically upload XFCE4 screenshots to a remote server"
tags = ["bash", "script", "xfce4", "xfce4-screenshooter"]
categories = ["Development", "Programming", "Software"]
2012 = ["02"]
+++
XFCE4 has a nice little tool for making screenshots - xfce4-screenshooter. My only gripe with it is that it can't automatically upload the images to a server and give me the URL to the image (to be honest, it can, but it uploads the images to a shady looking website, and I don't like that). And then one day I saw <a href="https://github.com/EvanDotPro/GtkGrab" target="_self">Evan Coury's GtkGrab</a> - a set of scripts which does exactly what I want! But, sadly, that's for Gnome. So, based on Evan's work, I put together <a href="https://gist.github.com/1748455" target="_self">this little script</a>:


{{< highlight bash >}}
#!/bin/bash
# based on GtkGrab by @EvanDotPro https://github.com/EvanDotPro/GtkGrab
function rename_file()
{
    NEWFILE=$(echo $1 | md5sum | cut -c-5)'.png'
}
REMOTE=user@domain.tld:/home/user/screens/
DOMAIN=http://i.domain.tld/
LOCALPATH=/home/user/Pictures/screenshots/
xfce4-screenshooter -r --save=$LOCALPATH
LOCALFILE=$(ls -tr $LOCALPATH | tail -n 1)
rename_file $LOCALFILE
I=0
LIMIT=10
while [ &quot;$I&quot; -lt &quot;$LIMIT&quot; -a -f &quot;$LOCALPATH$NEWFILE&quot; ]
do
    rename_file $NEWFILE
    I=`expr $I + 1`
done
mv &quot;$LOCALPATH$LOCALFILE&quot; &quot;$LOCALPATH$NEWFILE&quot;
scp &quot;$LOCALPATH$NEWFILE&quot; &quot;$REMOTE$NEWFILE&quot;
echo &quot;$DOMAIN$NEWFILE&quot; | xclip -selection clipboard
notify-send &quot;Screenshot uploaded, URL in clipboard&quot;
{{< /highlight >}}

Save this script somewhere on your computer, configure the DOMAIN, LOCALPATH and REMOTE variables, set the script to be executable and then create a shortcut combination for it via Settings -&gt; Keyboard -&gt; Application Shortcuts. Programs you'll need to have installed for this to work are xfce4-screenshooter, xclip and notify-send. If you don't want to be prompted for the password/passphrase for the scp command each time, set up a passwordless login for your user on your remote server.

Happy hackin'!
