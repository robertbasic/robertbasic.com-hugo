+++
type = "page"
layout = "talks"
title = "Talks"
+++


Another way I like to share knowledge is by giving talks. If you'd like to hear one of these talks at your local user group, conference, or company, please get in touch by sending an email to <a href="mailto:contactme@robertbasic.com">contactme@robertbasic.com</a>!
* <a href="#all-aboard-the-service-bus">All aboard the Service Bus</a>
* <a href="#build-your-career-one-contribution-at-a-time">Build your career one contribution at a time</a>
* <a href="#introddduction">introDDDuction</a>
* <a href="#easier-mocking-with-mockery">Easier mocking with Mockery</a>
* <a href="#code-profiling-with-xdebug-and-kcachegrind">Code profiling with Xdebug and KCachegrind</a>

<h2>
<a title="All aboard the Service Bus" id="all-aboard-the-service-bus" style="text-decoration: none;">All aboard the Service Bus</a>
</h2>
We deal with complicated and complex applications on a daily basis, codebases that are filled with classes that do too many things. One design pattern that can help us with this is CQRS, Command Query Responsibility Seggregation. The idea behind CQRS is to split our models in two - the Command for writing, and the Query for reading. Applying CQRS can lead us to a more maintainable code, code that follows the SOLID principles more closely.

At the heart of CQRS lies the Service Bus - a transport mechanism responsible for dispatching our command, event, and query messages to their destinations.
This talk will give an overview of the CQRS pattern and take a closer look at the different types of service buses - command, event, and query ones. Main takeaway will be practical information on why, when, and how to use them, with emphasis on their differences. We'll also take a look at some of the PHP libraries out there that help us work with service buses like Simple Bus, Tactician, to name a few.

<h2>
<a title="Build your career one contribution at a time" id="build-your-career-one-contribution-at-a-time" style="text-decoration: none;">Build your career one contribution at a time</a>
</h2>

You can often hear things like:

* "You should start contributing to an open source project!"
* "Why don't you just send a pull request?"
* "Doing OSS stuff will be great for your career."

from experienced developers.
While indeed it can be a great for a programmer's career, going down the open source contributor's path can be daunting. As a seasoned open source contributor, I'd like to share some tips and tricks on how to become a contributor, and how you and your company can benefit from it.
I want to show that there's much more to contributing than "just" sending pull requests — answering questions, blogging, testing, and more, are all important parts of open source contributions.

<h2>
<a title="introDDDuction" id="introddduction" style="text-decoration: none;">introDDDuction</a>
</h2>

Our clients come to us to solve their problems using software. We listen to their pitch, we read their emails, have a meeting or two, and then we take out our favourite code editor, framework and database, and start pounding at the keyboard. Few weeks, months later, we come back with a solution to all of their problems. Or is it, really?
Our solutions should be driven by our clients and what they really need. We need to listen to them, talk to them, understand them.
This presentation will show why we should become better communicators, and how we can use Domain Driven Design to bridge this communication gap. Creating an ubiquitous language that we share with our clients, we model their world in ours. These models live in bounded contexts, made out of aggregate roots, domain events, entities, value objects, that are all here to guide us to create better solutions, and write better software.

<h2>
<a title="Easier mocking with Mockery" id="easier-mocking-with-mockery" style="text-decoration: none;">Easier mocking with Mockery</a>
</h2>

A slow suite of unit tests can prevent us from running it frequently. A complicated and complex dependency graph of our system under test can prevent us from writing tests in the first place.
One way to tackle these problems is to create test doubles with Mockery, a mock object framework, that will stand in for these dependencies and ensure a faster test suite.
This talk will give an overview of test doubles - fakes, stubs, mocks, and spies - and how to use Mockery to create them. We'll learn about handling method calls, matching arguments, mocking static instances and hard dependencies. All that regardless of the testing framework of your choice - Mockery is here to help.

<h2>
<a title="Code profiling with Xdebug and KCachegrind" id="code-profiling-with-xdebug-and-kcachegrind" style="text-decoration: none;">Code profiling with Xdebug and KCachegrind</a>
</h2>

An intuitive user interface, good design, useful features, are all focused on providing the best experience to the users of our applications. An equaly important, but often neglected, aspect of the user experience is the speed of the application. It affects how users see the company behind the application and has direct impact on the conversion rate of web sites. It can make or break a business.

Profiling tools are here to help us identify the performance issues, to find the points when and where our applications eat up the CPU and start leaking memory.

We'll look at a handful of tools that are at our disposal: Xdebug, KCachegrind, xhprof, Blackfire.io, Tideways.io. A more in-depth example will show how Xdebug and KCachegrind were used to solve real-world performance issues, teaching the audience the basics of profiling web applications, as well as providing tips and advice on how to quickly become productive using these two tools.