+++
draft = false
date = 2018-03-20T08:27:37+01:00
title = "Bounded contexts and subdomains"
slug = "bounded-contexts-and-subdomains"
description = ""
tags = ["ddd", "bounded context", "modeling", "business", "subdomain", "core domain"]
categories = ["Programming", "Development", "Blablabla"]
2018 = ["03"]
+++

Back in October last year I wrote that [I thought I understood bounded contexts](/blog/i-think-i-understand-bounded-contexts/), what they are and why we need them. Ever since realizing that a bounded context is a boundary of how a business sees a specific subject within a section of that business, learning anything and everything DDD became a lot easier.

I see bounded contexts as a big building block without which learning other parts of DDD is pretty much pointless. OK, pointless might be too harsh a word, but to be able to use entities, value objects, domain events, aggregates to their full potential, a good understanding of bounded contexts is needed.

Of course I didn't stop learning about DDD since writing that post 5 months ago. If anything, I did my best to learn even more by reading books and articles, watching recorded conference talks, and thinking about this subject. A lot.

### Uh, phrasing

In my previous post I had [this image attached](/img/posts/bounded-context-books-big.jpg) that I used to help explain the difference between a Book in two different bounded contexts. Recently I realized that that image has mistake in it. On that image I used the terms "Publisher" and "Seller" to distinguish the two bounded contexts. A better name for those would probably be "Publishing" and "Selling".

It is important to get the naming right as it affects the understanding a great deal. It might not be an outright mistake, but a bounded context is probably better off *not* being named after a thing. Publisher, seller, warehouse, these are the things we model inside our bounded contexts. A bounded context should name **in what context** do these models apply: publishing, selling, warehousing. Properly naming a bounded context will also help to identify should a model of something be an aggregate (root), an entity, or a value object.

There are probably other things I got wrong in that post, but so far I see this naming issue as the biggest one.

### What about subdomains?

One thing I didn't know and understand when I was writing the previous post was the importance of (sub)domains **in connection** with bounded contexts. I'm still not 100% sure I do. A business operates within a domain and that's what we're trying to design and model with DDD. It has one core domain which represents the reason why the business exists in the first place and at least one more subdomain that supports that core domain. The core domain is the main problem a business is trying to solve and the subdomains are all the other problems that come along with trying to solve the core domain problem.

Vaughn Vernon in his ["Implementing Domain-Driven Design"](https://www.goodreads.com/book/show/15756865-implementing-domain-driven-design) book states (I'm paraphrasing here a bit) that "the subdomains live in the problem space and the bounded contexts in the solution space". It took me a while to really understand this and what the implications of it are.

When writing software that will support the business and help solving the problems coming from the core domain and supporting subdomains we create models. These models will be "fine tuned" so that they provide the most optimal solution for the problem. But to provide these solutions, we also need to say what is the context of these models in which they help solve the problem.

Imagine a software that is being developed to support a dentist. A dentist has two problems: fixing patients' teeth and making appointments for the patients. Fixing teeth is the core domain and making appointments is a supporting subdomain. In the core domain the medical staff cares about a patient's dental history, can they handle general anesthesia or not, what their current problem is, etc. In the subdomain the staff (not necessarily medical staff) cares about a patient's contact information, a date and a time that best suits both the doctor and the patient, the type of dental work needed, etc. Both domains need a model of a patient, but that model will depend on the bounded context we put in place to ensure the correct information and features are available when solving the problems of each domain.

Subdomains and bounded contexts go hand in hand and I think **one can't be understood without the other**. The optimal solution would be to have one bounded context in one subdomain. The world is not a perfect place, software even less so, so it might happen that one bounded context spans multiple subdomains, or that one subdomain has multiple bounded contexts.

### Problems and solutions

A key element to DDD is that our understanding of the domain will constantly change, *improve*, as we learn more about it. That's one of the reasons why we need to be ready to change or throw away models we came up with. This ever-evolving state means that the subdomains and the bounded contexts can and will change, too.

A bounded context can grow or shrink, split in two, be combined in one, regardless of the subdomain(s) it is in. Taking a different approach in solving a problem doesn't mean that the problem itself has changed.

On the other hand if the problem changes, **the solution should change too**. If during development we realize that the core domain can be further split into a smaller, more focused core domain and a new subdomain then the solution to those problems should change. Most likely the models we developed don't fit the problems any more and the boundaries around our contexts have moved.

### This post has evolved, too

Initially this wasn't the post I wanted to write. I did start writing about bounded contexts, but then I realized I can't talk about them without talking about subdomains. Both the title and the contents changed at least 3 times. More topics to cover in the future I guess.

Happy hackin'!
