+++
date = "2008-10-06T08:09:02+02:00"
title = "Wordpress paging navigation"
slug = "wordpress-paging-navigation"
description = "An example of a Wordpress paging navigation without a plug-in"
tags = ["example", "navigation", "php", "wordpress"]
categories = ["Development", "Programming", "Software"]
+++
As I'm not a big fan of Wordpress plug&#151;ins, and I wanted to use a normal page navigation, not just the default &#147;Previous posts&#148; and &#147;Next posts&#148;, I decided to play around a bit and create my own paging navigation, or pagination.

<h2>Preparation</h2>

First, I wrote on a piece of paper which links I need: first page, last page, next page, previous page and the links with the page numbers. Next, I needed to see what functions are already in Wordpress, to reuse as much as I can. After a little searching, I found that the functions for the default navigation are located in the <code>link-template.php</code> file, under the <code>wp-includes</code> folder. There are the functions for the next and previous pages, and the function that creates the URL. Furthermore, I wanted a sliding pagination (like Yahoo has on it's search page), 'cause it's easy to use and looks cool.

<h2>The function</h2>

So, let's take a look at the code. I called the function simply <code>get_pagination</code>; it's quite self&#151;describing. I put it in the <code>link-template.php</code> file, that way, all functions for navigation are in one place.

{{< highlight php >}}
<?php
/**
* A pagination function
* @param integer $range: The range of the slider, works best with even numbers
* Used WP functions:
* get_pagenum_link($i) - creates the link, e.g. http://site.com/page/4
* previous_posts_link(' &laquo; '); - returns the Previous page link
* next_posts_link(' &raquo; '); - returns the Next page link
*/
function get_pagination($range = 4){
  // $paged - number of the current page
  global $paged, $wp_query;
  // How much pages do we have?
  if ( !$max_page ) {
    $max_page = $wp_query->max_num_pages;
  }
  // We need the pagination only if there are more than 1 page
  if($max_page > 1){
    if(!$paged){
      $paged = 1;
    }
    // On the first page, don't put the First page link
    if($paged != 1){
      echo "<a href=" . get_pagenum_link(1) . "> First </a>";
    }
    // To the previous page
    previous_posts_link(' &laquo; ');
    // We need the sliding effect only if there are more pages than is the sliding range
    if($max_page > $range){
      // When closer to the beginning
      if($paged < $range){
        for($i = 1; $i <= ($range + 1); $i++){
          echo "<a href='" . get_pagenum_link($i) ."'";
          if($i==$paged) echo "class='current'";
          echo ">$i</a>";
        }
      }
      // When closer to the end
      elseif($paged >= ($max_page - ceil(($range/2)))){
        for($i = $max_page - $range; $i <= $max_page; $i++){
          echo "<a href='" . get_pagenum_link($i) ."'";
          if($i==$paged) echo "class='current'";
          echo ">$i</a>";
        }
      }
      // Somewhere in the middle
      elseif($paged >= $range && $paged < ($max_page - ceil(($range/2)))){
        for($i = ($paged - ceil($range/2)); $i <= ($paged + ceil(($range/2))); $i++){
          echo "<a href='" . get_pagenum_link($i) ."'";
          if($i==$paged) echo "class='current'";
          echo ">$i</a>";
        }
      }
    }
    // Less pages than the range, no sliding effect needed
    else{
      for($i = 1; $i <= $max_page; $i++){
        echo "<a href='" . get_pagenum_link($i) ."'";
        if($i==$paged) echo "class='current'";
        echo ">$i</a>";
      }
    }
    // Next page
    next_posts_link(' &raquo; ');
    // On the last page, don't put the Last page link
    if($paged != $max_page){
      echo " <a href=" . get_pagenum_link($max_page) . "> Last </a>";
    }
  }
}
{{< /highlight >}}

The &#147;range&#148; is the range of the sliding effect, i.e. how many numbers are shown besides the current number: if the range is 4, and the current page is 5, then the numbers 3, 4, 5, 6 and 7 are visible.

<h2>Usage</h2>

It's quite simple to use it: where the pagination is needed, just call the <code>get_pagination()</code> function, and it will show up. Add some CSS style to it, and your good to go.

Hope someone will find this useful :)
