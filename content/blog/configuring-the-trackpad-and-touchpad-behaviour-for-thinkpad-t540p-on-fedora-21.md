+++
date = "2014-12-22T09:26:39+02:00"
title = "Configuring the trackpad and touchpad behaviour for Thinkpad T540p on Fedora 21"
slug = "configuring-the-trackpad-and-touchpad-behaviour-for-thinkpad-t540p-on-fedora-21"
description = "Turning off touchpad movements on Thinkpad T540p"
tags = ["t540p", "thinkpad", "laptop", "fedora", "touchpad", "clickpad", "trackpad"]
categories = ["Blablabla", "Software"]
+++
<p>This is the last post about the Thinkpad and Fedora. At least for a while. Promise.</p>

<p>With the new generation of Thinkpads, Lenovo decided to change the touchpad. They removed the 5 physical buttons from the touchpad area and left us with one bigger touchpad. To click anything it's now either touch click (two-finger click for right clicks) or one can push the entire touchpad down, the clickpad. The touchpad has different regions for getting left/middle/right clicks. Sort of.<br>

</p>

<p> And for the first time I completely agree with reviews on the internet. <b>This thing is horrible.</b></p>

<p>
If you want both the touch and push clicks, forget it. It just won't be usable how inaccurate this thing is. If the touch click is turned on, it will get in the way of your typing. You forget yourself and do a push click with the touch click enabled? Here's some double/triple click for you. Just don't even bother with the touch click, turn it off.
</p>

<p>
You're left now with the trackpad and touchpad for movement, and the clickpad for clicks. Again, pain. You push down the touchpad to click aaand... Good luck and I hope you clicked the thing you wanted. Your finger <b>will</b> move, just a little bit and so will the cursor. And here's the kicker. Touchpad movements can't be turned off. At least not in a easy and intuitive way.
</p>

<p>
After quite some time searching the internet for a fix, I found a forum post explaining how to get this thing usable (sadly, I can't find that post again to link to it):
</p>


<pre name="code" class="bash">Section "InputClass"
    Identifier "TrackPad with buttons only"
    MatchDriver "synaptics"
    Option "SoftButtonAreas" "65% 0 0 0 50% 65% 0 0" # emulate right and middle buttons
    Option "AreaBottomEdge" "1" # disable moving but not buttons
EndSection
</pre>

<p>
Save this as <code>99-thinkpad-clickpad.conf</code> in <code>/etc/X11/xorg.conf.d/</code>. The touch parts of the touchpad are disabled so we have the trackpad for movements and the clickpad for buttons. I just need to tweak the left/middle/right button clicks a bit more, because there are times when I accidentally do a middle click.
</p>

<p>
Oh, and now there's no mouse scroll because that's touchpad only.
</p>
