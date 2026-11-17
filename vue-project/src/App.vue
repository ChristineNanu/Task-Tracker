<script setup lang="ts">
import { computed, ref, watch } from 'vue'

// ref() makes these values reactive, so Vue updates the page when they change.
type Task = { id: number; title: string; done: boolean }

const newTask = ref('')
const starterTasks: Task[] = [
  { id: 1, title: 'Learn what a Vue component is', done: false },
  { id: 2, title: 'Add my first task', done: true },
]

function loadTasks(): Task[] {
  const savedTasks = localStorage.getItem('my-tasks')
  if (!savedTasks) return starterTasks

  try {
    return JSON.parse(savedTasks) as Task[]
  } catch {
    return starterTasks
  }
}

const tasks = ref<Task[]>(loadTasks())
const currentFilter = ref<'all' | 'active' | 'completed'>('all')
const filters = ['all', 'active', 'completed'] as const
const filterLabels = { all: 'All', active: 'Active', completed: 'Completed' }

const remainingTasks = computed(() => tasks.value.filter((task) => !task.done).length)
const visibleTasks = computed(() => {
  if (currentFilter.value === 'active') return tasks.value.filter((task) => !task.done)
  if (currentFilter.value === 'completed') return tasks.value.filter((task) => task.done)
  return tasks.value
})

// watch() saves the list whenever it changes. deep: true also catches changes
// inside a task, like checking or unchecking its checkbox.
watch(
  tasks,
  (newTasks) => {
    localStorage.setItem('my-tasks', JSON.stringify(newTasks))
  },
  { deep: true },
)

function addTask() {
  const title = newTask.value.trim()
  if (!title) return

  tasks.value.push({ id: Date.now(), title, done: false })
  newTask.value = ''
}

function deleteTask(id: number) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}
</script>

<template>
  <main class="page">
    <section class="task-card" aria-labelledby="page-title">
      <p class="eyebrow">A small Vue app</p>
      <h1 id="page-title">My tasks</h1>
      <p class="intro">Keep track of the things you want to get done.</p>

      <form class="add-form" @submit.prevent="addTask">
        <label class="visually-hidden" for="new-task">New task</label>
        <input
          id="new-task"
          v-model="newTask"
          type="text"
          placeholder="e.g. Read the Vue guide"
          autocomplete="off"
        />
        <button class="add-button" type="submit">Add task</button>
      </form>

      <div class="list-heading">
        <h2>Task list</h2>
        <span>{{ remainingTasks }} left</span>
      </div>

      <div class="filters" aria-label="Filter tasks">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          :class="{ selected: currentFilter === filter }"
          :aria-pressed="currentFilter === filter"
          @click="currentFilter = filter"
        >
          {{ filterLabels[filter] }}
        </button>
      </div>

      <ul v-if="visibleTasks.length" class="task-list">
        <li v-for="task in visibleTasks" :key="task.id" class="task-row">
          <label class="task-label" :class="{ completed: task.done }">
            <input v-model="task.done" type="checkbox" />
            <span>{{ task.title }}</span>
          </label>
          <button
            class="delete-button"
            type="button"
            :aria-label="`Delete ${task.title}`"
            @click="deleteTask(task.id)"
          >
            Delete
          </button>
        </li>
      </ul>
      <p v-else class="empty-message">
        {{ tasks.length ? 'No tasks match this filter.' : 'No tasks yet. Add one above to get started.' }}
      </p>

      <p class="hint">Tip: check a task when it’s done.</p>
    </section>
  </main>
</template>
