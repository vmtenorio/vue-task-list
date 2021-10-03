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
    data () {
        return {
            tasks: [
                { id: 1, desc: "", priority: "Medium", done: false },
                { id: 2, desc: "", priority: "Medium", done: false },
            ]
        }
    },
    methods: {
        newTask() {
            this.tasks.push({ id: this.tasks.length + 1, desc: "", priority: "Medium", done: false })
        },
        sendData () {
            // You could send your data via API
            //axios.post(TASK_API_URL, this.tasks)
            //    .then(function (response) {console.log(response);})
            var submittedList = document.getElementById("taskSubmitted");
            submittedList.innerHTML = '';

            var newItem, itemStr;
            this.tasks.forEach(function (t) {
                newItem = document.createElement("li");
                itemStr = "";
                itemStr += t.desc;
                itemStr += " - Priority " + t.priority;
                itemStr += " - Done? " + t.done.toString();
                newItem.textContent = itemStr;
                submittedList.appendChild(newItem);
            });
        }
    },
    template: listTemplate
});
