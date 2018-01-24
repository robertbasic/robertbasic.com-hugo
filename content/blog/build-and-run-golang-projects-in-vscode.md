+++
draft = false
date = 2018-01-24T22:49:03+01:00
title = "Build and run Golang projects in VS Code"
slug = "build-and-run-golang-projects-in-vs-code"
description = "Using tasks in vscode it is possible to set up building and running Golang projects in VS Code"
tags = ["golang", "vscode", "tasks", "build", "rebuild"]
categories = ["Programming", "Software", "Development"]
2018 = ["01"]
+++

I've been using VS Code for my [Golang development](/blog/reading-from-standard-input-with-go/) needs for a few months now. Minor kinks here and there, nothing serious, and the development experience gets better with every update. I have also tried out IntelliJ Idea as the editor, and one feature that I'm missing in Code from Idea is the build-run-reload process. I thought to myself, that's such a basic feature, it should be possible to have that.

And it is! [VS Code Tasks](https://code.visualstudio.com/docs/editor/tasks) to the rescue!

These tasks allow us to run different kind of tools and, well, tasks inside VS Code.

Go to `Tasks -> Configure Default Build Task` and then select the "Create tasks.json file from template" in the little pop-up window, and after that select the "Others" option. This `tasks.json` file will live inside the `.vscode` directory.

For my [overcomplicated d20 roller](https://github.com/robertbasic/d20), which is my first website built with Golang, I have the following content for the tasks:

<div class="filename">.vscode/tasks.json</div>
``` json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Build and run",
            "type": "shell",
            "command": "go build && ./d20",
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

What this one task does is that it runs `go build` to build the project and then runs the generated executable, which for this project is `d20`.

I guess providing a standardized name to `go build` with the `-o` flag this could be made more portable so that the `command` part reads something like `go build -o proj && ./proj`, but I'm ok with this for now.

And now just type `Ctrl+Shift+b` and Code will execute this "Build and run" task for us! Hooray! The terminal window in Code will pop-up saying something like:

``` text
> Executing task: go build && ./d20 <
```

By going to `http://localhost:8080` I can see that my little website is up and running. Cool.

But if we want to restart this taks, running `Ctrl+Shift+b` again won't work and Code will complain that the "Task is already active blablabla...".

Looking at the `Tasks` menu, we can see that there's a "Restart running task..." menu entry. Clicking that, it pops up a window with a list of running tasks. In this case there's only one, our "Build and run" task. Clicking through the menu every time would be boring, so let's add a keyboard shortcut for it.

Go to `File -> Preferences -> Keyboard shortcuts` (or just hit `Ctrl+k Ctrl+s`), search for "Restart running task" keybinding, and set it to whatever you like. I've set it to `Ctrl+Alt+r`.

Finally, the flow is `Ctrl+Shift+b` to start the taks for the very first time, code-code-code, `Ctrl+Alt+r` to re-build. Sweet. Now the only annoying bit is that I have to pick out that one running task from the list of running tasks when restarting, but I can live with that. For now.

Happy hackin'!
