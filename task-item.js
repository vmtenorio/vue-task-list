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
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <p><span>Done?</span>
    <input
      type="checkbox"
      :checked="done"
      @change="$emit('change:done', $event.target.checked)"
      class="form-check-input"
    />
    </p>
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
