+++
draft = false
date = 2019-11-22T09:31:42+01:00
title = "Unit tests in legacy code"
slug = "unit-tests-in-legacy-code"
description = "I'm using unit tests in legacy code to document my assumptions about the code."
tags = ["legacy", "tests", "documentation"]
categories = ["Programming", "Development"]
2019 = ["11"]
+++

Legacy code has many definitions. It is code without tests. It is code written by someone else. It is code written X time ago. It is obsolete code that is difficult to replace with newer code. It is code that has no documentation. It is all of these things.

Besides that, I like to think of legacy code as code that is actively used by clients and **brings in value**. If it's not used by others then it can't bring in value, and if it does not bring in value then working on that code is just a waste of time and money.

Whatever the definition of legacy code is, we need to be careful when we start working on it. We can't really know under what kind of circumstances did the original authors write it. Were they under pressure to deliver on time to beat the competition to market? Were they tired, sick? Maybe they didn't know better at the time? Maybe when they wrote it 10 years ago, they did use the best tool for the job, but now, 10 years later, there are better tools for that?

## Unit tests first

When I start working on a piece of legacy code I try to cover it with unit tests first, if there aren't any for the code I have to change. I find it a good way to start **documenting the behaviour** of the code, to understand what it does, and gain confidence in the changes I'm about to make. To do this, I have to make an assumption, and a pretty big one at that.

I have to assume that the legacy code I'm writing the unit tests for is **bug free**. After all, it is in production and it brings in value, right? I also have to assume that the programmers before me *knew* what they were doing and why.

I try and run the code to see how it behaves under normal circumstances. Try out what I believe would be regular input and see what is the output based on that. I will also step-debug every line to see how data changes over time, how the unit of code I'm looking at communicates with its dependencies. I'll write down in a file or on a piece of paper all that I see. Focusing on unit tests means I focus on **understanding** the smallest possible unit of the code, instead of an entire code path from the moment the user interacts with the software until they get an answer back. That's just too much stuff to try and keep track of.

In these unit tests I'm using the input I used when I ran the code and assert against the output I got. I use a lot of test doubles for the dependencies the unit has and set up expectations against the data I saw while step debugging.

Method by method, class by class, I grow this suite of unit tests. They are not the best unit tests in the world, they are not easy to write, but they give me confidence in my understanding of the code and in any future changes I might make. The code is not in great shape, then the tests can't be either. Working with unit tests like this requires a *high level of discipline* as the test double dependencies need to be kept in sync with the changes in the code.

Not everyone likes to work with tests like these. They fail often, and they fail easily. But every fail for me means *challenging the initial assumptions* I had about the code. **It's a step forward for better code and better tests.** Over time these tests get replaced with better tests, the same way the code gets replaced with better code.

Happy hackin'!
