+++
date = "2008-12-22T22:17:21+02:00"
title = "Styling the default Zend_Form layout"
slug = "styling-the-default-zend_form-layout"
description = "Example to show how to style the default Zend_Form layout that uses definition lists."
tags = ["css", "example", "form", "framework", "layout", "style", "styling", "zend"]
categories = ["Development", "Programming"]
+++
<p>Here's an example for styling <a href="http://framework.zend.com/manual/en/zend.form.html">Zend_Form</a>'s default layout. The default layout is using <a href="http://w3schools.com/tags/tag_dl.asp">definition lists</a>. While there's an option for changing the default layout, the wrapper tags and stuff, I see no reason for it. Create the form, add some CSS and your good to go :)</p>
<p>Note: Be sure to provide a Document Type in your view scripts like this:</p>
<pre name="code" class="php">
&lt;?= $this-&gt;doctype('XHTML1_STRICT') ?&gt;
</pre>
<p>because when the form is generated, ZF is looking at the doctype to see how to create the form elements. Forgetting the doctype will probably generate invalid markup. I learned the hard way. Don't do the same mistake, k? :)</p>
<h2>The generated markup</h2>
<p>So, here's what Zend_Form makes for us (this markup is after submitting the form, but whit generated error, to show the error markup, too):</p>
<pre name="code" class="php">
&lt;form enctype="application/x-www-form-urlencoded" method="post" action=""&gt;
&lt;dl class="zend_form"&gt;
    &lt;dt&gt;
        &lt;label for="input1" class="required"&gt;Input field #1:&lt;/label&gt;
    &lt;/dt&gt;
    &lt;dd&gt;
        &lt;input type="text" name="input1" id="input1" value="" /&gt;
        &lt;ul class="errors"&gt;
            &lt;li&gt;Value is empty, but a non-empty value is required&lt;/li&gt;
        &lt;/ul&gt;
        &lt;p class="description"&gt;Description? Yes, please.&lt;/p&gt;
    &lt;/dd&gt;
    &lt;dt&gt;
        &nbsp;
    &lt;/dt&gt;
    &lt;dd&gt;
        &lt;input type="submit" name="submit" id="submit" value="Submit form" /&gt;
    &lt;/dd&gt;
&lt;/dl&gt;
&lt;/form&gt;
</pre>
<p>The PHP code which generates this form (without the error, of course) goes like this:</p>
<pre name="code" class="php">
$input1 = new Zend_Form_Element_Text('input1');
$input1-&gt;setLabel('Input field #1:')
          -&gt;setDescription('Description? Yes, please.')
          -&gt;setRequired(true);

$submit = new Zend_Form_Element_Submit('submit');
$submit-&gt;setLabel('Submit form')

$form = new Zend_Form();
$form-&gt;setMethod('post')
       -&gt;addElement($input1)
       -&gt;addElement($submit);
</pre>
<div id="attachment_466" class="wp-caption alignright" style="width: 150"><a href="http://robertbasic.com/blog/wp-content/uploads/2008/12/zendformnocss.gif"><img src="http://robertbasic.com/blog/wp-content/uploads/2008/12/zendformnocss-150x150.gif" alt="Default Zend_Form layout with no CSS" title="zendformnocss" width="150" height="150" class="size-thumbnail wp-image-466" /></a><p class="wp-caption-text">Default Zend_Form layout with no CSS</p></div>
<p>Now, the generated form looks kinda good with no styling (which is good, if some maniac comes to visit with CSS support disabled).</p>
<p>OK, I lie: there's a minimum of CSS for setting the background to white and the width to 460 pixels.</p>
<p>As you can see I've shortened the HTML and the PHP in the example codes...</p>
<h2>The styling</h2>
<p>I like my forms a bit different: form elements and their labels side by side with element descriptions and eventual errors showing up under the element. Here's the CSS to achieve this:</p>
<pre name="code" class="css">
.zend_form{
background:#fff;
width:460px;
margin:5px auto;
padding:0;
overflow:auto;
}

.zend_form dt{
padding:0;
clear:both;
width:30%;
float:left;
text-align:right;
margin:5px 5px 5px 0;
}

.zend_form dd{
padding:0;
float:left;
width:68%;
margin:5px 2px 5px 0;
}

.zend_form p{
padding:0;
margin:0;
}

.zend_form input, .zend_form textarea{
margin:0 0 2px 0;
padding:0;
}

.submit{
float:right;
}

.required:before{content:'* '}

.optional:before{content:'+ '}
</pre>
<div id="attachment_484" class="wp-caption alignright" style="width: 150"><a href="http://robertbasic.com/blog/wp-content/uploads/2008/12/zendform1.gif"><img src="http://robertbasic.com/blog/wp-content/uploads/2008/12/zendform1-150x150.gif" alt="Default Zend_Form layout with CSS" title="zendform1" width="150" height="150" class="size-thumbnail wp-image-484" /></a><p class="wp-caption-text">Default Zend_Form layout with CSS</p></div>
<p>Of course, this CSS takes care only of the layout; things like font types and sizes, colors, borders, backgrounds, etc. are not essential for this.</p>
<p>So, with this CSS applied to the generated Zend_Form, you can see on the image what will come up. And you know what's the best part? It's good for Firefox, Internet Explorer 6, Chrome and Opera, both under Windows and GNU/Linux (sorry, not tested for Internet Explorer 7 and Safari, but they should play along as well).</p>
<p>I almost forgot: I added a class="submit" to the submit button, to be able to float it right. I first tried to do that with input[type=submit], but IE doesn't know that, and as I wanted to make a styling that looks (almost) the same in all browsers with no hacks, I decided to add the class attribute.</p>
<p>So there, this little CSS code snippet should get you started with styling your Zend Form's.</p>
<p>Cheers!</p>