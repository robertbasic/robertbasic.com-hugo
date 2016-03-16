+++
date = "2010-04-21T10:43:14+02:00"
title = "Honeypot for Zend Framework"
slug = "honeypot-for-zend-framework"
description = "A honeypot validator for Zend Form based on Matthew Turland's Honeypot Wordpress plugin."
tags = ["framework", "honeypot", "php", "validator", "zend"]
categories = ["Development", "Programming"]
+++

I just hacked up a little code snippet based on <a href="http://twitter.com/elazar">Matthew's</a> <a href="http://matthewturland.com/2010/01/01/im-a-honey-pot/">Honeypot Wordpress plugin</a>. It's basically just a Validator for a Zend Form element which is hidden from the user via CSS. Cause it's hidden, users won't see it, but spambots will, well, cause they are bots.

If the element is left empty, it's valid, otherwise it's not.

So, here's the code:

{{< highlight php >}}<?php
class App_Validate_Honeypot extends Zend_Validate_Abstract
{
    const SPAM = 'spam';

    protected $_messageTemplates = array(
        self::SPAM => "I think you're a spambot. Sorry."
    );

    public function isValid($value, $context=null)
    {
        $value = (string)$value;
        $this->_setValue($value);

        if(is_string($value) and $value == ''){
            return true;
        }

        $this->_error(self::SPAM);
        return false;
    }
}
{{< /highlight >}}

I add the element to the form like this:

{{< highlight php >}}<?php
$this->addElement(
    'text',
    'honeypot',
    array(
        'label' => 'Honeypot',
        'required' => false,
        'class' => 'honeypot',
        'decorators' => array('ViewHelper'),
        'validators' => array(
            array(
                'validator' => 'Honeypot'
            )
        )
    )
);
{{< /highlight >}}

There. Done.

Happy hackin'!
