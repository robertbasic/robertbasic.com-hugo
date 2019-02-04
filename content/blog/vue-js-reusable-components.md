+++
draft = false
date = 2019-02-04T08:19:11+01:00
title = "Vue.js reusable components"
slug = "vue-js-reusable-components"
description = "I got excited learning about reusable components in Vue.js, so I wrote about them"
tags = ["vue.js", "reusable", "components", "javascript"]
categories = ["Programming", "Development"]
2019 = ["02"]
software_versions = ["Vue 2.5"]
+++

A while ago I started learning bits and pieces about [Vue.js](https://vuejs.org/) by creating a single page application for one of [my pet projects](https://github.com/robertbasic/forthisweek) that I use to explore [Domain-Driven Design](/tags/ddd/). In general I know my way around a Javascript file, but wouldn't call myself an expert with it. In the past I mostly used jquery, some mootools, and even Dojo. Ah, good old Zend Framework 1 times.

While reading up on Vue.js I came across the part of their documentation that talks about [components](https://vuejs.org/v2/guide/components.html) and how to make them reusable. At the time I just glanced over it, thought "Neat." to myself and went on with my day. Yesterday when I was done with creating a page that holds a list of tasks, I remembered that section about reusable components and wondered could I use that to clean up a bit of the code I wrote. Turns out, I can!

A simplified version of my initial Vue.js page was something like this:

<div class="filename">./assets/vue/components/Journal.vue</div>
``` html
<template>
    <div>
        <template v-if="journal.tasks.length !== 0">
            <div v-for="task in journal.tasks">
                <template v-if="task.status === 'todo'">
                    <button @click="markTaskAsDone(task.id)">
                        Mark as done
                    </button>
                    <span>{{ task.description }}</span>
                </template>
                <template v-if="task.status === 'done'">
                    <strong>{{ task.description }}</strong>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'journal',
        data: function () {
            return {
                journal: {
                    tasks: [
                        {
                            'id': 1,
                            'description': "Task 1",
                            'status': "todo"
                        },
                        {
                            'id': 2,
                            'description': "Task 2",
                            'status': "done"
                        },
                    ],
                }
            }
        },
        methods: function () {
            markTaskAsDone: function(taskId) {
                alert("Marking task as done, ID: " + taskId);
            }
        }
    }
</script>
```

We check if there are any tasks in the journal and if so, iterate over them. For `todo` tasks show a button that we can use to mark that task as done and show the description of the task. For `done` tasks display the task description bolded.

Now, for the case when the journal *has no tasks*, I decided I want to show the organizer (an organizer is a person who organizes their tasks in that app) an example list of tasks instead of a blank page with a boring "No tasks" message. I'm also learning to make my designs a tiny bit better, courtesy of the [Refactoring UI book](https://refactoringui.com/book/).

How did I do that? By copy/pasting a bunch of times the HTML for the todo and done tasks.

<div class="filename">./assets/vue/components/Journal.vue</div>
``` html
<template>
    <div>
        <template v-if="journal.tasks.length !== 0">
            <div v-for="task in journal.tasks">
                <template v-if="task.status === 'todo'">
                    <button @click="markTaskAsDone(task.id)">
                        Mark as done
                    </button>
                    <span>{{ task.description }}</span>
                </template>
                <template v-if="task.status === 'done'">
                    <strong>{{ task.description }}</strong>
                </template>
            </div>
        </template>
        <template v-else>
            <div>
                <button @click="alert('Marking the task as done')">
                    Mark as done
                </button>
                <span>An example of a todo task</span>
            </div>
            <div>
                <strong>An example of a done task</strong>
            </div>
        </template>
    </div>
</template>
```

Remember, this is a simplified version of the code. Add to that a bunch of more `div`s, a bunch of CSS classes as I'm using [TailwindCSS](https://tailwindcss.com/docs/what-is-tailwind/) and what I had before me was [a real nightmare](https://github.com/robertbasic/forthisweek/blob/319925b288419d2ce5c9b4bd262af95ce4e83196/assets/vue/components/ViewJournal.vue#L12-L104). Almost a hundred lines of HTML.

## Enter stage left... Reusable components.

What I did was I created two reusable components, one for a todo task, and one for a done task.

The component for the todo task looks something like this:
<div class="filename">./assets/vue/components/Tasks/Todo.vue</div>
``` html
<template>
    <div>
        <button @click="">
            Mark as done
        </button>
        <span><slot>An empty task</slot></span>
    </div>
</template>
<script>
    export default {
        name: 'todoTask',
    }
</script>
```
The `<slot>` element acts like a kind of a placeholder where Vue.js will insert whatever text we pass on later to that component. There are other ways to pass in data from parent to child components, but in this case, this was simple and enough for me. Note that the `@click` event handler for the button is empty, as at this time I had no idea what to do with it. The `export` part in the `script` tag is how we expose the component to be available for use in other components. I think?

The component for the done task is similar:
<div class="filename">./assets/vue/components/Tasks/Done.vue</div>
``` html
<template>
    <div>
        <strong><slot>An empty task</slot></strong>
    </div>
</template>
<script>
    export default {
        name: 'doneTask',
    }
</script>
```

To use these components we need to import them and list them under `components` within our component where we want to use them:
<div class="filename">./assets/vue/components/Journal.vue</div>
``` html
<script>
    import TodoTask from "./Tasks/Todo";
    import DoneTask from "./Tasks/Done";
    export default {
        name: 'journal',
        components: {
            TodoTask,
            DoneTask,
        },
        // Shortened the rest of it as nothing changed
    }
</script>
```

We take the name of the components we imported, turn them [kebab-case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles), and use them as HTML tags. What we put between the opening and closing tags of our component will be inserted into the `<slot>` tag inside:
<div class="filename">./assets/vue/components/Journal.vue</div>
``` html
<template>
    <div>
        <template v-if="journal.tasks.length !== 0">
            <div v-for="task in journal.tasks">
                <todo-task v-if="task.status === 'todo'">{{ task.description }}</todo-task>

                <done-task v-if="task.status === 'done'">{{ task.description }}</done-task>
            </div>
        </template>
        <template v-else>
            <todo-task>An example of a todo task</todo-task>

            <done-task>An example of a done task</done-task>
        </template>
    </div>
</template>
```

Vue.js will make sure that we get the proper HTML rendered in the browser.

## Events to the rescue

For a while I didn't know what to do with the `Mark as done` button. The original implementation of the `markTaskAsDone(taskId)` method uses other methods local to the `Journal` component, so if I'd move that to the `TodoTask` child component, there'd be a mess on my hand real quick. I've tried passing in to the `TodoTask` a function from the parent component and a couple of other things...

Turns out the solution is quite elegant. On the button within the `TodoTask` we listen for the `click` event and trigger our own custom `clickedToMarkTaskAsDone` event:

<div class="filename">./assets/vue/components/Tasks/Todo.vue</div>
``` html
<template>
    <div>
        <button @click="clickedToMarkTaskAsDone">
            Mark as done
        </button>
        <span><slot>An empty task</slot></span>
    </div>
</template>
<script>
    export default {
        name: 'todoTask',
        methods: {
            clickedToMarkTaskAsDone: function () {
                this.$emit('clickedToMarkTaskAsDone');
            }
        }
    }
</script>
```

In the parent component where we use this `TodoTask` component, we create a handler for our custom event using the existing code we have:

<div class="filename">./assets/vue/components/Journal.vue</div>
``` html
<todo-task v-if="task.status === 'todo'" @clickedToMarkTaskAsDone="markTaskAsDone(task.id)">
    {{ task.description }}
</todo-task>
```

Nothing within the `markTaskAsDone` method changed.

The [end result](https://github.com/robertbasic/forthisweek/blob/9cbaf346f3e38b74f0dc890d5a6fa82e2cb9a069/assets/vue/components/ViewJournal.vue#L12-L37) is much more nicer and the line count went down from a hundred to 25 lines. Isn't that great? I think it's great.

Happy hackin'!
