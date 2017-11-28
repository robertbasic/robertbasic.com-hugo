+++
draft = true
date = 2017-12-01T12:44:18+01:00
title = "Prooph query bus"
slug = "prooph-query-bus"
description = "How to use the Prooph service bus to dispatch queries to finders"
tags = ["prooph", "php", "cqrs", "service bus", "query", "query bus"]
categories = ["Programming", "Software", "Development"]
2017 = ["12"]
+++

The next part in my little [Prooph](/tags/prooph) series I want to take a look at the query bus.

The query bus routes a query message to a finder. It is similar to the command bus in the sense that one query message must have one finder, but unlike the [command bus](/blog/prooph-command-bus), the query bus expects to get a response.

As the finder is free to implement the actual finding synchronously or asynchronously, the query bus returns a [ReactPHP Promise](/blog/reacting-to-promises). Once the finder resolves or rejects this promise, the caller of the query bus will handle the result of this promise as it sees fit.


