+++
date = "2011-08-25T09:00:39+02:00"
title = "Importing Symfony2 security settings from a bundle"
slug = "importing-symfony2-security-settings-from-a-bundle"
description = "How to import security settings from a bundle in Symfony2."
tags = ["bundle", "security", "symfony2"]
categories = ["Development", "Programming"]
+++
<p>I started to work on/figuring out the <a href="http://symfony.com/doc/current/book/security.html">security part</a> in Symfony2 and one part where the docs fail so far is to explain how to import security settings from a bundle.</p>
<p>Once I put some thinking into it, it's pretty easy actually. Simply import the needed security file in your main config file. Something like this will work:</p>
<pre name="code" class="bash">
# app/config/config.yml
imports:
    - { resource: parameters.ini }
    - { resource: '@AcmeDemoBundle/Resources/config/security.xml' }
</pre>
<p>where the security.xml file is the same as already <a href="http://symfony.com/doc/current/book/security.html#basic-example-http-authentication">described in the documentation</a>.</p>
<p>Happy hackin'!</p>
<p>P.S.: Bonus tip: When googling for symfony2 stuff, start your query with +symfony2 to include only symfony2 results. Makes life a bit easier.</p>
