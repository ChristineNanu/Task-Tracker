<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const signOutError = ref('')

function signOut() {
  try {
    localStorage.removeItem('task-tracker-profile')
    signOutError.value = ''
    void router.push('/')
  } catch {
    signOutError.value = 'Could not log out. Please try again.'
  }
}
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-name" to="/">My Tasks</RouterLink>
    <nav aria-label="Main navigation">
      <RouterLink v-if="route.path !== '/'" to="/tasks" active-class="active-link">Tasks</RouterLink>
      <RouterLink to="/about" active-class="active-link">About</RouterLink>
      <button v-if="route.path !== '/'" class="logout-button" type="button" @click="signOut">
        Log out
      </button>
    </nav>
    <span v-if="signOutError" class="logout-error" role="alert">{{ signOutError }}</span>
  </header>
</template>
