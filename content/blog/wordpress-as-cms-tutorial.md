+++
date = "2009-03-14T11:00:36+02:00"
title = "Wordpress as CMS tutorial"
slug = "wordpress-as-cms-tutorial"
description = "An example how to transform Wordpress into a complete CMS."
tags = ["blog", "cms", "example", "hack", "php", "tutorial", "wordpress"]
categories = ["Development", "Programming", "Software"]
+++
<a href="http://wordpress.org/">Wordpress</a> is one of the best blogging platforms out there &#151; if not the best. It's very powerful, can be easily extended and modified. It's <a href="http://codex.wordpress.org/Main_Page">documentation</a> is very well written and, so far, had answer to all of my crazy questions :)

You know what's the best part of Wordpress? With some knowledge of PHP and MySql, you can turn it into much more than just a blogging platform. After doing some HTML to WP work for <a href="http://twitter.com/styletime">Roger</a>, I thought of one way how could Wordpress be transformed into a CMS. Note the &#147;one way&#148;. This is not the only way for doing this, and, most likely, not the best way.

I didn't look much, but I think that there are some nice plugins out there that can do this. But, where's the fun in the download, upload, activate process? Nowhere!

I will show you how to change your Wordpress into a CMS and it really doesn't take much coding to achieve this! The example presented here is <strong>simple</strong> and will have a static page for it's home page, another static page for the &#147;Portfolio&#148; page and the blog. The home and portfolio page will have some of own content and both will include some content from other static pages. You all most likely know the blog part ;)

<h2>Static pages</h2>

