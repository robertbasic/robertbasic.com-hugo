+++
date = "2011-03-02T07:14:18+02:00"
title = "Playing with Zend Framework and Dojo"
slug = "playing-with-zend-framework-and-dojo"
description = "Intro rambling in the world of Zend Framework and Dojo, powered by Zend_Dojo"
tags = ["dojo", "form", "zend framework", "zend_dojo"]
categories = ["Programming"]
2011 = ["03"]
+++
Yesterday there was some talk on Twitter including Zend Framework and Dojo. I didn't quite follow it through, something about why Dojo and not jQuery, it's not that popular blablabla. Anyway, who cares? We have Zend_Dojo, we have ZendX_Jquery. I'm using ZendX_Jquery, but only as far as setting it up and loading jquery and jqueryui via the view helpers. Tried to use it on forms, to use tabs and whatnot, but in the end it was easier to write up a separate javascript file and do the jquery stuff there. But, I've never used Zend_Dojo before. Guess I was a bit scared away with all that dojo, dijit, dojox stuff... So, last night, being bored and all, I've decided to try and use it. Oh boy. How wrong was I for not diving into it before. OK, so far I've created only one form with dojo, but damn it's good.

In short: set up the Zend_Dojo view helpers, pick a theme, make the forms extend Zend_Dojo_Form, change the elements from Zend_Form_Element_* to Zend_Dojo_Form_Element_*, if needed add/tweak some attributes and bang! the form is all sexy with nice colors & rounded borders & (error) messages in a nice little tooltip. And I haven't wrote a single line of javascript. Not.a.single.line. Magic, I like it.

<h3>Setting it up</h3>

All I did was to set up dojo is:

{{< highlight php >}}
<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap {

    public function _initViewHelpers()
    {
        $this->bootstrap('layout');
        $this->_layout = $this->getResource('layout');
        $this->_view = $this->_layout->getView();

        $this->_view->addHelperPath('Zend/Dojo/View/Helper','Zend_Dojo_View_Helper');

        $this->_view->dojo()
                        ->enable()
                        ->setCdnBase(Zend_Dojo::CDN_BASE_GOOGLE)
                        ->setCdnVersion('1.5.0')
                        ->setCdnDojoPath(Zend_Dojo::CDN_DOJO_PATH_GOOGLE)
                        ->addStyleSheetModule('dijit.themes.claro')
                        ->useCdn();
    }
{{< /highlight >}}

and then just called <code>echo $this->dojo();</code> in the layout and added class="cairo" to the body element. I think this body thing can also be done via the helpers. The biggest struggle I had with the theme. Where do I download it? There's no "download theme x" on the dojo website. How do I set it up? What is this madness? Then I realized it can pull not just the javascript files from the CDN, but also the CSS and images! Very cool.

<h3>A simple form</h3>

Next step: spice up the forms with Zend_Dojo_Form:

{{< highlight php >}}
<?php
class My_Form extends Zend_Dojo_Form
{
    public function init()
    {
        $this->addElement(
            'ValidationTextBox',
            'title',
            array(
                'label' => 'Title:',
                'missingMessage' => 'You have to enter something', // overriding the default "This value is required."
                'promptMessage' => 'Enter a title', // on focus
                'invalidMessage' => 'Type some random characters, 3 min, 100 max', // error message for the failed regExp
                'regExp' => '.{3,100}', // regexp for validation
                'required' => true,
                'validators' => array(
                    array(
                        'validator' => 'StringLength', 'options' => array(3, 100)
                    )
                ),
                'filters' => array(
                    array(
                        'filter' => 'StringTrim',
                        'filter' => 'StripTags'
                    )
                )
            )
        );
{{< /highlight >}}

With these ~20 lines I've got some basic client side validation with a pretty nice look and feel to it while still having all of the Zend_Form power to do the validation and filtering on the server side. Still need to figure out what those "constraints" are and how and for what to use them (they're in the ZF manual, so they gotta be good for something), how to add for example a dojox.validate.isEmailAddress validator to the element, but for starters, this is quite impressive. 

Besides this, I've also played with Zend_Dojo_Form_Element_Editor which is a WYSIWYG editor, extended Zend_Dojo_Form_Element_Button to create my own ResetButton (for some odd reason there is no reset button in Zend_Dojo), played around with the decorators... But that's for some future rambling, gotta go to work now.

In the end, I feel stupid for not using Zend_Dojo before, well, Zend_Dojo_Form at least, but I definitely will be from now on. Here's to hoping that it will be included in Zend Framework 2, too :)

Happy hackin'!
