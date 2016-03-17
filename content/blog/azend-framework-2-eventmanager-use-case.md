+++
date = "2011-10-19T22:31:31+02:00"
title = "A Zend Framework 2 EventManager use case"
slug = "azend-framework-2-eventmanager-use-case"
description = "A use case for Zend Framework 2 Event Manager."
tags = ["eventmanager", "events", "listeners", "zend framework", "zf2"]
categories = ["Development", "Programming"]
2011 = ["10"]
+++
With <a href="http://framework.zend.com/zf2/blog/entry/Zend-Framework-2-0-0beta1-Released">Zend Framework 2 beta 1</a> released yesterday and some free time to spare, I decided to finally try and tackle one of the "scariest" additions to the Zend Framework - the EventManager component. Now, I won't go into details about this whole event voodoo, Matthew <a href="http://weierophinney.net/matthew/archives/251-Aspects,-Filters,-and-Signals,-Oh,-My!.html">already did that</a>. <a href="http://weierophinney.net/matthew/archives/266-Using-the-ZF2-EventManager.html">Twice</a>.

Basically, this allows us to have one piece of code to trigger an event and to have one or more listeners listening to this event. When the event gets triggered, the listeners are called and then we can do *something*, like caching or logging. Logging or caching. Caching. Logging...

See, that's my problem. All the event examples stop at logging and caching. Truly there must be some other example for which this event stuff can be used for. (Yes, I know. The whole dispatch process is now event driven or whatnot in ZF2, but I need event examples in my application, not in the framework.) I don't claim I found a perfect example for the events, but I tried.

<h3>The problem</h3>

One of the most "repetitive" places in my code I found is the <code>save</code> method in my models. Pass an array of data to it, possibly do something with that data, validate it, persist it, maybe do some more data mangling, return true/false to the caller. Over and over again, but just with enough difference between different models that there is actually no double code to pull out to an abstract class or some such.

Say, for example, we have a Post of some sort. It has a title and a slug created from the title. Standard stuff, nothing fancy. For the Post to be valid, it needs to have both the title and the slug set.

Now, without the EventManager, the <code>save</code> method could have a similar flow:

<ul>
<li>call the save method, passing in the data array</li>
<li>check if the data array has a slug set, if not, create one from the title</li>
<li>validate the data array, to make sure both title and slug are properly set</li>
<li>save the post</li>
</ul>

As I said, pretty standard stuff, so I'll assume you can imagine that piece of code in your head (read, I'm lazy to write it). The problem: the save method is stuffed with data preparing and validation code.

<h3>Using the EventManager</h3>

This is where, I hope, the EventManager can help. Call the <code>save</code> method and, just before the persist call, trigger a "pre-save" event and then persist the data. Attach two listeners to this "pre-save" event; the first will do the data preparation, the second will do the validation. There, done. Now the save method doesn't have that unneeded code around it and can be pulled out to an abstract class, all that is in the event listeners.

Let's see some code:

{{< highlight php >}}
<?php

// This is the Post object

class Post
{
    protected $events = null;

    public function events()
    {
        if ($this->events === null) {
            $this->events = new Zend\EventManager\EventManager(__CLASS__);

            $this->events->attach('save', array('SlugifyPost', 'slugify'), 100);
            $this->events->attach('save', array('ValidatePost', 'validate'), 90);
        }

        return $this->events;
    }

    // this method can be pulled out to an abstract model class
    // and reuse it for all the models that extend it
    public function save($data)
    {
        $this->events()->prepareArgs($data);
        $response = $this->events()->trigger('save', $this, $data);

        echo 'data saved! ' . json_encode($response->last());
    }
}
{{< /highlight >}}
I just set a "save" event to be triggered and attached two listeners to that event, the <code>slugify</code> and the <code>validate</code> methods. When the save method gets called, the event is triggered and the EventManager calls our listeners. One fairly important point here is the <code>prepareArgs</code> method call, which prepares the event arguments in such way, that when these arguments (the $data array in this case) are modified in one listener, this modification is reflected for the other listeners, too. If you don't want to modify the arguments in the listeners, this call can be omitted. As for the rest of the code, it's explained in Matthew's posts and in the ZF2 docs.

And here's how the slugify method modifies the data:

{{< highlight php >}}
<?php

class SlugifyPost
{
    public function slugify($event)
    {
        $data = $event->getParams();

        $event->setParam('slug', strtolower(str_replace(' ', '-', $data['title'])));

        return $data;
    }
}
{{< /highlight >}}
Calling the save method itself remains as it was before introducing the EventManager, which means I could add this to my models without changing the API and not break anything! Genius! Theoretically, anyway...

{{< highlight php >}}
<?php

$post = new Post;

$values = array(
    'title' => 'My post'
);

try {
    $post->save($values);
} catch(\InvalidArgumentException $e) {
    echo $e->getMessage();
}
{{< /highlight >}}
You can find this complete example <a href="https://github.com/robertbasic/blog-examples/blob/master/zf2-event-manager/index.php">on Github</a>.

<h3>Thoughts?</h3>

So, what do you think? Does this approach makes sense to you? Do tell. I kinda like the idea, but time will tell in the end, as always.

Happy hackin'!
