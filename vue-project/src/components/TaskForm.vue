<script setup lang="ts">
import { ref } from 'vue'
import type { Task, TaskCategory, TaskFormData, TaskPriority } from '../types/task'

const props = defineProps<{
  task?: Pick<Task, 'title' | 'dueDate' | 'category' | 'priority'>
  idPrefix: string
  submitLabel: string
}>()

const emit = defineEmits<{
  save: [task: TaskFormData]
  cancel: []
}>()

const title = ref(props.task?.title ?? '')
const dueDate = ref(props.task?.dueDate ?? '')
const category = ref<TaskCategory | ''>(props.task?.category ?? '')
const priority = ref<TaskPriority>(props.task?.priority ?? 'medium')
const titleError = ref('')
const categoryError = ref('')

function validateTitle() {
  const trimmedTitle = title.value.trim()

  if (!trimmedTitle) {
    titleError.value = 'Enter a task title.'
  } else if (trimmedTitle.length > 80) {
    titleError.value = 'Keep the title to 80 characters or fewer.'
  } else {
    titleError.value = ''
  }

  return titleError.value === ''
}

function validateCategory() {
  categoryError.value = category.value ? '' : 'Choose a category.'
  return categoryError.value === ''
}

function submitForm() {
  const titleIsValid = validateTitle()
  const categoryIsValid = validateCategory()
  if (!titleIsValid || !categoryIsValid) return

  emit('save', {
    title: title.value.trim(),
    dueDate: dueDate.value,
    category: category.value as TaskCategory,
    priority: priority.value,
  })

  // A new task form clears after saving. An edit form keeps its values until closed.
  if (!props.task) {
    title.value = ''
    dueDate.value = ''
    category.value = ''
    priority.value = 'medium'
  }
}
</script>

<template>
  <form :class="task ? 'edit-form' : 'add-form'" @submit.prevent="submitForm">
    <div class="add-fields">
      <div class="title-field">
        <label class="visually-hidden" :for="`${idPrefix}-title`">Task title</label>
        <input
          :id="`${idPrefix}-title`"
          v-model="title"
          type="text"
          :placeholder="task ? 'Task title' : 'e.g. Read the Vue guide'"
          autocomplete="off"
          :aria-invalid="Boolean(titleError)"
          :aria-describedby="titleError ? `${idPrefix}-error` : `${idPrefix}-hint`"
          @input="validateTitle"
        />
        <small v-if="titleError" :id="`${idPrefix}-error`" class="field-error" role="alert">
          {{ titleError }}
        </small>
        <small v-else :id="`${idPrefix}-hint`" class="field-hint">Up to 80 characters</small>
      </div>

      <label class="date-field">
        Due date
        <input v-model="dueDate" type="date" />
      </label>

      <label class="choice-field">
        Category
        <select
          v-model="category"
          :id="`${idPrefix}-category`"
          :aria-invalid="Boolean(categoryError)"
          :aria-describedby="categoryError ? `${idPrefix}-category-error` : undefined"
          @change="validateCategory"
        >
          <option value="">Choose category</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="study">Study</option>
        </select>
        <small v-if="categoryError" :id="`${idPrefix}-category-error`" class="field-error" role="alert">
          {{ categoryError }}
        </small>
      </label>

      <label class="choice-field">
        Priority
        <select v-model="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
    </div>

    <button :class="task ? 'save-button' : 'add-button'" type="submit">
      {{ submitLabel }}
    </button>
    <button v-if="task" class="cancel-button" type="button" @click="emit('cancel')">
      Cancel
    </button>
  </form>
</template>
