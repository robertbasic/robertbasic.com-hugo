+++
date = "2011-08-25T10:55:34+02:00"
title = "Defining multiple security rules in XML format for Symfony2"
slug = "defining-multiple-security-rules-in-xml-format-for-symfony2"
description = "How to define multiple security rules in XML for Symfony2"
tags = ["rule", "security", "symfony2", "xml"]
categories = ["Development", "Programming"]
2011 = ["08"]
+++
This one falls into a category of bogus Symfony2 documentation. Or inconsistent behavior. Or whatever. It's a bit frustrating.

I've chosen to use XML to define different settings across my sf2 apps: routing, ORM, services and of course security.

Symfony2's security stuff let's you define rules based on URL matching witch is, to some extent, explained in the <a href="http://symfony.com/doc/current/book/security.html#securing-specific-url-patterns">documentation</a>. The examples for YAML works fine, but for XML it's kinda bogus.

The example says:

``` xml
<access-control>
    <rule path="^/admin/users" role="ROLE_SUPER_ADMIN"></rule>
    <rule path="^/admin" role="ROLE_ADMIN"></rule>
</access-control>
```

which will actually die in a fire with an ugly as hell exception: <code>InvalidConfigurationException: Unrecognized options "0, 1" under "security.access_control.rule"</code>. Thanks, that's helpful. The funny thing is that if you have <strong>only one</strong> rule defined, it works!

After an hour of hunting up and down, I finally found the solution in the <a href="https://github.com/symfony/symfony/blob/master/src/Symfony/Bundle/SecurityBundle/Tests/DependencyInjection/Fixtures/xml/container1.xml#L56">test fixtures</a> of the SecurityBundle!

The solution is to omit the <code>access-control</code> tags:

``` xml
<rule path="^/admin/users" role="ROLE_SUPER_ADMIN"></rule>
<rule path="^/admin" role="ROLE_ADMIN"></rule>
```

I thought about submitting an issue against the code, but as the fixtures use this format, I'll open up a ticket against the docs. A real WTF moment.

Happy hackin'!

Update, August 26th, 2011:

Defining roles suffers from the same bug. So, instead of using:

``` xml
<role-hierarchy>
    <role id="ROLE_ADMIN" >Admin</role>
    <role id="ROLE_SUPER_ADMIN">Super admin</role>
</role-hierarchy>
```

use:

``` xml
<role id="ROLE_ADMIN" >Admin</role>
<role id="ROLE_SUPER_ADMIN">Super admin</role>
```
