+++
draft = false
date = 2017-10-24T07:58:37+02:00
title = "I think I understand bounded contexts"
slug = "i-think-i-understand-bounded-contexts"
description = ""
tags = ["ddd", "bounded contexts", "models", "modeling", "business"]
categories = ["Programming", "Development", "Blablabla"]
2017 = ["10"]
+++

Earlier this year I started reading **the** DDD book by Eric Evans. Together with the Eventsourcery videos from Shawn McCool, the first three chapters of the book were... easy to understand, even.

Lots of "A-ha!" and "Oh!" moments, followed by "That makes perfect sense." statements, and a couple of excited "I knew that!"-ones.

Then I got to the chapter with the bounded contexts. I read the first few pages, thought about them... Then read them again, and thought some more. Then I put the book back on the shelf for a few months.

Last night I read it again, and then...

## Click!

A bounded context is a point of view.

A bounded context defines how **a section of a business** sees, thinks, talks about a subject that is important to that section of the business. And we represent that business subject with a model.

That same business subject can be present in different sections of a business, but every section views it differently. To some extent, at least.

That is the reason why the **context** of a model is important &mdash; we need to know how to model a subject for that specific business section.

And we need to put **boundaries** on those models &mdash; we must prevent the mixing of, what might seem same, models between these contexts.

## A book is a book, right?

Depends on who you ask.

<a href="/img/posts/bounded-context-books-big.jpg"><img src='/img/posts/bounded-context-books-small.jpg' style='float:right;padding-left: 5px;'></a>

If you ask a publisher, a book has a title, a writer, a cost, a price, and a category.

If you ask a seller, a book has a title, a writer, a cost, a price, and a category.

They talk about the same things, right?

For a publisher a book has a working title, and a published title. For a seller a book has a title.

For a publisher a book has a writer, who needs to be payed. For a seller a book has a writer, which is just a name on the front cover of the book.

For a publisher the cost of a book includes the cost of the writer, the editor, the designer, the printing, the binding. For a seller the cost of a book includes the buying price, maybe some discounts from the publisher on the quantity purchased, the paychecks of the store clerks, bills for running the store, taxes...

For a publisher the price includes the producing cost plus the profit they want to make. For a seller the price includes the buying cost plus the profit they want to make, and maybe some discounts they want to give to buyers.

For a publisher the category can be fiction and non-fiction books. For a seller the category can be epic fantasy, sci-fi, horror, thriller, programming, design, recipe books...

See where am I going with this?

Depending on the point of view, depending on the **context**, the same book can mean two different things for two different business sections in the business of selling books. Even if at first we might think there is no difference, once we start talking to the business people, these differences will pop-up.

We should also respect the **boundaries** between these two contexts, so that we always know about what cost or what price we are talking about.

Otherwise, the seller would quickly run out of business if they'd sell books at the publisher's price.

## This is just a model

Of course, there is more to bounded contexts, models, DDD, etc., than what I wrote here.

More to read, more to learn, more to think, more to write.

Happy hackin'!
