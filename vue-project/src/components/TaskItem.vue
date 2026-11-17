<script setup lang="ts">
import { ref } from 'vue'

type Task = { id: number; title: string; done: boolean }

// The parent passes this task into the component as a prop.
const props = defineProps<{ task: Task }>()

// These events let the parent know when the user changes this task.
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, title: string]
}>()

const isEditing = ref(false)
const editedTitle = ref('')

function startEditing() {
  editedTitle.value = props.task.title
  isEditing.value = true
}

function saveEdit() {
  const title = editedTitle.value.trim()
  if (!title) return

  emit('edit', props.task.id, title)
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <li class="task-row">
    <form v-if="isEditing" class="edit-form" @submit.prevent="saveEdit">
      <label class="visually-hidden" :for="`edit-task-${task.id}`">Edit task</label>
      <input :id="`edit-task-${task.id}`" v-model="editedTitle" />
      <button class="save-button" type="submit">Save</button>
      <button class="cancel-button" type="button" @click="cancelEdit">Cancel</button>
    </form>

    <template v-else>
      <label class="task-label" :class="{ completed: task.done }">
        <input
          type="checkbox"
          :checked="task.done"
          @change="emit('toggle', task.id)"
        />
        <span>{{ task.title }}</span>
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
