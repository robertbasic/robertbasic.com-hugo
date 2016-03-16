+++
date = "2009-03-14T11:00:36+02:00"
title = "Wordpress as CMS tutorial"
slug = "wordpress-as-cms-tutorial"
description = "An example how to transform Wordpress into a complete CMS."
tags = ["blog", "cms", "example", "hack", "php", "tutorial", "wordpress"]
categories = ["Development", "Programming", "Software"]
+++
<p><a href="http://wordpress.org/">Wordpress</a> is one of the best blogging platforms out there &#151; if not the best. It's very powerful, can be easily extended and modified. It's <a href="http://codex.wordpress.org/Main_Page">documentation</a> is very well written and, so far, had answer to all of my crazy questions :)</p>
<p>You know what's the best part of Wordpress? With some knowledge of PHP and MySql, you can turn it into much more than just a blogging platform. After doing some HTML to WP work for <a href="http://twitter.com/styletime">Roger</a>, I thought of one way how could Wordpress be transformed into a CMS. Note the &#147;one way&#148;. This is not the only way for doing this, and, most likely, not the best way.</p>
<p>I didn't look much, but I think that there are some nice plugins out there that can do this. But, where's the fun in the download, upload, activate process? Nowhere!</p>
<p>I will show you how to change your Wordpress into a CMS and it really doesn't take much coding to achieve this! The example presented here is <strong>simple</strong> and will have a static page for it's home page, another static page for the &#147;Portfolio&#148; page and the blog. The home and portfolio page will have some of own content and both will include some content from other static pages. You all most likely know the blog part ;)</p>
<h2>Static pages</h2>
<p>Things you should know: each static page has it's title, it's slug or name (the thing that shows up in your browsers address bar: http://example.com/portfolio/ - right there, the portfolio is the slug!), has the parent attribute and the template attribute. The parent attribute is used when it's needed to make one page a child of another, i.e. to show Page2 as a subpage of Page1. The template attribute is used when we want to apply some different layout and styling to a static page. Read more about <a href="http://codex.wordpress.org/Pages">static pages</a> and how to create your own <a href="http://codex.wordpress.org/Pages#Creating_Your_Own_Page_Templates">page templates</a>.</p>
<p><!--more--></p>
<p>If you want to, you can download the theme I created for this tutorial from <a href="http://robertbasic.com/downloads/wpascms.zip">here</a> (it's not a designers masterpiece, what did you expect?), or you can use any theme you want.</p>
<p>I hope you read the part on <a href="http://codex.wordpress.org/Pages#Creating_Your_Own_Page_Templates">creating page templates</a>, I really don't feel like explaining the next part.</p>
<p>Create 3 new files in your template directory (if you're using my theme, these files are already there): home.php, portfolio.php and blog.php. Contents of these files are:</p>
<pre name="code" class="php">
// home.php
&lt;?php
/*
Template Name: Home
*/
?&gt;

// portfolio.php
&lt;?php
/*
Template Name: Portfolio
*/
?&gt;

// blog.php
&lt;?php
/*
Template Name: Blog
*/

// Which page of the blog are we on?
$paged = get_query_var('paged');
query_posts('cat=-0&paged='.$paged);

// make posts print only the first part with a link to rest of the post.
global $more;
$more = 0;

//load index to show blog
load_template(TEMPLATEPATH . '/index.php');
?&gt;
</pre>
<p>To understand the contents of the blog.php file, please take a look at <a href="http://codex.wordpress.org/Making_Your_Blog_Appear_in_a_Non-Root_Folder">this</a>.</p>
<p>Now, go to the dashboard, the Pages section and write 3 new static pages:</p>
<ul>
<li>Home, with the slug home, for the template choose Home from the drop-down list (it's on the right side) and the parent leave as is (Main Page)</li>
<li>Portfolio, with the slug portfolio, for the template choose Portfolio</li>
<li>Blog, with the slug blog, for the template choose Blog</li>
</ul>
<p>You can add some content to the Home and Portfolio pages, but don't add any to the Blog page.</p>
<h2>Organizing links</h2>
<p>Now, let's make that when we are on http://example.com/ it shows us the Home page, instead of the Blog, and when on the http://example.com/blog/ to show us the blog!</p>
<p>Go to Settings->Reading and where it says "First page displays" choose "A static page", and under the "Front page" drop-down choose "Home".</p>
<p>Now, go to Settings->Permalinks and change the "Custom structure" to <code>/blog/%postname%/</code> or whatever is your preferred permalinks structure, but it must start with <code>/blog/</code>! If Wordpress can't write to your .htaccess file (I hope it can't!), open it up in your editor and type the following (or similar, depends on your setup):</p>
<pre name="code" class="php">
&lt;IfModule mod_rewrite.c&gt;
RewriteEngine On
RewriteBase /blog/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
&lt;/IfModule&gt;
</pre>
<p>The point is in the <code>RewriteBase</code>, with that we're telling WP where to find the blog. On default setups, when http://example.com/ points to the blog, the RewriteBase is simply / but with the blog located at http://example.com/blog/ we need to change the RewriteBase. If all is well, we're done with organizing the links.</p>
<p>While you're still in the dashboard, write some new static pages with content. For the parent of these pages choose Portfolio and leave the template the default (the default page template is page.php).</p>
<h2>Time for coding!</h2>
<p>Here are two functions I wrote for retrieving content from static pages which will be then included in other static pages:</p>
<pre name="code" class="php">
// functions.php
&lt;?php

/**
* Gets last $number_of_subpages from their $parent_page
* If the &lt;!--more--&gt; tag is ignored ($ignore_more=true) returns the entire content of the subpages
*
* @param mixed $parent_page Contains either the slug of the parent page or it's ID
* @param integer $number_of_subpages Number of subpages to return
* @param boolean $ignore_more Whether to ignore the &lt;!--more--&gt; tag or not
* @return array Contents and titles of subapages
*/
function wpascms_get_subpages($parent_page='portfolio', $number_of_subpages=2, $ignore_more=false)
{
    global $wpdb;

    if(is_string($parent_page))
    {
        $parent_page_ID = wpascms_get_parent_page_ID($parent_page);
    }
    else
    {
        $parent_page_ID = $parent_page;
    }  

    if($number_of_subpages == 0)
    {
        $limit = '';
    }
    else
    {
        $limit = 'LIMIT 0, ' . $number_of_subpages;
    }
    // Get all subpages that are published and are childs of the given parent page
    // and order them by date in descending order (latest first)
    // also, if needed, limit to the latest $number_of_subpages
    $subpages = $wpdb-&gt;get_results("SELECT * FROM $wpdb-&gt;posts
                                    WHERE `post_parent` = '$parent_page_ID' AND `post_type` = 'page' AND `post_status` = 'publish'
                                    ORDER BY `post_date` DESC $limit");

    if(!$ignore_more)
    {
        foreach($subpages as $key=&gt;$subpage)
            if(strpos($subpage-&gt;post_content, '&lt;!--more--&gt;') !== false)
            {
                $short_content = explode('&lt;!--more--&gt;', $subpage-&gt;post_content, 2);
                $subpages[$key]-&gt;post_content = $short_content[0] . '&lt;a href="' . get_permalink($subpage-&gt;ID) . '"&gt;Read more...&lt;/a&gt;';
            }
        }
    }

    return $subpages;
}

function wpascms_get_parent_page_ID($parent_page)
{
    global $wpdb;

    $id = $wpdb-&gt;get_var($wpdb-&gt;prepare("SELECT ID FROM $wpdb-&gt;posts WHERE `post_name` = %s AND `post_type` = 'page' AND `post_status` = 'publish'", $parent_page));

    return $id;
}

?&gt;
</pre>
<p>The first function, <code>wpascms_get_subpages()</code> returns the given number of subpages from a specific parent page. By default it will break the content on the &lt;!--more--&gt; tag and append a "Read more..." link. The first parameter can be either a string containing the slug of the parent page, or the ID of the parent page. The second parameter is the number of subpages we want returned. If it's zero, all subpages will be returned. The second function is merely a helper function, to get the id of the parent page based on it's slug. To read more on querying the database, <a href="http://codex.wordpress.org/Function_Reference/wpdb_Class">read this page</a>.</p>
<p>Here's how I'm calling this function on my example Home page:</p>
<pre name="code" class="php">
&lt;?php
/*
Template name: Home
*/

get_header();
?&gt;

    &lt;div id="home"&gt;
    &lt;?php if (have_posts()) : while (have_posts()) : the_post(); ?&gt;

        &lt;h2&gt;&lt;?php the_title(); ?&gt;&lt;/h2&gt;

        &lt;?php the_content('&lt;p class="serif"&gt;Read the rest of this page &raquo;&lt;/p&gt;'); ?&gt;

    &lt;?php endwhile; endif; ?&gt;
    &lt;/div&gt;&lt;!-- home --&gt;

    &lt;div id="latest_works"&gt;
    &lt;h1&gt;Recent work&lt;/h1&gt;
    &lt;?php $subpages = wpascms_get_subpages();
    if(count($subpages) &gt; 0):
        foreach($subpages as $row=&gt;$subpage):
        if($row%2 == 0)
        {
            $class = "left_work";
        }
        else
        {
            $class = "right_work";
        }
    ?&gt;
        &lt;div class="&lt;?php echo $class; ?&gt;"&gt;
            &lt;h2&gt;&lt;a href=&lt;?php echo get_permalink($subpage-&gt;ID); ?&gt;&gt;&lt;?php echo $subpage-&gt;post_title; ?&gt;&lt;/a&gt;&lt;/h2&gt;
                &lt;?php echo $subpage-&gt;post_content; ?&gt;
        &lt;/div&gt;
    &lt;?php
        endforeach;
    endif;
    ?&gt;
    &lt;/div&gt;&lt;!-- latest_works --&gt;

&lt;?php
get_footer();
?&gt;
</pre>
<p>In words: including the header, then showing any content of the home page. After that getting the subpages: by default, <code>wpascms_get_subpages()</code> is getting the newest 2 subpages of the portfolio page. I'm showing the content of the subpages in 2 columns. What we got with this? Add a new subpage to the portfolio and it will automagically show up on the left side column. In the end, including the footer.</p>
<p>Here's another example from the portfolio page:</p>
<pre name="code" class="php">
&lt;?php
/*
Template name: Portfolio
*/

get_header();
?&gt;

    &lt;div id="portfolio"&gt;
    &lt;?php if (have_posts()) : while (have_posts()) : the_post(); ?&gt;

        &lt;h2&gt;&lt;?php the_title(); ?&gt;&lt;/h2&gt;

        &lt;?php the_content('&lt;p class="serif"&gt;Read the rest of this page &raquo;&lt;/p&gt;'); ?&gt;

    &lt;?php endwhile; endif; ?&gt;
    &lt;/div&gt;&lt;!-- home --&gt;

    &lt;div id="latest_works"&gt;

    &lt;?php $subpages = wpascms_get_subpages('portfolio', 0);
    if(count($subpages) &gt; 0):
        foreach($subpages as $row=&gt;$subpage):
    ?&gt;
        &lt;div class="work"&gt;
            &lt;h2&gt;&lt;a href=&lt;?php echo get_permalink($subpage-&gt;ID); ?&gt;&gt;&lt;?php echo $subpage-&gt;post_title; ?&gt;&lt;/a&gt;&lt;/h2&gt;
                &lt;?php echo $subpage-&gt;post_content; ?&gt;
        &lt;/div&gt;
    &lt;?php
        endforeach;
    endif;
    ?&gt;
    &lt;/div&gt;&lt;!-- latest_works --&gt;

&lt;?php
get_footer();
?&gt;
</pre>
<p>Same thing is happening here: including the header, showing the content of the portfolio page. Getting the subpages, but now all of the subpages that are childs of the portfolio page, and showing them one under the other.</p>
<p>All subpages can be viewed each on it's own page, but that is just a plain ol' page.php file, so I'll skip that.</p>
<h2>And now something completely different</h2>
<p>I made a screencast to show this in action. Please forgive me on my bad accent. This will just show how much I suck in speaking English. Oh, well.</p>
<div style="text-align:center;"><object width="400" height="304"><param name="allowfullscreen" value="true" /><param name="allowscriptaccess" value="always" /><param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=3631432&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=F7E98C&amp;fullscreen=1" /><embed src="http://vimeo.com/moogaloop.swf?clip_id=3631432&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=F7E98C&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="400" height="304"></embed></object><br /><a href="http://vimeo.com/3631432">Wordpress as CMS</a> from <a href="http://vimeo.com/robertbasic">Robert Basic</a> on <a href="http://vimeo.com">Vimeo</a>.</div>
<p>Don't limit yourself to the existing plugins or waiting for one tutorial/example that will show how you can make everything. Don't be afraid to get your hands dirty by hacking some code. It really doesn't take too much to create magic with Wordpress ;)</p>
<p>Cheers!</p>
