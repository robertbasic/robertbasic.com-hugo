+++
draft = false
date = "2017-05-24T12:39:01+02:00"
title = "Bug triage, the paperwork of open source"
slug = "bug-triage-the-paperwork-of-open-source"
description = "Triaging issues for an open source project is a great way to contribute"
tags = ["open source", "contributions", "bugs", "issues", "triage"]
categories = ["Blablabla", "Software"]
2017 = ["05"]

+++

Everyone loves contributing patches to open source projects, adding new features. Some even like to write documentation.

Probably the least talked about way of contributing to open source is triaging issues (I have no data to back this statement, so I might be wrong!).

I do believe however that it can be the biggest help to project maintainers, because with issue triage out of the way, they are left dealing with the "bigger" problems of the project, such as fixing difficult bugs and implementing new features.

Ideally, a good issue report will include the version numbers of the affected projects, a good description of what the user tried to do, what did they experience, expected and actual results, any logs or stacktraces, and even the smallest possible test case that reproduces the issue being reported.

I say ideally, but that's not always the case. Sometimes the report has a lot less details, does not include version numbers, or any other information that would help identifying the underlying cause of the issue. In those cases someone needs to go through the reported issues and ask for more information.

## It's paperwork

Issue triage boils down to going through the list of open issues for a project and making sure that the reports include as much as possible useful information. If the reporter hasn't provided everything needed, we should ask them for more details.

If the initial report includes just enough information to start investigating, we could that as well. Start digging into the codebase and try to figure out what's going on. If the project has automated tests, we can use them to get a better picture of the issue, and maybe even provide a failing test case to the maintainers. Fun fact: this is how I started with unit tests and test driven development - by submitting failing test cases to projects.

When we deem that we have enough information, we can try to reproduce the issue, and confirm or deny its validity.

<img style='float:right;padding: 10px;' src='/img/posts/mockery-triage.png' />

Some issues are not really issues, but a case of misconfigured library, or documentation not being read fully. In those cases the solution is not to leave a "RTFM" comment and close it. Asking if they read pages X or Y, is a much better approach. It might be that the documentation is not detailed or clear enough, so we need to update our docs.

Sometimes it's the lack of documentation that is the real issue.

Once we have enough information, we can leave a comment for the maintainers saying that we managed, or not, to reproduce the bug. From there the maintainers can take over and deal with the issue as they see fit. Or we could attempt at writing a patch and fixing it.

## Bug? Feature? Support?

Users will open all kinds of reports. There will be issue reports, there will be feature requests, and there will be questions asking for support.

Deciding on which is which is also a part of issue triage. Label them accordingly, so maintainers and contributors will have an easier time filtering them out.

If you are familiar with how the software works, you might provide an answer to a question and help the user, again taking of the load from the maintainers.

## No experience required

One of the best things for me about issue triage is that we don't need to have experience with the project, let alone be experts in using it. Most of this is communicating with others, asking for more feedback, and making sure that the persons who can decide on the reports can do so with least effort required. Of course, having experience does help, but that's the way with everything in life, I guess.

Besides, this is also a great opportunity to learn more about the project and the ecosystem around it.

While the work is not grandiose, it will help in getting better at communication skills, it will help the project to move forward just a little bit faster, and it is a great way to contribute to open source projects.

Happy hackin'!

P.S.: Sometimes if you wait long enough, the reporter won't even remember what the issues was, and they'll [just close the issue](https://github.com/mockery/mockery/issues/548).
