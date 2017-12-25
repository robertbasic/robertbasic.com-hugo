+++
draft = true
date = 2017-12-25T10:32:34+01:00
title = "Buffered vs. unbuffered channels in Golang"
slug = "buffered-vs-unbuffered-channels-in-golang"
description = "Solving Advent of Code 2017 day 20 puzzle 1 made me understand the difference between buffered and unbuffered channels"
tags = ["golang", "goroutines", "channels", "buffered", "unbuffered", "concurrency", "go"]
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

The `coord` is again a `struct` that holds the XYZ coordinates and has two methods on it, [nothing fancy](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L13-L27). When the particle moves, we add the acceleration to the velocity and the velocity to the position. Again, [nothing interesting there](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L37-L41).

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

So far this seems like something that **could** work. Running this code as is, results in "fatal error: all goroutines are asleep - deadlock!". OK, sort of make sense that it fails, we only send to the particle channel, we never receive from it.

## Send and you shall receive

So... let's receive from it I guess:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

    p := <-pch
    log.Println(p)

	wg.Wait()
	close(pch)
    return cp
}
```

Surprise! "fatal error: all goroutines are asleep - deadlock!". Errr...

Oh, right, can't send and receive to a channel in the same goroutine! Even though, receiving is not in the same goroutine as sending, lets see what happens if we do receive in one:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

    go func() {
        p := <-pch
        log.Println(p)
    }()

	wg.Wait()
	close(pch)
    return cp
}
```

Guess what? "fatal error: all goroutines are asleep - deadlock!" This should totally be possible, I'm doing something wrong!

[Matej](https://twitter.com/matejbaco) mentioned something on Twitter the other day that buffered channels can send and receive inside the same goroutine. Let's try a buffered channel, see if that works.

## Maybe buffers is what we need after all

When creating the `pch` channel, we pass in a second argument to `make`, the size of the buffer for the channel. No idea what's a good size for it, so let's make it the size of the `particles` slice:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	pch := make(chan Particle, len(particles))

	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

    p := <-pch
    log.Println(p)

	wg.Wait()
	close(pch)
    return cp
}
```

Run it and... A-ha! One particle gets logged! There's no comparing of particles in there yet, so it must be the first particle that was sent on that channel. OK, let's `range` over it, that'll do it:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

    for p := range pch {
        log.Println(p)
    }

	wg.Wait()
	close(pch)
    return cp
}
```

"fatal error: all goroutines are asleep - deadlock!" motherf... gah! Fine, I'll loop over all the particles and receive from the channel, see what happens then:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

    for i := 0; i < len(particles); i++ {
		p := <-pch
		log.Println(p)
	}

	wg.Wait()
	close(pch)
    return cp
}
```

Bingo! All particles logged, no deadlocks. Throw in a closure to find the closest particle and we're done!

``` golang
// snip...
    var findcp = func(p Particle) {
        if cp.d == 0 || particle.d < cp.d {
			cp = particle
		}
    }
    for i := 0; i < len(particles); i++ {
		p := <-pch
		findcp(p)
	}
// snip...
```

For my input I get the answer `243`, submit it to Advent of Code and it's the correct answer! I did it! I used goroutines and channels to solve one puzzle!

## But... how?

How, why does this work? I've seen code examples using `range` to range over a channel and use whatever is received from the channel to do something with it. Countless blog posts and tutorials, I've never seen a "regular" `for` loop and in it receiving from the channel. There must be a nicer way to achieve the same. Re-reading a couple of the articles, I spot the error I made in the `range` approach:

``` golang
func closest(particles []Particle) Particle {
    // snip...
	for _, particle := range particles {
		go move(particle, 10000, pch, &wg)
	}

	wg.Wait()
	close(pch)

    for p := range pch {
        findcp(cp)
    }

    return cp
}
```

243! After some thinking about it, it makes sense, or at least this is how I explained it to myself:

**Lesson number 1**  &mdash; golang's `range` doesn't "like" open-ended things, it needs to know where does the thing we `range` over begin and where does it end. By closing the channel we tell `range` that it's OK to range over the `pch` channel, as **nothing will send to it** any more.

To put it in another way, if we leave the channel open when we try to `range` over it, `range` can't possibly know when will the next value come in to the channel. It might happen immediately, it might happen in 2 minutes. And given that the `pch` channel is buffered, `range` probably also knows that there are at most `len(particles)` number of items in that channel.

Next step is to try and make it work using unbuffered channels. If I just make this buffered channel an unbuffered one, but otherwise leave the working code as-is, it blows up with a deadlock. Something something same goroutine.

Back to the example where I tried to receive in a separate goroutine:

``` golang
    // snip..
    go func() {
        p := <-pch
        log.Println(p)
    }()
    // snip...
```

Ah, this goroutine runs only once. It even prints out a single particle at the beginning, I just didn't look closely enough the first time, all I saw was the deadlock error message and moved on. I should probably loop over the channel somehow and receive from it in that loop.

I remembered reading something about a weird looking `for/select` loop, let's try writing one of those:

``` golang
    // snip..
    go func() {
        for{
			select {
			case p := <-pch:
				findcp(p)
			}
		}
    }()
    // snip...
```

243! Yey! And again, after giving it some thought, this is how I explained this unbuffered channel version to myself:

**Lesson number 2** &mdash; an unbuffered channel can't hold on to values (yah, it's right there in the name "unbuffered"), so whatever is sent to that channel, it **must be received** by some other code right away. That receiving code must be in a different goroutine because one goroutine can't do two things at the same time: it can't send and receive; it must be one or the other.

Armed with these two bits of new knowledge, when to use buffered and when to use unbuffered channels?

I guess buffered channels can be used when we want to aggregate data from goroutines and then do with that data some further processing either in the current goroutine or in new ones. Another possible use case would be when we can't or don't want to receive on the channel at the exact moment, so we let the senders fill up the buffer on the channel, until we can process it.

And I guess in any other case, use an unbuffered channel.

And that's pretty much all I learned from this one Advent of Code puzzle. Here's my final solution [using buffered channels](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L76-L103) and here's the one [using unbuffered channels](https://github.com/robertbasic/aoc2017/blob/be5299abf977ceb4acd2c5a7fdcb454f147735bf/day20/day20.go#L105-L136). I even figured out other ways to make it work while writing this blog post, but those solutions all come from this understanding of how these channels work.

If you spot any errors in either my working code examples or in my reasoning, please [let me know](https://robertbasic.com/#hire-me). I want to know better. Thanks!

Happy hackin'!
