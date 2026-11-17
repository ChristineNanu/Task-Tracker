<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TaskItem from '../components/TaskItem.vue'

// ref() makes these values reactive, so Vue updates the page when they change.
type Task = { id: number; title: string; done: boolean; dueDate?: string }

const newTask = ref('')
const newDueDate = ref('')
const titleError = ref('')
const isLoadingSamples = ref(false)
const sampleLoadError = ref('')
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
  if (!validateTitle()) return

  tasks.value.push({
    id: Date.now(),
    title,
    done: false,
    dueDate: newDueDate.value || undefined,
  })
  newTask.value = ''
  newDueDate.value = ''
  titleError.value = ''
}

function validateTitle() {
  const title = newTask.value.trim()

  if (!title) {
    titleError.value = 'Enter a task title.'
  } else if (title.length > 80) {
    titleError.value = 'Keep the title to 80 characters or fewer.'
  } else {
    titleError.value = ''
  }

  return titleError.value === ''
}

function deleteTask(id: number) {
  tasks.value = tasks.value.filter((task) => task.id !== id)
}

function toggleTask(id: number) {
  const task = tasks.value.find((task) => task.id === id)
  if (task) task.done = !task.done
}

function editTask(id: number, title: string, dueDate: string) {
  const task = tasks.value.find((task) => task.id === id)
  if (task) {
    task.title = title
    task.dueDate = dueDate || undefined
  }
}

async function loadSampleTasks() {
  isLoadingSamples.value = true
  sampleLoadError.value = ''

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
    if (!response.ok) throw new Error('Request failed')

    const sampleTasks = (await response.json()) as {
      id: number
      title: string
      completed: boolean
    }[]

    tasks.value.push(
      ...sampleTasks.map((task, index) => ({
        id: Date.now() + index,
        title: task.title,
        done: task.completed,
      })),
    )
  } catch {
    sampleLoadError.value = 'Could not load sample tasks. Check your internet connection and try again.'
  } finally {
    isLoadingSamples.value = false
  }
}
</script>

<template>
  <main class="page">
    <section class="task-card" aria-labelledby="page-title">
      <p class="eyebrow">A small Vue app</p>
      <h1 id="page-title">My tasks</h1>
      <p class="intro">Keep track of the things you want to get done.</p>

      <form class="add-form" @submit.prevent="addTask">
        <div class="add-fields">
          <div class="title-field">
            <label class="visually-hidden" for="new-task">New task</label>
            <input
              id="new-task"
              v-model="newTask"
              type="text"
              placeholder="e.g. Read the Vue guide"
              autocomplete="off"
              :aria-invalid="Boolean(titleError)"
              :aria-describedby="titleError ? 'title-error' : 'title-hint'"
              @input="validateTitle"
            />
            <small v-if="titleError" id="title-error" class="field-error" role="alert">
              {{ titleError }}
            </small>
            <small v-else id="title-hint" class="field-hint">Up to 80 characters</small>
          </div>
          <label class="date-field">
            Due date
            <input v-model="newDueDate" type="date" />
          </label>
        </div>
        <button class="add-button" type="submit">Add task</button>
      </form>

      <div class="api-demo">
        <button
          class="sample-button"
          type="button"
          :disabled="isLoadingSamples"
          @click="loadSampleTasks"
        >
          {{ isLoadingSamples ? 'Loading…' : 'Load sample tasks from API' }}
        </button>
        <p v-if="sampleLoadError" class="api-error" role="alert">{{ sampleLoadError }}</p>
      </div>

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
        <TaskItem
          v-for="task in visibleTasks"
          :key="task.id"
          :task="task"
          @toggle="toggleTask"
          @delete="deleteTask"
          @edit="editTask"
        />
      </ul>
      <p v-else class="empty-message">
        {{ tasks.length ? 'No tasks match this filter.' : 'No tasks yet. Add one above to get started.' }}
      </p>

      <p class="hint">Tip: check a task when it’s done.</p>
    </section>
  </main>
</template>
