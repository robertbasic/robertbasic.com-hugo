+++
draft = false
date = 2017-10-30T07:15:19+01:00
title = "Reading from standard input with Go"
slug = "reading-from-standard-input-with-go"
description = "First foray into Go, figuring out how to read from the standard input."
tags = ["go", "stdin", "learning", "standard input", "golang"]
categories = ["Programming", "Development"]
2017 = ["10"]
+++

Last year I started learning [Go](https://golang.org/), then I stopped, and now I don't remember anything what I learned.

Going to try it a bit different this time, by writing down what I do, learn, experiment.

As I don't have a specific thing I want to build with Go, I'm just going to do simple scripts and examples, to get to know Go's language specification and built-ins as much as possible.

Hopefully, there won't be too much mistakes in my code samples. I've set up a [golearn repository](https://github.com/robertbasic/golearn) just for this, so feel free to create issues/PRs telling me where I went wrong.

## Setting up the Go environment

I installed Go to the location that the official docs recommend &mdash; `/usr/local`, and I created the "Go workspace" in `~/projects/gocode` and then I put my code under `~/projects/gocode/src/github.com/robertbasic/golearn`.

I do find it kinda weird that everything lives in one "workspace". But, whatever.

As for the editor, I'm using Visual Studio Code with the Go plugin.

I first tried using the [vim-go](https://github.com/fatih/vim-go) plugin, but I couldn't make it work in a custom runtimepath. I didn't want to brick the Vim setup I have for my day-to-day work, so that's why I tried a custom location.

Next I tried the Gogland from JetBrains, but when I ran it, my laptop sounded like a jet when the fans kicked off, so... yeah.

Then I tried [Visual Studio Code](https://code.visualstudio.com/), installed the [Go plugin](https://code.visualstudio.com/docs/languages/go) and I was pleasantly surprised when the editor figured out I was missing some Go programs like `gofmt`, `golint`, etc., and offered me to install them all. Great user experience for newcomers to Go.

## About those docs...

After printing out the required "Hello, world!" to the terminal, I set out to figure out how to read in stuff from the standard input.

I would really love to say I figured it out all on my own how to do it, just by reading the official documentation, but I couldn't. Maybe I don't know how to use Go's docs, maybe I'm spoiled by PHP's excellent documentation, but after an hour or so flipping through the docs, I ended up Googling the solution.

From the documentation, I couldn't figure out does the solution lie within the `io`, or the `bufio` package. Maybe both? I'll have to tinker with them some more to understand the difference between the two.

From all the answers I found on the internet about this, I went with what seems the simplest way of reading from standard input: using a `bufio.Scanner`. Again, I'll have to poke more around this, to see all the different ways I can accomplish this and compare the solutions.

## The first "program"

The goal is to read whatever the user types in to standard input, line by line.

First, I have a slice of strings. Not an array, but a slice. I believe the main difference is that an array has a set size, while a slice's size can change during execution.

``` go
// Inputs holds the inputs read in from stdin
type Inputs []string
```

I'm not yet 100% sure does this create a new type "Inputs" which is composed of a slice of strings, or is it just a slice of strings named "Inputs"? I think it's the former, because I can use it as a return type-hint in a function.

Then in the `main()` I get [a new scanner](https://golang.org/pkg/bufio/#NewScanner) for the standard input:

``` go
scanner := bufio.NewScanner(os.Stdin)
```

It returns a pointer to the `Scanner`, so I pass it as such to my `ReadInput` function:

``` go
is := ReadInput(*scanner)
```

The `ReadInput` function takes a scanner of `bufio.Scanner` type and returns `Inputs`:

``` go
func ReadInput(scanner bufio.Scanner) Inputs
```

I declare two variables, one to hold the string read in from stdin, the other to "collect" all the input strings:

``` go
	var t string
	var i Inputs
```

Then I create an endless `for` loop, from which I break out when the user enters a new line only. In this loop the `Scanner` scans the stdin, and gets the text from it. If the text entered is not empty, I append it to the `Inputs`, as it is a slice of strings:

``` go
	for true {
		fmt.Print("Add a new todo [empty to stop reading]: ")
		scanner.Scan()
		t = scanner.Text()

		if err := scanner.Err(); err != nil {
			fmt.Println("Error reading from input: ", err)
		}

		// scanner.Text() strips new lines
		// so in case of just a new line
		// it's actually an empty string
		if t == "" {
			break
		}

		i = append(i, t)
	}
```

and finally I return the `Inputs` from the `ReadInput` function:

``` go
    return i
```

Back in `main` I do a "sanity" check by printing out the number of lines read in, and printing them out one by one:

``` go
	fmt.Printf("Got %d inputs from stdin:\n", len(is))

	for _, v := range is {
		fmt.Println(v)
	}
```

When executed, it looks something like this:

``` text
$ go run readstdin.go 
Hello, world!
Add a new todo [empty to stop reading]: Learn go
Add a new todo [empty to stop reading]: Write blog posts
Add a new todo [empty to stop reading]: 
Got 2 inputs from stdin:
Learn go
Write blog posts
```

The entire file is available [here](https://github.com/robertbasic/golearn/blob/master/readstdin.go).

With this I learned a bit about Go's types, creating functions, using the `for` loop, pointers, slices vs. arrays, and, of course, reading stuff from the standard input.

Happy hackin'!

P.S.: It feels good to have a beginners mind, again, about something.
