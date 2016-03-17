+++
date = "2008-12-02T18:02:48+02:00"
title = "MyUrl view helper for Zend Framework"
slug = "myurl-view-helper-for-zend-framework"
description = "Adding the GET query string to the link created by Zend Framework's Url View Helper"
tags = ["example", "framework", "helper", "link", "php", "url", "view", "zend"]
categories = ["Development", "Programming"]
2008 = ["12"]
+++
I started writing some boring introduction but I'll just skip to the point.

<h2>The problem</h2>

Zend Framework's built in URL view helper &#151; <code>Zend_View_Helper_Url</code> &#151; is discarding the query string of the URL, thus breaking some links.

Example: If I'm on a page like:<br />
<code>http://project/foo/bar/?param1=value1</code><br />
and in the bar.phtml I use the Url helper like this:

{{< highlight php >}}
<?php
<?= $this->url(array('param2' => 'value2')); ?>
{{< /highlight >}}

I expect this:<br />
<code>http://project/foo/bar/param2/value2/?param1=value1</code><br />
or something similar to this. This would be just perfect:<br />
<code>http://project/foo/bar/param1/value1/param2/value2</code><br />
But no, it gives:<br />
<code>http://project/foo/bar/param2/value2/</code>

<h2>The solution</h2>

After working on several workarounds, currently this is the best one I can think of &#151; take the link that is created by the built-in Url helper and add the query string on that link:

{{< highlight php >}}
<?php

// Usage:
// <?= $this->myUrl($this->url(array('param2' => 'value2'))); ?>
// Output:
// http://project/controller/action/param2/value2/?param1=value1
class Zend_View_Helper_MyUrl
{
    public function myUrl(&$url, &$toAdd = array())
    {
        $requestUri = Zend_Controller_Front::getInstance()->getRequest()->getRequestUri();
        $query = parse_url($requestUri, PHP_URL_QUERY);
        if($query == '')
        {
            return $url;
        }
        else if(empty($toAdd))
        {
            return $url . '/?' . $query;
        }
        else
        {
            $toAdd = (array)$toAdd;
            $query = explode("&", $query);

            $add = '/?';

            foreach($toAdd as $addPart)
            {
                foreach($query as $queryPart)
                {
                    if(strpos($queryPart, $addPart) !== False)
                    {
                        $add .= '&' . $queryPart;
                    }
                }
            }
            return $url . $add;
        }
    }
}
{{< /highlight >}}

The second parameter, <code>$toAdd</code>, should be an array of parameters that we want to add to the URL. Say, if I have a query string like:<br />
<code>?param1=value1&someotherparam=anditsvalue</code><br />
but want only to add the <code>param1=value1</code> to the URL, I would pass &#147;param1&#148; as the second parameter. Not passing anything as the second parameter will result in adding the complete query string to the URL.

This is an ugly hack to make ugly links work, but it works. Thoughts?

Cheers!
