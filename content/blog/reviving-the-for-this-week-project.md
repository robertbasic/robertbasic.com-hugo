+++
slug = "reviving-the-for-this-week-project"
description = "Time to revive a neglected project and put it live."
tags = ["for this week", "current state", "revive"]
categories = ["Programming", "Development"]
draft = false
date = 2020-12-12T12:50:04+01:00
title = "Reviving the ForThisWeek project"
+++

Way back in the summer of 2018 I've started a project called "ForThisWeek". It's nothing more than a glorified to-do application. I've used it mainly to learn more about some of the Domain-Driven Design concepts. Looking at the commit history, I've worked on it in the summer of 2018, then from November 2018 till May 2019, and then again from November 2019 till mid December 2019. Apparently I've put a decent amount of work in it, so if I want to have a side project live, this one's a good candidate.

The idea for the project came from how I organize my life around [a weekly to-do list](https://robertbasic.com/blog/a-weekly-to-do/):

> Every Monday morning I write down what I need and want to do during the week. [...]  If something pops up during the week I add it to the list. If something gets “obsolete”, cross it off. Every item gets a dot in front of it, just like with bullet journaling. Once it’s done I turn that dot into a plus and write down the date.
> 
> Next Monday I tally the previous week by writing down the to-do vs. done ratio. For any items left over from the previous week I turn the dot into a greater than sign and move it over to the new week and add new items to the list. If a task list “overflows” for 3 weeks in a row I strike it through and move it a Trello board.

As I said, a glorified to-do app.

Before I dive into hacking away on it again, I think I need to do an "inventory" of it first. What's done, what needs to be done before pushing it live, what can wait after going live...

## Current state

The commit history is a mess. Apparently it wasn't enough to learn about DDD on this project, I also wanted to learn about Vue.js and building a single page application. I removed the whole SPA stuff and went back to good ol' Twig templating and server side rendering. At least I got a blog post on [reusable Vue.js components](https://robertbasic.com/blog/vue-js-reusable-components/) out of it.

Then there are commits related to me changing my mind on the design, a pull request titled "Code reorganization" with zero context around it why I did that, updating Symfony to 4.0.0 if I look at the commit message, but it's actually updating from 4.3.8 to 4.4.0... Oops. And then there's a bunch of commits that try to make it work on Heroku, as that's the environment where I had it "live" for a brief moment. I should actually check what's up with my Heroku account, hopefully there's nothing on there that charges my credit card.

So as you can tell, a fair bit of neglect is going on on this project.

The development environment is dockerized, so that's good. There's good test coverage with both unit tests and acceptance/feature tests. Documentation is **amazing** for a neglected pet project. The readme file is detailed with ideas, steps to take next, there's even a diagram:

<img src="/img/posts/fwtflow.png">

I'm so happy right now that I invested that time in the beginning.

The `Makefile` has nice targets for the development environment, for running unit tests, [PHPStan analysis](https://phpstan.org/user-guide/getting-started), migrations...

## What to do next?

As for the codebase itself, I have the option to start over or use what's there. I would be crazy to start over, even though I could reuse the core logic from it, as is.

The UI is better than I remember it. Looks like it doesn't need a lot of work. I've bought the [TailwindUI kit](https://tailwindui.com/) and maybe I'll use some of the components from there. Good news is that the CSS is already done with [TailwindCSS](https://tailwindcss.com/).

<img src="/img/posts/ftw-ui.png">

I will host it on a Linode server, so I have to remove and undo all the changes I did to make it "runnable" on Heroku.

It runs on PHP 7.2, I should at least bump it up to PHP 7.4. That should be an efortless change. Not sure if I want to go up to PHP 8.0? I might try it and see where it leads me.

I have opened 7 issues on GitHub, so that's a good list of what needs to be done. In the readme file there's a "Feature list" which also has some items that still wait on being done.

So, to sum up:

- Start the project locally, run the tests, run the application, see how much of it is broken due to "bit rot"
- Remove and undo all the Heroku specific changes
- Set up a staging environment on the linode server
- Deploy to staging server as is
- Automate the process of deploying to the staging server
- Update to PHP 7.4
- Update project dependencies

After these things are done, I think I can go back to the issues and features that need to be fixed and implemented, and see from those which ones are required for launch, which ones can be done after.

Happy hackin'!
