+++
draft = true
date = 2017-12-25T10:32:34+01:00
title = "Buffered vs. unbuffered channels in Golang"
slug = "buffered-vs-unbuffered-channels-in-golang"
description = "Solving Advent of Code 2017 day 20 puzzle 1 made me understand the difference between buffered and unbuffered channels"
tags = ["golang", "goroutines", "channels", "buffered", "unbuffered", "concurrency"]
categories = ["Programming", "Development"]
2017 = ["12"]
+++

As any newcomer to Golang and it's ecosystem, I was eager to find out what is this all hubbub about these things called [goroutines](https://tour.golang.org/concurrency/1) and [channels](https://tour.golang.org/concurrency/2). I read the documentation and blog posts, watched videos, tried out some of the "hello world" examples and even wasted a couple of days trying to solve the puzzles for day 18 from Advent of Code 2017 using goroutines and failed spectacularly.

All this was just... doing stuff without actually understanding of when, how, and why use goroutines and channels. And without that basic understanding, most of my attempts at doing anything that resembles a useful example ended up with deadlocks. Lots and lots and lots of deadlocks.

Ugh. I decided to stop forcing myself to understand all of this concurrency thing and figure it all out once I actually need it.

Few days later, I start reading the description for the first puzzle day 20. The gist of the problem is that we have many particles "flying" around on three axes: X, Y, and Z. Each particle has a starting position, a starting velocity, and a constant acceleration. When a particle moves, the acceleration increases the velocity of the particle, and that new velocity determines the next position of the particle. Our task is to find the particle that will be the closest to the center point after every particle has moved the same number of times.

Then there's this one sentence in the description:

<blockquote>
Each tick, all particles are updated simultaneously.
</blockquote>

Could it... could it be? A puzzle where goroutines can be applied to do what they were meant to be doing? Only one way to find out, and that's to try and use goroutines to solve the puzzle.

## Prior knowledge

Up until this point I knew the following things about goroutines and channels:

 - goroutines are started with the `go` keyword,
 - we must wait on the gouroutines to be done, otherwise they fall out of scope and things sort of leak,
 - the waiting can be done with either `sync.WaitGroup` or with a "quit" channel,
 - I prefer the `sync.WaitGroup` approach as it is easier for me to follow it,
 - goroutines communicate through channels, by sending and receiving a specific data type on them,
 - there are buffered and unbuffered channels, but other than it's pretty much `¯\_(ツ)_/¯`
 - I *think* it's not possible to send and receive to the same channel in the same goroutine?

## Setting up the code

From the puzzle's description we know we have a bunch of particles, every particle has an ID from zero to N, every particle has a position, velocity, and acceleration, and we want to know the particle's destination from the center. I went ahead and made a `struct` like this:

``` golang
type Particle struct {
	id int
	p  coord
	v  coord
	a  coord
	d  int
}
```

The `coord` is again a `struct` that holds the xyz coordinates and has two methods on it, [nothing fancy](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L13-L27). When the particle moves, we add the acceleration to the velocity and the velocity to the position. Again, [nothing interesting there](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L37-L41).

That's pretty much all the setup I had.

## Time to move

With all the prior knowledge I had, my idea was to move every particle in a separate goroutine for 10000 times, send every particle over a channel to *somewhere* where I can compare them and find the one that's the closest to the center, and use `sync.WaitGroup` to orchestrate the waiting on the goroutines to move the particles. The 10k is just a random number that seemed high enough so all particles are given enough time to move.

The first iteration looked like something the following:

``` golang
func closest(particles []Particle) Particle {
	var cp Particle
	var wg sync.WaitGroup
	wg.Add(len(particles))

	pch := make(chan Particle)

	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

	wg.Wait()

	close(pch)

    return cp
}
```

`cp` will hold the closest particle, there's the `wg` to do all the waiting, the `pch` channel to send particles over it.

For every particle in the slice of particles I tell it to "split out" in a goroutine and move that `Particle` for 10000 times. The `move` function moves the particle for the given number of iterations, sends it over the `pch` channel once we're done moving it, and tells the wait group that it's done:

``` golang
func move(particle Particle, iterations int, pch chan Particle, wg *sync.WaitGroup) {
	for i := 0; i < iterations; i++ {
		particle.move()
	}
	pch <- particle
	wg.Done()
}
```

So far this seems like something that **could** work.
