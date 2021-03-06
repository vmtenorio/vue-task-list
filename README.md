# Parent-child communication between Vue components

Find out about Vue.js' components and how to exchange information between them.

Vue.js is an open-source framework that can be used to build single-page applications and user interfaces. One of its main features is the creation of **components** that can be updated by the user and that allow a real-time update of the webpage according to the information introduced.

Today, I'm going to show you how I created a dynamic task list using Vue with two different components: a parent component representing the task list itself and all its information, and a child component representing a single task. I will also cover the communication between these two components to respond to user events.

Even though you don't need any previous Vue knowledge to follow the article (it is self-contained), it is not intended to be an introduction to Vue as a framework, because some of its core features will not be visited here.

First of all, let's take a look at the webpage we are trying to build. It can be visited [here](https://vmtenorio.github.io/vue-task-list):

![A dynamic task list using Vue](img/page_layout.png)

It is a simple webpage that contains a task list, each of them having a description, a priority and a checkbox to mark whether it is already done or not. It also contains a button to add new tasks and a button to submit the information, that just prints it out below.

## Setting up the basics: Vue components

Components are Vue's reusable instances that form the data structure of the webpage. You can create a component specifying its properties, some data, methods or an HTML template. After it is created, you can use its name as an HTML tag anywhere on your page.

### The parent component: task-list

For example, let's define a simple component to represent our task list first. Although the code is commented for readibility, the details regarding Vue are explained in the paragraphs below:

```javascript
Vue.component("task-list", {
    // This is the data function, that will return the information we want to
    // store in the component, in this case, the task list
    data () {
        return {
            tasks: [
                { id: 1, desc: "", priority: "Medium", done: false },
                { id: 2, desc: "", priority: "Medium", done: false },
            ]
        }
    },
    // Here, we will create the methods that can be called when a certain event
    // occurs, for example, a button is clicked
    methods: {
        newTask() {
            // A method to insert a new task into our task list, represented in
            // the attribute tasks from the data function
            this.tasks.push({
                id: this.tasks.length + 1,
                desc: "",
                priority: "Medium",
                done: false
            })
        },
        sendData () {
            // A method that will define the behaviour of the "Submit" button.
            // For example, you could send your data via API:
            // axios.post(TASK_API_URL, this.tasks)
            //     .then(function (response) {console.log(response);})

            // In our case, we will just send the task list to be shown inside
            // the "You submitted" section. It iterates over the task list and
            // creates a "li" with a line for each task

            // Get the container of the "You submitted" section
            var submittedList = document.getElementById("taskSubmitted");

            // To prevent the duplication of the tasks inside the "You
            // submitted" section when the user has clicked the submitted
            // button more than once, we delete its contents if the container
            // is found
            if (submittedList !== null) {
                submittedList.remove();
            }

            // Get the container where to put the submitted data and insert the
            // tasks inside an "ul" element
            var responseContainer = document.getElementById("response");
            var taskListEl = document.createElement("ul");
            taskListEl.id = "taskSubmitted";
            responseContainer.appendChild(taskListEl);
            var newItem, itemStr;
            this.tasks.forEach(function (t) {
                // For each task, we transform it into a string and append it
                newItem = document.createElement("li");
                itemStr = "";
                itemStr += t.desc;
                itemStr += " - Priority " + t.priority;
                itemStr += " - Done? " + t.done.toString();
                newItem.textContent = itemStr;
                taskListEl.appendChild(newItem);
            });
        }
    },
    // This template will contain the HTML to be placed wherever a "task-list"
    // element is created in our webpage
    template: listTemplate // This is a variable whose contents are detailed next
});
```

Here, I'm creating a global component (can be used anywhere) called `task-item`, that contains some data (as a function, this is important), the methods to manipulate it and a template. The `data` function returns two placeholder tasks inside an array, and the `methods` are used to add new tasks (when clicking the "Add a new task" button on the page) and to submit the information introduced in the interface (in this case, it prints the submitted data inside the "You submitted" section of the webpage, but it could also send the data via API using a library like Axios, as it can be seen in the comments).

Now that I have defined this component, I can use the `task-list` HTML tag anywhere in the document. Vue would then substitute this element by the contents of the `template` attribute, in this case, the `listTemplate` variable, that contains:

```html
var listTemplate = `
    <div id="task-list" class="list-group w-50 mt-3 m-auto">
        <task-item
            v-for="t in tasks"
            :key="t.id"
            @update:desc="t.desc = $event"
            @change:done="t.done = $event"
            @change:priority="t.priority = $event"
        ></task-item>
        <div id="add-more">
            <button @click="newTask" type="button" class="text-center list-group-item list-group-item-action">Add a new task</button>
        </div>
        <div id="submit-button" class="my-3 w-100 text-center">
            <button type="button" class="btn btn-primary mx-auto" @click="sendData">Submit</button>
      </div>
    </div>
