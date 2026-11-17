<script setup lang="ts">
import { ref } from 'vue'

type Task = { title: string; dueDate?: string }

const props = defineProps<{
  task?: Task
  idPrefix: string
  submitLabel: string
}>()

const emit = defineEmits<{
  save: [task: { title: string; dueDate: string }]
  cancel: []
}>()

const title = ref(props.task?.title ?? '')
const dueDate = ref(props.task?.dueDate ?? '')
const titleError = ref('')

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

function submitForm() {
  if (!validateTitle()) return

  emit('save', { title: title.value.trim(), dueDate: dueDate.value })

  // A new task form clears after saving. An edit form keeps its values until closed.
  if (!props.task) {
    title.value = ''
    dueDate.value = ''
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
    </div>
    <button :class="task ? 'save-button' : 'add-button'" type="submit">
      {{ submitLabel }}
    </button>
    <button v-if="task" class="cancel-button" type="button" @click="emit('cancel')">
      Cancel
    </button>
  </form>
</template>
