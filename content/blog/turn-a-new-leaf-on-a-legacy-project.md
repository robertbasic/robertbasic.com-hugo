+++
draft = false
date = 2020-11-12T06:33:39+01:00
title = "Turn a new leaf on a legacy project"
slug = "turn-a-new-leaf-on-a-legacy-project"
description = "A legacy project can be turned around for the better with proper care and patience."
tags = ["legacy", "communication", "improvement"]
categories = ["Legacy", "Software", "Programming"]
2020 = ["11"]
+++

Working on a legacy project can be a chore. Fighting the same old problems over and over again, adding new features takes ages, seems like every time we fix one bug, we uncover three others. Sounds like wishful thinking, but I know it can be better.

It takes time though. If we neglect a codebase for years, we can’t make it into a spotless example of computer science in two sprints. Not even two months. Hell, it will never be perfect. There will always be an obscure feature that nobody wants to touch. With steady progress it will be better. Commit after commit, week after week, the **application will improve**. Everyone will be happier to use it and work with it.

## Understanding is key

We need to understand why are we writing and maintaining software. To **solve problems** for the users, and **make money** for the stakeholders. That doesn’t mean we have to focus only on the features that generate money. There are things that affect the application’s end result indirectly as well.

We need to understand why is the application in the state it is in. Lack of rules. People coming and going. Attempts at rewrites. Crazy deadlines. Stakeholders changing their minds half a day before going live. Not knowing better. Poorer tools at the time of writing. Developers who can’t say “no”.

## Set the foundations

How do we make this legacy application better? We can start with different tasks that won’t show immediately their worth, but will pay off in the long run:
- A conversation with the business to make an “inventory” of the application's features
- Introduce a version control system for the code
- Create a reproducible development environment
- Introduce a coding standard
- Introduce a suite of automated tests
- Use a 3rd party package manager like Composer
- Write discovery notes

Some of these tasks are maybe done, at least partially. That’s good! They are important to lay the groundwork for the rest of the work that will come.

I believe that the first task we must do is start a conversation with the business. There needs to be **open communication** between those who make the application and those who say what they want from the application. I've seen countless examples where *asking the right questions* would have saved hours and hours of development time.

A version control system will help us keep track of our code overtime. It will make it possible to revert changes. We can **introduce code reviews** as a process into our day-to-day work.

Having a reproducible development environment, we can ensure that all developers are working on a system that is as close to the production as possible. No more “It works on my machine!”.

A suite of automated tests will allow us to test the parts of the code we work on and give us the confidence to work faster.

## Build on the foundations

We can check off these items one-by-one, or we can do them in parallel. It depends on the size of the application and its current state, but start with one or two persons working on introducing changes to the application, with support from a few more. The people need to have the knowledge and *be willing* to work on these tasks.

After we set these “foundations”, we can move on to other tasks: upgrading PHP, frameworks, and libraries versions, *optimizing pages* for faster loads, moving heavy calculations to background workers… In talking with the business and with other developers, we must identify what are the parts of the application that receive most complaints from users, what are the parts that are most difficult to work with? Are there any security issues? Where do developers lose a lot of their time? These are all good candidates where to start working.

This is a slow, but steady process. We can't do it overnight. It is not easy. It will feel that no matter how much work we put in, nothing is changing, the application is still slow and bad. There are times when we feel frustrated and annoyed and overwhelmed. That’s OK. It means *we care*. I promise **the work will be worth it**, and we’ll be proud of it.

Happy hackin’!
