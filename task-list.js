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

            // Remove the element to delete previously submitted tasks
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
