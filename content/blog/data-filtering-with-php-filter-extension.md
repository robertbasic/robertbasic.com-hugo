+++
date = "2008-12-15T17:14:05+02:00"
title = "Data filtering with PHP's Filter extension"
slug = "data-filtering-with-php-filter-extension"
description = "A quick look into the PHP's Filter extension that helps filtering and validating data."
tags = ["data", "example", "filter", "input", "php", "secure"]
categories = ["Development", "Programming"]
2008 = ["12"]
+++
Today I was catching up on feeds and one of the articles lead me to <a href="http://www.gophp5.org/">GoPHP5.org</a>, where I spent some time lurking. In the <a href="http://www.gophp5.org/faq#n7">FAQ section</a> of that site one sentence made me curios:

<blockquote>
The Filter extension is a new security component in PHP.
</blockquote>

Filter extension? Maybe it's nothing new for some of you, but it is for me. I've never heard of it before. So I quickly hopped over to PHP.net and the <a href="http://www.php.net/manual/en/book.filter.php">Filter chapter</a> of the manual.

The filter extension is an extension that comes by default in PHP 5.2. It is here to help us to &#147;validate and filter data that comes from insecure sources, such as user input&#148;. It can validate integers, booleans, floats, regular expressions, URLs, E-Mails and IPs. It can sanitize strings, integers, floats, URLs, E-Mails...

<h2>Examples</h2>

Here are some examples about what this extension is capable of. Lets assume that we get some data from a form with POST method. The 3 input fields are name, email and age (I'm not creating a real validator, but var_dump-ing the results of the filtering, to show what filter gives what kind of output). 

``` php
<?php
// $_POST['name'] = "Robert <b>hello</b>";
var_dump(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
// Output: string(12) "Robert hello"

// $_POST['email'] = "mail@example.com";
var_dump(filter_input(INPUT_POST, 'name', FILTER_VALIDATE_EMAIL));
// Output: string(16) "mail@example.com"

// $_POST['age'] = "22";
var_dump(filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT,
                        array('options' => array('min_range' => 18,
                                                'max_range' => 28)
                        )));
// Output: int(22)
```

With the first filter I'm using the <code>FILTER_SANITIZE_STRING</code> which strips down all tags and unwanted characters from our string. The second filter validates the provided E-mail address: pass it a malformed E-mail address and it will result with a boolean <code>false</code>. The third filter validates the age: it must be an integer and in the range between 18 and 28 (the min and max ranges are optional, I added them just for the example).

Besides input filtering it can filter variables, too:

``` php
<?php
$string = "Some funky string with <b>html</b> code and 'quotes'";
var_dump(filter_var($string, FILTER_SANITIZE_STRING));
// Output: string(53) "Some funky string with html code and 'quotes'"
// NOTE: the single quotes in the output are encoded as &amp;#39;

var_dump(filter_var($string, FILTER_SANITIZE_MAGIC_QUOTES));
// Output: string(54) "Some funky string with html code and \'quotes\'"
// NOTE: the <b></b> html tags are NOT stripped in the output

var_dump(filter_var($string, FILTER_SANITIZE_ENCODED));
// Output: string(80) "Some%20funky%20string%20with%20%3Cb%3Ehtml%3C%2Fb%3E%20code%20and%20%27quotes%27"
```

Play around with it, get familiar, cause this is one nice extension that will help you make more secure web sites and web apps.

Cheers!
