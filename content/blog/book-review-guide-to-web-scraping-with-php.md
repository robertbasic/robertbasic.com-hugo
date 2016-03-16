+++
date = "2011-05-25T19:38:12+02:00"
title = "Book review - Guide to Web Scraping with PHP"
slug = "book-review-guide-to-web-scraping-with-php"
description = "My book review on Matthew Turland's \"Guide to Web Scraping with PHP\""
tags = ["about", "book", "php", "review", "web scraping"]
categories = ["Development", "Programming"]
+++
It took me a while to grab myself a copy of <a href="http://matthewturland.com/">Matthew Turland's</a> "<a href="http://www.phparch.com/books/phparchitects-guide-to-web-scraping-with-php/">Guide to Web Scraping with PHP</a>", but a few weeks ago a copy finally arrived and I had the pleasure of reading it. I planned to buy it right as the print copy was announced, but then realised that php|arch accepts only PayPal as the payment method, which doesn't work from Serbia, so I had to postpone the shopping for some better times. Fast forward 5-6 months and I found a copy on the Book Depository, which has no shipping costs! Yey!

My overall impression of the book is that it was worth the time and I'm really glad that I bought it. Matthew did a great job explaining all the tools we have at our disposal for writing web scrapers and how to use them. The chapter on HTTP at the beginning and a chapter with some tips and tricks at the end of the book, fit in great with the rest of the chapters, which are full of code examples. For the first reading, I'd recommend reading the book cover to cover, to get an overall view of all the tools presented, but later the chapters can be read independently.

As I said, the first chapter (actually, the second one, the first one is the introductory chapter :p), deals with the HTTP, especially with the parts of it which are needed for understanding, using and creating web scrapers.

The book then continues on different client libraries we can use to send HTTP requests and receive responses. Libraries like cURL or Zend_Http_Client are explained, but it is also explained how one can create his own using streams (the author does note that you'd be better of with an existing one!). For each of the tools it is described, how to handle things like authentication, redirects and timeouts, amongst others...

The second part of the book deals with preparing the documents for, and with the actual parsing of the data from these documents. Again, different tools are presented and explained, which one to use when and why. If none of the parsing tools can help, a most essential overview of the PCRE extension is given, too.

The book is finished with a nice "Tips and Tricks" chapter, which discusses real-time vs batch job scrapers, how to work with forms, the importance of unit testing... IMHO, without this last chapter, the book would not be finished.

I'm thinking hard right now, what bad things could I say about this book, but I can't think of any. It is a guide, clear and straight-to-the-point, explaining what tools are there, which one to use and how for writing scrapers and that's exactly what I wanted to know.

Yep, I'd recommend this book to anyone interested in web scraping with PHP :)