Things you should know: each static page has it's title, it's slug or name (the thing that shows up in your browsers address bar: http://example.com/portfolio/ - right there, the portfolio is the slug!), has the parent attribute and the template attribute. The parent attribute is used when it's needed to make one page a child of another, i.e. to show Page2 as a subpage of Page1. The template attribute is used when we want to apply some different layout and styling to a static page. Read more about <a href="http://codex.wordpress.org/Pages">static pages</a> and how to create your own <a href="http://codex.wordpress.org/Pages#Creating_Your_Own_Page_Templates">page templates</a>.

<!--more-->

If you want to, you can download the theme I created for this tutorial from <a href="http://robertbasic.com/downloads/wpascms.zip">here</a> (it's not a designers masterpiece, what did you expect?), or you can use any theme you want.

I hope you read the part on <a href="http://codex.wordpress.org/Pages#Creating_Your_Own_Page_Templates">creating page templates</a>, I really don't feel like explaining the next part.

Create 3 new files in your template directory (if you're using my theme, these files are already there): home.php, portfolio.php and blog.php. Contents of these files are:

{{< highlight php >}}
// home.php
<?php
/*
Template Name: Home
*/
?>

// portfolio.php
<?php
/*
Template Name: Portfolio
*/
?>

// blog.php
<?php
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
?>
{{< /highlight >}}

To understand the contents of the blog.php file, please take a look at <a href="http://codex.wordpress.org/Making_Your_Blog_Appear_in_a_Non-Root_Folder">this</a>.

Now, go to the dashboard, the Pages section and write 3 new static pages:

<ul>
<li>Home, with the slug home, for the template choose Home from the drop-down list (it's on the right side) and the parent leave as is (Main Page)</li>
<li>Portfolio, with the slug portfolio, for the template choose Portfolio</li>
<li>Blog, with the slug blog, for the template choose Blog</li>
</ul>

You can add some content to the Home and Portfolio pages, but don't add any to the Blog page.

<h2>Organizing links</h2>

Now, let's make that when we are on http://example.com/ it shows us the Home page, instead of the Blog, and when on the http://example.com/blog/ to show us the blog!

Go to Settings->Reading and where it says "First page displays" choose "A static page", and under the "Front page" drop-down choose "Home".

Now, go to Settings->Permalinks and change the "Custom structure" to <code>/blog/%postname%/</code> or whatever is your preferred permalinks structure, but it must start with <code>/blog/</code>! If Wordpress can't write to your .htaccess file (I hope it can't!), open it up in your editor and type the following (or similar, depends on your setup):

{{< highlight php >}}
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /blog/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
{{< /highlight >}}

The point is in the <code>RewriteBase</code>, with that we're telling WP where to find the blog. On default setups, when http://example.com/ points to the blog, the RewriteBase is simply / but with the blog located at http://example.com/blog/ we need to change the RewriteBase. If all is well, we're done with organizing the links.

While you're still in the dashboard, write some new static pages with content. For the parent of these pages choose Portfolio and leave the template the default (the default page template is page.php).

<h2>Time for coding!</h2>

Here are two functions I wrote for retrieving content from static pages which will be then included in other static pages:

{{< highlight php >}}
// functions.php
<?php

/**
* Gets last $number_of_subpages from their $parent_page
* If the <!--more--> tag is ignored ($ignore_more=true) returns the entire content of the subpages
*
* @param mixed $parent_page Contains either the slug of the parent page or it's ID
* @param integer $number_of_subpages Number of subpages to return
* @param boolean $ignore_more Whether to ignore the <!--more--> tag or not
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
    $subpages = $wpdb->get_results("SELECT * FROM $wpdb->posts
                                    WHERE `post_parent` = '$parent_page_ID' AND `post_type` = 'page' AND `post_status` = 'publish'
                                    ORDER BY `post_date` DESC $limit");

    if(!$ignore_more)
    {
        foreach($subpages as $key=>$subpage)
            if(strpos($subpage->post_content, '<!--more-->') !== false)
            {
                $short_content = explode('<!--more-->', $subpage->post_content, 2);
                $subpages[$key]->post_content = $short_content[0] . '<a href="' . get_permalink($subpage->ID) . '">Read more...</a>';
            }
        }
    }

    return $subpages;
}

function wpascms_get_parent_page_ID($parent_page)
{
    global $wpdb;

    $id = $wpdb->get_var($wpdb->prepare("SELECT ID FROM $wpdb->posts WHERE `post_name` = %s AND `post_type` = 'page' AND `post_status` = 'publish'", $parent_page));

    return $id;
}

?>
{{< /highlight >}}

The first function, <code>wpascms_get_subpages()</code> returns the given number of subpages from a specific parent page. By default it will break the content on the <!--more--> tag and append a "Read more..." link. The first parameter can be either a string containing the slug of the parent page, or the ID of the parent page. The second parameter is the number of subpages we want returned. If it's zero, all subpages will be returned. The second function is merely a helper function, to get the id of the parent page based on it's slug. To read more on querying the database, <a href="http://codex.wordpress.org/Function_Reference/wpdb_Class">read this page</a>.

Here's how I'm calling this function on my example Home page:

{{< highlight php >}}
<?php
/*
Template name: Home
*/

get_header();
?>

    <div id="home">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

        <h2><?php the_title(); ?></h2>

        <?php the_content('<p class="serif">Read the rest of this page &raquo;</p>'); ?>

    <?php endwhile; endif; ?>
    </div><!-- home -->

    <div id="latest_works">
    <h1>Recent work</h1>
    <?php $subpages = wpascms_get_subpages();
    if(count($subpages) > 0):
        foreach($subpages as $row=>$subpage):
        if($row%2 == 0)
        {
            $class = "left_work";
        }
        else
        {
            $class = "right_work";
        }
    ?>
        <div class="<?php echo $class; ?>">
            <h2><a href=<?php echo get_permalink($subpage->ID); ?>><?php echo $subpage->post_title; ?></a></h2>
                <?php echo $subpage->post_content; ?>
        </div>
    <?php
        endforeach;
    endif;
    ?>
    </div><!-- latest_works -->

<?php
get_footer();
?>
{{< /highlight >}}

In words: including the header, then showing any content of the home page. After that getting the subpages: by default, <code>wpascms_get_subpages()</code> is getting the newest 2 subpages of the portfolio page. I'm showing the content of the subpages in 2 columns. What we got with this? Add a new subpage to the portfolio and it will automagically show up on the left side column. In the end, including the footer.

Here's another example from the portfolio page:

{{< highlight php >}}
<?php
/*
Template name: Portfolio
*/

get_header();
?>

    <div id="portfolio">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>

        <h2><?php the_title(); ?></h2>

        <?php the_content('<p class="serif">Read the rest of this page &raquo;</p>'); ?>

    <?php endwhile; endif; ?>
    </div><!-- home -->

    <div id="latest_works">

    <?php $subpages = wpascms_get_subpages('portfolio', 0);
    if(count($subpages) > 0):
        foreach($subpages as $row=>$subpage):
    ?>
        <div class="work">
            <h2><a href=<?php echo get_permalink($subpage->ID); ?>><?php echo $subpage->post_title; ?></a></h2>
                <?php echo $subpage->post_content; ?>
        </div>
    <?php
        endforeach;
    endif;
    ?>
    </div><!-- latest_works -->

<?php
get_footer();
?>
{{< /highlight >}}

Same thing is happening here: including the header, showing the content of the portfolio page. Getting the subpages, but now all of the subpages that are childs of the portfolio page, and showing them one under the other.

All subpages can be viewed each on it's own page, but that is just a plain ol' page.php file, so I'll skip that.

Don't limit yourself to the existing plugins or waiting for one tutorial/example that will show how you can make everything. Don't be afraid to get your hands dirty by hacking some code. It really doesn't take too much to create magic with Wordpress ;)

Cheers!
