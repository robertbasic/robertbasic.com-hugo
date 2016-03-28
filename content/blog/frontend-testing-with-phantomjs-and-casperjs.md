+++
date = "2013-01-29T23:22:44+02:00"
title = "Frontend testing with phantomjs and casperjs"
slug = "frontend-testing-with-phantomjs-and-casperjs"
description = "Started writing frontend tests with phantomjs and casperjs"
tags = ["testing", "frontend", "javascript", "phantomjs", "casperjs", "automating"]
categories = ["Development", "Programming"]
2013 = ["01"]
+++

I am not usually fond of doing much frontend stuff, but I do like to dable in some javascript from time to time. Nothing fancy, no node.js, coffeescript and the likes for me. I still feel like making applications on the server side, and have the client just show things to the user. If needed some 3rd party javascript library or framework to make my life easier, and that's about it.

For a while I was reluctant on writing any frontend tests, integration tests, or whatever you want to call them, because, y'know, *refresh-click-click-click* and the testing is done. Easy. Except when it's not. From time to time some piece of user interface gets wild on javascript and it turns out after a couple of weeks, half a dozen of bugs reported, and hundreds of refreshes and thousands of clicks, that whole thing becomes tiresome. Thus, I decided to dabble my toes deeper in the waters of the javascript world and try writing some tests for all this.

<img unselectable="on" style="float:right;padding:10px;" src="/img/posts/frontend-testing.png">

What I found first is that there's a lot of testing libraries out there for javascript. Won't even try listing them all. When I set out for the hunt I knew what I wanted and needed. I wanted a tool that will help me automate all my refreshclicks, or at least to some extent. Tell the tool through my tests: "go to that page, check what and how is rendered, do some things with the UI, test again". The less dependencies it has on other things, the better. I asked around among people who are bit more fluent in javascript than I am, what are they using and what would they recommend. Not too much to my surprise, everyone recommended a different thing, whatever fits their problem. So I ended up picking the tools that fit my problem.

<h3>The tools chosen</h3>

The first tool I picked was <a href="http://phantomjs.org/">phantomjs</a>. It's a "headless WebKit with JavaScript API. It has fast and native support for various web standards: DOM handling, CSS selector, JSON, Canvas, and SVG." (shamelessly copy-pasted from their website). When installing it either download a binary from their website, or compile the source on your own. If you're on Ubuntu, <b>do not</b> install it via <code>apt-get</code>. It installs some very old version, 1.4 I think, and phantomjs will just scream at you something about some X servers. The binaries are pre-built for any and all systems, so just use them (not that I tried all of them, but I trust they all work).

To cut the story short, writing tests with just phantomjs is difficult. If at all possible. Because hey! It's not a testing library. I think. This part is a bit blurry for me.

Enter <a href="http://casperjs.org/">casperjs</a>! These two together look like a perfect match for doing automated, frontend tests full of javascript.

Even though last week on Friday I was being a bit frustrated and a bit more of a dick and said bad things about casperjs over twitter which I shouldn't have. Sorry. Broken things on a Friday at 5PM can do that to a man.

<h3>Examples!</h3>

That's why you're here, to see some examples. And this example, which, btw, <a href="https://github.com/robertbasic/blog-examples/tree/master/frontend-testing">is on Github here</a>, will have a simple login page with a form and a logged in page with some UI elements that you can click around and do stuff! And we're going to test all that with phatnomjs and casperjs. Just like real life. Cookies included.

When writing tests with phantomjs and casperjs, all one need to do is think in steps. Same simple steps like in the refreshclick procedure. First, open page. Make sure we are on the correct page. Make sure all the elements are there. Click something. Make sure that thing is clicked. Fill in a field. Make sure the field is filled. And so on.

Let's have a look at the first part of the <code>tests.js</code> file:

``` javascript
casper.start('http://localhost/frontend-testing', function () {
    this.test.assertUrlMatch(/login.php$/, 'Redirected to login page');
    this.test.assertExist("#login_form", 'Login form exists');
    this.fill('#login_form', {
        'email': 'email@example.com'
    }, false); // false means don't autosubmit the form
    this.test.assertField('email', 'email@example.com');
});
casper.thenClick('#login', function () {
    this.test.assertUrlMatch(/index.php$/, 'Redirected to index page after login');
});
```

