+++
date = "2008-10-22T20:27:46+02:00"
title = "A Zend_Captcha example"
slug = "a-zend-captcha-example"
description = "Example of using Zend Captcha with Zend Form and the basics behind the captcha generation logic"
tags = ["captcha", "example", "framework", "php", "zend"]
categories = ["Development", "Programming", "Software"]
2008 = ["10"]
+++
<strong>Update: I made an error in the example code, regarding the CAPTCHA image URL. I'm sorry for any troubles caused by this mistake.</strong>

<strong>Update #2: <a href="http://sankhomallik.com/2008/12/17/tutorial-using-zend_captcha_image/">Here's an example</a> of using Zend_Captcha without the whole Zend Framework stuff.</strong>

<strong>Update #3: There was an unintentional error in the captchaAction() method, Adam warned me about it in the comments. The error is fixed now. Thanks Adam.</strong>

OK, this was a bit tricky and I found no examples about it, so I thought to blog it. I'll just show a quick example how to implement Zend_Captcha into a Zend_Form, may be useful for someone. There are several CAPTCHA types in ZF, like the Image, Figlet and Dumb. I use Image.

First of all, we'll use sessions, so we need to change the bootstrap file a little:

{{< highlight php >}}
<?php
// Put this line somewhere after the Zend_Loader::registerAutoload(); line
Zend_Session::start();
{{< /highlight >}}

We need to start the session to use it, putting it close to the top will assure that there will be no &#147;Headers already sent by...&#148; errors caused by a wrongly placed session start.

Next we need a folder which has a 777 permission on it (Windows users, you can skip this... Or start using GNU/Linux) where we will put our captcha images for a while... This folder must be in the public folder somewhere. So create one.

How does this work? When a captcha is generated, it generates a unique ID (e.g. 539e517b0c0f4e32ef634dae92f07f77) and the word on the image. That unique ID is used for the file name of the image and for the session namespace (the namespace is like: Zend_Form_Captcha_uniqueId), so it knows which image belongs to which session. Also, the generated word is placed inside it's own session. That ID is placed on the form in a hidden field, so when the submission is received, we can access the ID and recreate the correct session namespace and access the data in it: the word on the image.

Awesome. Now, to the fun part. I use the <code>Zend_Form_Element_Captcha</code> class, so no additional fooling around is needed to put the captcha in the form. Here's the code:

{{< highlight php >}}
<?php
public function indexAction()
{
// Our form object...
$form = new Zend_Form();
// And here's our captcha object...
$captcha = new Zend_Form_Element_Captcha(
        'captcha', // This is the name of the input field
        array('label' => 'Write the chars to the field',
        'captcha' => array( // Here comes the magic...
        // First the type...
        'captcha' => 'Image',
        // Length of the word...
        'wordLen' => 6,
        // Captcha timeout, 5 mins
        'timeout' => 300,
        // What font to use...
        'font' => '/path/to/font/FontName.ttf',
        // Where to put the image
        'imgDir' => '/var/www/project/public/captcha/',
        // URL to the images
        // This was bogus, here's how it should be... Sorry again :S
        'imgUrl' => 'http://project.com/captcha/',
)));
// Add the captcha element to the form...
$form->setAction('/index/captcha/')
        ->setMethod('post')
        // Add the captcha to the form...
        ->addElement($captcha)
        ->addElement('submit','Submit')
// Pass the form to the view...
$this->view->form = $form;
}
{{< /highlight >}}

On the other side, it goes something like this:

{{< highlight php >}}
<?php
public function captchaAction()
{
  $request = $this->getRequest();
  // Get out from the $_POST array the captcha part...
  $captcha = $request->getPost('captcha');
  // Actually it's an array, so both the ID and the submitted word
  // is in it with the corresponding keys
  // So here's the ID...
  $captchaId = $captcha['id'];
  // And here's the user submitted word...
  $captchaInput = $captcha['input'];
  // We are accessing the session with the corresponding namespace
  // Try overwriting this, hah!
  $captchaSession = new Zend_Session_Namespace('Zend_Form_Captcha_'.$captchaId);
  // To access what's inside the session, we need the Iterator
  // So we get one...
  $captchaIterator = $captchaSession->getIterator();
  // And here's the correct word which is on the image...

  $captchaWord = $captchaIterator['word']
  // Now just compare them...
  if($captchaInput == $captchaWord)
  {
  // OK
  }
  else
  {
  // NOK
  }
}
{{< /highlight >}}

Easy, ain't it?

Happy hacking :)

Tip: Using a monospace or a serif font for the words on the image (like FreeMono.ttf found by default on Ubuntu), makes the word quite unreadable &#151; with the FreeMono.ttf about 8 out of 10 is UNreadable &#151; so use a sans-serif font.
