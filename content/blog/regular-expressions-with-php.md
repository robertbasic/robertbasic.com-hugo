+++
date = "2008-09-22T19:06:16+02:00"
title = "Regular expressions with PHP"
slug = "regular-expressions-with-php"
description = "Example of using regular expressions in PHP, parsing links and anchor tags"
tags = ["example", "pcre", "php", "regex", "regexp"]
categories = ["Development", "Programming"]
+++
I just want to write some real examples. These regexps are (and always will be, 'cause I plan to write several posts on this topic) for the PHP's <a href="http://www.php.net/manual/en/book.pcre.php" target="_blank">PCRE</a> library. Here's a good <a href="http://www.phpguru.org/downloads/PCRE%20Cheat%20Sheet/PHP%20PCRE%20Cheat%20Sheet.pdf" target="_blank">PHP PCRE cheat sheet</a>, it's an excellent resource for regexps. If you know nothing about regexps, first read this <a href="http://en.wikipedia.org/wiki/Regular_expression">Wiki page</a>.

<h2>Regexps for anchor tags</h2>

A common case is when you have a source of some web page and you want to parse out all the links from it.<br />
An anchor tag goes something like this:

{{< highlight php >}}
<a href="http://example.com/" title="Some website">Website</a>
{{< /highlight >}}

Also it can have more attributes, like <b>class</b>, <b>target</b> etc. Knowing how it's built up, we can start writing a pattern, depending on what we want.<br />
Here are some examples, some explanations are in the comments:

{{< highlight php >}}
<?php
// Regexp examples for <a> tags

/**
* Different combinations...
* $matches_comb[0] contains the whole <a> tag
* $matches_comb[1] contains what's inside the "href" attribute
* $matches_comb[2] contains what's after <a> and before </a>
* with the "s" modifier mathces <a> tags that are broken in several lines,
* ie. matches <a> tags with newlines
* without the "s" modifier, matches only <a> tags without a newline
*/
preg_match_all(
    '#<a\s.*href=["\'](.*)["\'].*>(.*)</a>#isxU',
    $string,
    $matches_comb
);

/**
* Match only what's inside the href attributes...
*/
preg_match_all(
    '#<a\s.*href=["\'](.*)["\'].*>.*</a>#isxU',
    $string,
    $matches_href
);

/**
* Match only what's inside the href attirbutes,
* only when it starts with http:// and includes http://
* $mathces_href_http[0] contains some trash also, nevermind,
* $mathces_href_http[1] contains exactly what we need
*/
preg_match_all(
    '#<a\s.*href=["\'](http://.*)["\'].*>.*</a>#isxU',
    $string,
    $matches_href_http
);

/**
* Match all Email addresses - mailto:
*/
preg_match_all(
    '#"mailto:(.*)"#',
    $string,
    $matches_emails
);

?>
{{< /highlight >}}

Play around with these patterns, see what's for what, experiment, that's the best way to learn regexps.

Do you have some more regexps for links? Some better ones than these here?

Happy hacking!
