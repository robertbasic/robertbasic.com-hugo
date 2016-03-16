+++
date = "2011-12-25T16:47:11+02:00"
title = "Configuring 2 monitors with xrandr"
slug = "configuring-2-monitors-with-xrandr"
description = "Fix same image on both screens with xrandr."
tags = ["monitors", "x11", "xrandr"]
categories = ["Software"]
+++
My current, most used set up, includes a laptop and a second screen attached to it. The laptop is always to the left of the second monitor and together they give one big screen with a total resolution of 3046x1050. From time to time, X11 gets confused and shows the same image, with the same resolution, on both monitors.

The tool which can help fix this is <a href="http://www.x.org/wiki/Projects/XRandR">xrandr</a>.

First, query X11 to find out what monitors there are:

{{< highlight bash >}}
$ xrandr -q
{{< /highlight >}}

Once the monitor IDs are known, this fixes things for me:

{{< highlight bash >}}
$ xrandr --output VGA1 --auto --right-of LVDS1
{{< /highlight >}}

Where LVDS1 is the laptop's screen and VGA1 is the second screen.

Happy hackin'!