The tests are surprisingly self-explanatory: <i>start</i> by opening up the home page. <i>Assert</i> that we are (redirected to) on the login page and that the login form <i>exists</i>. Then <i>fill</i> the email field of the login form with a given value. <i>Assert</i> that the field was indeed filled with that value. Once that's done, <i>then click</i> on the login button, and <i>assert</i> that we end up on the index page.

Easy!

And practically that goes on in the entire test. Start, assert, then do this, assert, then do that, assert, done.

Testing ajax calls isn't difficult either:

``` javascript
casper.thenClick('#do_ajax', function () {
    this.waitForResource('http://localhost/frontend-testing/ajax.php');
});
casper.then(function () {
    // Sometimes we need to wait a bit more for ajax requests ...
    this.wait(50);
});
casper.then(function () {
    this.test.assertTextExist('Just some ajax response.', 'Ajax request was made');
});
```

Do some action that triggers an ajax request, <i>wait for that ajax request</i> to finish and assert that something was done with the response from that ajax call. Of course, in real life examples you will have a bit more complicated setup, but hey... As for faking ajax requests I hear that can be done with this cool <a href="http://sinonjs.org/">sinonjs</a> library, but I haven't managed to get that working, yet. Mostly because I didn't need to fake any ajax calls.

The most voodoo-like thing in these tests is probably the <code>evaluate()</code> part. I don't think I really know what that it is, but what I <i>think</i> it is, that, whenever you want to do something <b>in the actual webpage</b>, but from within the tests, you use <code>evaluate()</code>. 

For example, I had to use <code>evaluate()</code> to determine is the checkbox checked or not:

``` javascript
casper.thenClick('#enable_ajax', function () {
    // I could swear I had this one working
    // this.test.assertEquals(this.getElementAttribute('#enable_ajax', 'checked'), 'checked', 'Checkbox is checked');
    this.test.assertTrue(this.evaluate(function () { 
        return document.getElementById("enable_ajax").checked;
    }), 'Checkbox is checked');
});
```

Not sure how, but the <code>this.getElementAttribute()</code> way does actually work in my other tests. Honest. Not sure why it didn't work in this example. Maybe some other factors not present here, affected my other tests? I don't know.

<h3>Helpful bits</h3>

What I found extremely helpful while writing the tests is the <code>this.debugHtml()</code> and <code>this.debugPage()</code> casper functions. The former will dump the entire HTML to the terminal, and the latter will dump just the text of the entire page. Can be useful to figure out what's going on.

The other helpful debugging function I used a lot is <code>this.getElementAttribute(&lt;selector&gt;)</code>. It retrieves a bunch of helpful information on an element, which you can then dump to the terminal, to further figure out things:

``` javascript
casper.then(function () {
    require('utils').dump(this.getElementAttribute('#enable_ajax'));
});
```

Will result in an output like this:

``` javascript
{
    "attributes": {
        "id": "enable_ajax",
        "name": "enable_ajax",
        "type": "checkbox"
    },
    "height": 13,
    "html": "",
    "nodeName": "input",
    "tag": "<input type=\"checkbox\" name=\"enable_ajax\" id=\"enable_ajax\">",
    "text": "",
    "visible": true,
    "width": 13,
    "x": 12,
    "y": 58
}
```

I mean, it even gives the positions of the checkbox on the page! Super helpful.

casperjs supports CSS3 selectors and, which gives me much joy, <a href="http://en.wikipedia.org/wiki/XPath">XPath</a>. Makes getting those pesky little elements covered in layers of divs and tables a walk in the park.

One thing though: you can't do things like selecting multiple elements at once and then <code>.each()</code>'em or something like that. You have to select elements one by one and do assertions on each of them. Even if the selector matches multiple elements, it will just return the first element, so you'll probably end up using lots of <code>:nth-child(n)</code> selectors. But that's what copy-paste was invented for.

That's about it, I guess. Of course, there's much more to both phantomjs and casperjs, but I found the documentations well written, so I believe it's fairly easy to tackle even the testing of more complicated web pages with these libraries.

Happy testing!
