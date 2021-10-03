var taskTemplate = `
  <div class="list-group-item">
    <input
      type="text"
      placeholder="Insert your task"
      :value="desc"
      @input="$emit('update:desc', $event.target.value)"
      class="form-control"
    />
    <select
      class="form-select"
      aria-label="Priority Selection"
      @change="$emit('change:priority', $event.target.value)"
    >
      <option disabled selected hidden>Priority</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
    <input
      type="checkbox"
      :checked="done"
      @change="$emit('change:done', $event.target.checked)"
      class="form-check-input"
    />
  </div>
`;

Vue.component("task-item", {
  props: {
      id: Number,
      desc: String,
      priority: String,
      done: Boolean
  },
  template: taskTemplate
});

var listTemplate = `
    <div id="task-list" class="list-group w-75 mt-3 m-auto">
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
        <div id="submit-button" class="my-3 w-25 mx-auto">
            <button type="button" class="btn btn-primary" @click="sendData">Submit</button>
      </div>
    </div>
`;

Vue.component("task-list", {
    data () {
        return {
            tasks: [
                { id: 1, desc: "", priority: "Priority", done: false },
                { id: 2, desc: "", priority: "Priority", done: false },
            ]
        }
    },
    methods: {
        newTask() {
            this.tasks.push({ id: this.tasks.length + 1, desc: "", priority: "Priority", done: false })
        },
        sendData () {
            axios.post(TASK_API_URL, this.tasks)
                .then(function (response) {console.log(response);})
        }
    },
    template: listTemplate
});

Vue.config.devtools=true;

var app = new Vue({
    el: "#app"
});
