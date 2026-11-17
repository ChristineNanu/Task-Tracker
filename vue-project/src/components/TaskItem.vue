<script setup lang="ts">
import { ref } from 'vue'
import TaskForm from './TaskForm.vue'

type Task = { id: number; title: string; done: boolean; dueDate?: string }

// The parent passes this task into the component as a prop.
const props = defineProps<{ task: Task }>()

// These events let the parent know when the user changes this task.
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, title: string, dueDate: string]
}>()

const isEditing = ref(false)

function startEditing() {
  isEditing.value = true
}

function saveEdit(formData: { title: string; dueDate: string }) {
  emit('edit', props.task.id, formData.title, formData.dueDate)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

function formatDueDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<template>
  <li class="task-row">
    <TaskForm
      v-if="isEditing"
      :task="task"
      :id-prefix="`edit-task-${task.id}`"
      submit-label="Save"
      @save="saveEdit"
      @cancel="cancelEdit"
    />

    <template v-else>
      <label class="task-label" :class="{ completed: task.done }">
        <input
          type="checkbox"
          :checked="task.done"
          @change="emit('toggle', task.id)"
        />
        <span class="task-details">
          <span>{{ task.title }}</span>
          <small v-if="task.dueDate">Due {{ formatDueDate(task.dueDate) }}</small>
        </span>
      </label>
      <div class="row-actions">
        <button class="edit-button" type="button" @click="startEditing">Edit</button>
        <button
          class="delete-button"
          type="button"
          :aria-label="`Delete ${task.title}`"
          @click="emit('delete', task.id)"
        >
          Delete
        </button>
      </div>
    </template>
  </li>
</template>
