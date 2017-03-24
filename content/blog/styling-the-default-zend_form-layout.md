+++
date = "2008-12-22T22:17:21+02:00"
title = "Styling the default Zend_Form layout"
slug = "styling-the-default-zend_form-layout"
description = "Example to show how to style the default Zend_Form layout that uses definition lists."
tags = ["css", "example", "form", "framework", "layout", "style", "styling", "zend", "zf"]
categories = ["Development", "Programming"]
2008 = ["12"]
+++
Here's an example for styling <a href="http://framework.zend.com/manual/en/zend.form.html">Zend_Form</a>'s default layout. The default layout is using <a href="http://w3schools.com/tags/tag_dl.asp">definition lists</a>. While there's an option for changing the default layout, the wrapper tags and stuff, I see no reason for it. Create the form, add some CSS and your good to go :)

Note: Be sure to provide a Document Type in your view scripts like this:

``` php
<?php
<?= $this->doctype('XHTML1_STRICT') ?>
```

because when the form is generated, ZF is looking at the doctype to see how to create the form elements. Forgetting the doctype will probably generate invalid markup. I learned the hard way. Don't do the same mistake, k? :)

<h2>The generated markup</h2>

So, here's what Zend_Form makes for us (this markup is after submitting the form, but whit generated error, to show the error markup, too):

``` html
<form enctype="application/x-www-form-urlencoded" method="post" action="">
<dl class="zend_form">
    <dt>
        <label for="input1" class="required">Input field #1:</label>
    </dt>
    <dd>
        <input type="text" name="input1" id="input1" value="" />
        <ul class="errors">
            <li>Value is empty, but a non-empty value is required</li>
        </ul>
        <p class="description">Description? Yes, please.</p>
    </dd>
    <dt>
        &nbsp;
    </dt>
    <dd>
        <input type="submit" name="submit" id="submit" value="Submit form" />
    </dd>
</dl>
</form>
```

The PHP code which generates this form (without the error, of course) goes like this:

``` php
<?php
$input1 = new Zend_Form_Element_Text('input1');
$input1->setLabel('Input field #1:')
          ->setDescription('Description? Yes, please.')
          ->setRequired(true);

$submit = new Zend_Form_Element_Submit('submit');
$submit->setLabel('Submit form')

$form = new Zend_Form();
$form->setMethod('post')
       ->addElement($input1)
       ->addElement($submit);
```

Now, the generated form looks kinda good with no styling (which is good, if some maniac comes to visit with CSS support disabled).

OK, I lie: there's a minimum of CSS for setting the background to white and the width to 460 pixels.

As you can see I've shortened the HTML and the PHP in the example codes...

<h2>The styling</h2>

I like my forms a bit different: form elements and their labels side by side with element descriptions and eventual errors showing up under the element. Here's the CSS to achieve this:

``` css
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
```

Of course, this CSS takes care only of the layout; things like font types and sizes, colors, borders, backgrounds, etc. are not essential for this.

So, with this CSS applied to the generated Zend_Form, you can see on the image what will come up. And you know what's the best part? It's good for Firefox, Internet Explorer 6, Chrome and Opera, both under Windows and GNU/Linux (sorry, not tested for Internet Explorer 7 and Safari, but they should play along as well).

I almost forgot: I added a class="submit" to the submit button, to be able to float it right. I first tried to do that with input[type=submit], but IE doesn't know that, and as I wanted to make a styling that looks (almost) the same in all browsers with no hacks, I decided to add the class attribute.

So there, this little CSS code snippet should get you started with styling your Zend Form's.

Cheers!
