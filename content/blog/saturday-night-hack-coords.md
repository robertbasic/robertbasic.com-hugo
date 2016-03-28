+++
date = "2013-03-24T18:31:41+02:00"
title = "Saturday night hack - coords"
slug = "saturday-night-hack-coords"
description = "A quick hack in pygtk I've done in one night."
tags = ["hack", "python", "pygtk", "byzanz"]
categories = ["Development", "Programming", "Software"]
2013 = ["03"]
+++
When I was just starting out learning programming, everything was so simple. I did not care about design patterns and best practices and unit tests and how will users use that piece of code. Hell, I did not even know those things exist. I was having fun, I was learning, I was free to do whatever I wanted to do, I was playing, I was like a child. Not that there is something wrong caring about those things now, but then I was able to put out a piece of code that was fixing a core of one problem I had and that was it. Once I was done with that, I would move on to the next problem. For a long time now I was missing that feeling of not caring, just fix the damn problem and move on. Just to slap together some crappy piece of code, use it once or twice and then forget about it.

And that was exactly what I did last night. I sat down and in some five or six hours I put together <a href="https://github.com/robertbasic/coords">coords</a>. It is an ugly as hell little pygtk application, void of any good practices, no tests, just a few comments here and there and that's it. And I had fun writing it! I completely lost track of time while hacking, got into the zone and today, after some six hours of sleep I woke up feeling like I was on a vacation for a week.

<img unselectable="on" style="float:right;padding:10px;" src="/img/posts/coords.gif">

The application itself doesn't do much, it helps determine coordinates on your desktop. Start the application, click "track", drag the mouse from the top-left corner you're interested in to the bottom-left one and that's it. The entire functionality is shown in this ten second long gif that runs somewhere here on the page. The best part is that it actually solves a problem I had, it helps me determine coordinates on my desktop and then I can use those coordinates for <a href="https://git.gnome.org/browse/byzanz/">byzanz-record</a>. I loved every second I spent hacking on this.

Best part is that even this little application had a quite an interesting challenge to solve, namely, to determine the position of the mouse anywhere on the screen. It's no big deal to determine the position of the mouse inside your application, but once you want to break out of it, well, it gets bit tricky.

With pygtk one can only subscribe to events that happen inside the application itself. To go lower than that one needs to use a different library, something like xlib (python-xlib from python). After much poking around I found a way to do it from pygtk itself. It is possible to get hold of the root window instance, which is created by the X server itself (you can't create a root window from an application, or make an application be a root window, afaik). Once you have the root window, grab the pointer, and then filter events you are interested in on the root window before they get sent from the X server to gtk. Or at least that is how I understood this whole process. While having control over the pointer, get the mouse coordinates from the time left button is pressed till the time it is released. Don't forget to ungrab/release the pointer once your done. And that's all there is to it, more or less.

The interesting parts are:

``` python
def start_tracking(self, widget, data=None):
    mask = gtk.gdk.POINTER_MOTION_MASK | gtk.gdk.BUTTON_PRESS_MASK | gtk.gdk.BUTTON_RELEASE_MASK
    self.root_window = gtk.gdk.get_default_root_window()
    gtk.gdk.pointer_grab(self.root_window, False, mask)
    self.root_window.add_filter(self.track_region, self.region)
def track_region(self, event, region):
    x, y, flags = event.window.get_pointer()
    if 'GDK_BUTTON1_MASK' in flags.value_names \
            and region.track_started == False:
        region.start_x = x
        region.start_y = y
        region.track_started = True
        region.track_ended = False
    if 'GDK_BUTTON1_MASK' not in flags.value_names \
            and region.track_started == True:
        region.end_x = x
        region.end_y = y
        region.track_ended = True
        region.track_started = False
        # ungrab the pointer so we get control back
        gtk.gdk.pointer_ungrab()
        self.show_region_values(region)
    return gtk.gdk.FILTER_CONTINUE
```

Isn't it ugly? Very. But it works and it solves the problem I had. Btw you can check out the <a href="https://github.com/robertbasic/coords/blob/master/coords.py">code on github</a> to have a bit more context for all this.

Happy hackin'!
