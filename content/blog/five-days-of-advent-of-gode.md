+++
draft = false
date = 2017-12-06T08:34:20+01:00
title = "Five days of Advent of Gode"
slug = "five-days-of-advent-of-gode"
description = "Learning more about golang by doing the Advent of Code 2017 challenge"
tags = ["golang", "go", "about", "learning", "advent of code", "challenge", "puzzles"]
categories = ["Programming", "Development", "Blablabla"]
2017 = ["12"]
+++
A week or so ago, [Luka](https://luka.muzinic.net/) mentioned this [Advent of Code](http://adventofcode.com/) thing. I've been doing coding challenges and examples before, but never have I tried the AoC (this is the third year it's running).

Advent of Code is a series of programming puzzles, where you get 2 puzzles a day for 25 days.

Given that I have started to [learn golang again](/blog/reading-from-standard-input-with-go/), I figured might as well learn more about it by joining this years challenge.

I keep [a repository](https://github.com/robertbasic/aoc2017) with my solutions to these puzzles and try to take notes for every day and now I want to look back at the first 5 days.

I started of the first day with just a mess of a code, just pushing for the first solution that gets the correct answer. On the second day I realised I won't be learning much like this, so I decided to bring some order to the [chaos](https://github.com/robertbasic/aoc2017/commit/6077566eddc475965ee3bb85ee34a566576e68a4): organised the code a bit nicer (even though it's a far cry from good), added tests, and generally tried to get to a point where it's easier to get started with a day's challenge.

The AoC puzzles are relatively easy so far. Day 3 was the only day so far where I had problems wrapping my head around the problem. I've managed to figure out the solution for the first puzzle, but for the second puzzle I "cheated" and used the [OEIS](https://oeis.org/). *shrug*

As for golang... I don't know enough of it to say if I like it or not. I mean, I do like it, sort of, but for these 5 days the most I did was toying around with strings and integers and slices and maps. That's hardly enough time and usage to pass judgment on it.

## On golang

I like how it fails to build if there's an unused variable laying around, but then again I tend to save often, so I write:

``` golang
for k, v := range slc {
}
```

Hit save and the IDE underlines that entire `for` line. What, why?! Hover over the line to see what the problem is... Oh, `k` and `v` are unused. Well, d-uh, I'm not done yet. But I still have to double check because the bug might be real, for example if I want to range over an integer the IDE will again underline the entire line.

For some reason I'm really bad at naming things in golang, quite often the variable and function names are just bad. I'm trying my best to follow the [golang styles](https://github.com/golang/go/wiki/CodeReviewComments#variable-names), but... I don't know. I'm not sold on the whole "short rather than long" thing.

I keep mixing assignment `=` and assignment & declaration `:=`. But I'll learn it, eventually.

I like everything about the types, even though I don't understand everything about them, yet. Maps, for example, are not ordered even though I tried to use them as such once.

## On slices

Except slices. Slices are weird. Well, were weird until I understood how golang treats and works with them.

I [read](https://blog.golang.org/slices) [four](https://golang.org/doc/effective_go.html#slices) [different](https://blog.golang.org/go-slices-usage-and-internals) [articles](https://allegro.tech/2017/07/golang-slices-gotcha.html) to get to the point where I know what a slice is, only to get a succinct explanation of ["slices are mutable views of an array"](https://twitter.com/davecheney/status/937942876406738944). For me, that one sentence explains it better than the four articles.

Here's an example:

``` golang
package main

import (
	"fmt"
)

func main() {
	x := []int{1, 2, 3, 4, 5}
	a := make([]int, 0)
	b := make([]int, len(x))

	y := x
	copy(a, x)
	copy(b, x)

	F(x)

	fmt.Println(x) // [2 3 4 5 6]
	fmt.Println(y) // [2 3 4 5 6]
	fmt.Println(a) // []
	fmt.Println(b) // [1 2 3 4 5]
}

func F(z []int) {
	for k, _ := range z {
		z[k]++
	}
}
```

Notice how both `x` and `y` are the same, even though we only modify `x` within the `F()` function, without even returning anything from that function. What happens is that the array on which the slice is built gets modified, which in turns modifies the slice(s) as well. Another thing worth remembering is to only append to a slice with the `append()` function.

## On testing

I learned how to write tests. I guess there's more to learn about them, but so far I'm doing OK. I'm writing a lot of repetitive things like this to get data providers:

``` golang
for _, tt := range footests {
    r := Foo(tt.in)

    if r != tt.out {
        t.Errorf("Got %d for %s, expected %d", r, tt.in, tt.out)
    }
}
```

Even if there's no shorter/better way to handle data providers in golang tests, I'll just create some snippets and be done with all the copy/pasting.

I like that VS Code allows to run and debug a single test function. That's really helpful. It shows small "run test" and "debug test" links above every test method. Click and off we go!

## On packages

I haven't yet learned how to properly work with my own packages, how to organize code and name packages to import one into the other, but I didn't really had the need for it.

What I did learn, is that I can't name a function like an existing package. For example, I wrote my own little function called `sort`, which made it impossible to import the `sort` package from the standard library.

All in all, I'm making good progress with both the AoC puzzles and with golang. I believe this will give me a good foundation for further learning and improving. There's still a long road before me, but I feel I'm on the right track.

Happy hackin'!