`;
```

We can see here the structure of the task list we saw earlier in the image of the webpage, as a Bootstrap list-group class (if you don't know Bootstrap, you just need to know that this class is used to easily define a pretty list of elements).

Let's focus first on the "Add a new task" and "Submit" buttons. Dic you notice the `@click` HTML attribute? It is a short form of `v-on:click`, that defines the behaviour when a certain event occurs, in this case, the `click` event. When clicked, they launch the methods defined earlier in the component.

We can also see an unknown HTML tag: `task-item`. It loops over the task list (contained in the `tasks` array, defined in the `data` function) with the `v-for` directive. This directive creates a different task-item for each element in the tasks array, and it also has the advantage of being dynamically updated. Also inside this task-item, there are several handlers for some events (preceded by '@'), that just update the value of the property of each task to the content of some variable `event`. As you may have already guessed, this `task-item` is another Vue component, a child component.


### The child component: task-item

The `task-item` component represents a single task in our task list. We can declare it as follows:

```javascript
Vue.component("task-item", {
    // In this case, we declare the properties of each task
    props: {
        id: Number,
        desc: String,
        priority: String,
        done: Boolean
    },
    // It also contains a template with the HTML to place instead of the
    // task-item element
    template: taskTemplate
});
```

In this case, the component is simpler, it just contains the template and the properties of the component: an identifier, the description of the task, its priority and whether it is already done or not. These properties are not necessary, it works without declaring them as well, but improves the readibility of the code.

Let's now analyze the contents of the template for the task item:

```html
var taskTemplate = `
    <div class="list-group-item">
        <input
            type="text"
            placeholder="Insert your task"
            @input="$emit('update:desc', $event.target.value)"
            class="form-control"
        />
        <select
            class="form-select"
            aria-label="Priority Selection"
            @change="$emit('change:priority', $event.target.value)"
        >
            <option disabled selected hidden>Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
        </select>
        <p><span>Done?</span>
        <input
            type="checkbox"
            @change="$emit('change:done', $event.target.checked)"
            class="form-check-input"
        />
        </p>
    </div>
`;
```

It contains the input of type text to introduce the description of the task, the selector to choose a priority and the checkbox to mark it as done. It also contains handlers to listen to `input` and `change` events. The only thing that may seem unclear is the `emit` directive on the handlers: it allows the `task-item` to communicate with its parent.

## Communication between parent and child components

Vue needs a way to bind a certain HTML element where the user can introduce data (such as an `input` or a `select` as we have used) to a certain property of our components. The most common way to do so is to use the `v-bind:attribute="prop"` directive (or its short form `:attribute="prop"`, which binds the value of the `attribute` of the HTML element where it is placed to the property defined in the data of the component.

For example, if we wanted to bind the `value` property of the first `input` HTML element to the `desc` property of our task-item, we just have to place `:value="desc"` in the `input` element. We have not done it this way, because this updates the data of the object representing the component itself (i.e. the data attribute in the `task-item` component, something we have not declared, so it won't make any effect in our task list), and it would not change the contents of the data in the parent. This would be useful if we had declared the data inside the `task-item` component, but as we have done so in the parent (useful for data handling like submitting it), we must use the `emit` function to send the data upwards.

The `emit` function is used to trigger a custom event to the parent component, optionally with an argument. It receives two arguments: a name of the event to trigger and, optionally, any value. In this case, the first input element (the one of type text, controlling the description of the task) is emitting a `change:desc` event with the optional argument set to the text introduced by the user (`$event.target` refers to the input element itself, and the `value` of this element is the text it contains).

If you remember from the task list HTML template, this event was captured and it set the optional value received as argument (inside the `$event` variable) to the `desc` property of the item. This allows to update the data inside the task list, where we have declared it.

This parent-child communication allows you to declare and manipulate the data in the parent component, making it much easier to, for example, add new tasks to the page (simply pushing to an array) or sending the data via API.

---

Vue.js is a powerful library that allows you to easily respond to user input in real-time. In this article, we have covered here the specifics of the communication between a hierarchy of components. This allows us to store the data in the most convenient way to manipulate it. But this is just one of Vue's features. If you want to find out more, refer to [the documentation](https://vuejs.org/v2/guide/) or some of the tutorials available online (I found useful the free introduction course in [vueschool.io](https://vueschool.io/courses/vuejs-3-fundamentals)).

Thank you for reading! Hope this post was useful for you. If you have any comments or suggestions, or you just want to let me know something, feel free to do so in the comments section of the post.

[![ko-fi](https://cdn.ko-fi.com/cdn/kofi3.png?v=3)](https://ko-fi.com/P5P76K2OY)