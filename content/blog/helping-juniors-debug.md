+++
draft = false
date = "2016-06-23T08:20:14+02:00"
title = "Helping juniors debug"
slug = "helping-juniors-debug"
description = "My thoughts on the process of teaching junior developers how to debug"
tags = ["debugging", "teaching", "mentoring"]
categories = ["Programming", "Development"]
2016 = ["06"]

+++
These days I spend most of my time reviewing code. Lots and lots of code. It's mostly written by juniors and some of it is good, some of it is bad. I try to be patient, to be a good mentor, to hopefully teach (and be taught), while not letting out of sight that the most important thing is that the code does the right thing in the right way. The business and the users come first, after all.

When I encounter a piece of code that looks like a bug, I run the code myself to verify it. After that I usually ask a short question, something like "Hey, what does this code do? I think there's a bug in it". There are times when the author figures it out on their own and fixes it, or asks for help. If the former, great, if the latter, I either give them some time to figure it out on their own, or help them debug it &mdash; depending on the difficulty of the bug.

What I **don't** do is outright tell them what the bug is, or even worse, how to fix it without giving them the chance to understand the bug. How are they going to learn like that?

Granted, guiding them through the entire debugging process can be slow and difficult, so this might not be a good approach when the deadline is close.

I do believe that taking the time to guide them can be rewarding for all parties involved. They get to learn by doing, get an insight on how a more senior developer works and thinks, and I, the very least, get to improve my communication skills by being forced to explain my thought process in words.

### What are you trying to do?

That's usually my first question. It's important to understand what they **think** is going on, so I can guide them better. It also prevents me from assuming they know something that might be fundamental knowledge for a senior, but not so much for a junior.

My end goal is not just to fix a bug, but to actually teach, help them understand what is going on, so the next time they can fix the bug on their own, or prevent it from happening in the first place.

### What does the code do?

Next thing I ask for is an explanation of the code, line by line if needed. This is probably the slowest part of this process, but I think it is necessary as it can point out places where their knowledge is lacking. They might don't understand a language feature, misread how an internal API method needs to be called, think that the code does one thing, but actually it does something else, because hey! that's how it works. And we've all been in a situation when we misunderstood something. It's OK. Our job is to teach them, just as we were taught.

During this part I try to not interrupt them, I let them finish. I keep track of all the bits they got wrong and go back to those one by one once they are done with explaining the code.

Again I try not to flat out tell them what they got wrong, but to guide them to the correct answer. Asking simple questions like "Are you sure that it's doing what you think it's doing?", or "Have you read the manual entry for that method call?" can be at times enough to make them see their mistake. "Oh, I'm passing a string and it should have been an array!" (side note: PHP 7 can't come soon enough to all of our projects).

If they just don't know what they got wrong, explain it to them. Don't try to skip over any parts that might seem obvious to you &mdash; it might not be so obvious for them.

Rinse and repeat for all the parts they got wrong.

### Let's find that bug

Now when they have a better understanding of the code, ask them to find the root cause of the bug. I repeat myself, but guiding them to the moment of discovery is much better than just leading them straight to the answer. Let them have their "A-ha!" moment. I know those moments are the best moments for me.

At this point they should be able to tell you what be a good fix for the bug. If it's a good fix, great. If not, ask them something like "Do you think doing X would be a better approach?" and explain why it would be.

This is a long process that can take up quite some time, even up to an hour or an hour and a half. You'll probably need to do it more than once because, well, there are many types of bugs and not all bugs can be debugged the same way, but it is going to be rewarding for both you and the junior. And the more you do it, the faster it will be.

Until one day when they will be teaching the next junior on the team how to debug.
