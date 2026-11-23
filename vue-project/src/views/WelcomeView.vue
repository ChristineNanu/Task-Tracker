<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const profileKey = 'task-tracker-profile'
const router = useRouter()
const profileName = ref(loadProfile())
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isEditing = ref(false)
const isLogin = ref(false)
const showPassword = ref(false)

function loadProfile(): string {
  try {
    return localStorage.getItem(profileKey)?.trim() ?? ''
  } catch {
    return ''
  }
}

function submitAccountForm() {
  const trimmedName = name.value.trim()
  if (!isLogin.value && !trimmedName) {
    errorMessage.value = 'Please enter your first name.'
    return
  }

  try {
    if (isLogin.value) {
      localStorage.removeItem(profileKey)
    } else {
      localStorage.setItem(profileKey, trimmedName)
      profileName.value = trimmedName
    }
    errorMessage.value = ''
    void router.push('/tasks')
  } catch {
    errorMessage.value = 'We couldn’t continue. Please try again.'
  }
}

function selectMode(login: boolean) {
  isLogin.value = login
  password.value = ''
  showPassword.value = false
  errorMessage.value = ''
}
</script>

<template>
  <main class="welcome-page">
    <section class="welcome-layout" aria-labelledby="welcome-title">
      <div class="welcome-copy">
        <div class="welcome-mark" aria-hidden="true">✓</div>
        <p class="eyebrow">A calmer way to get things done</p>
        <h1 id="welcome-title">Make room for what matters.</h1>
        <p class="welcome-description">
          Keep your tasks in one simple place. Add what’s on your mind, and take it one step at a time.
        </p>

        <div class="preview-card" aria-label="Example task list">
          <div class="preview-heading">
            <div>
              <span class="preview-label">YOUR DAY, AT A GLANCE</span>
              <h2>A little progress</h2>
            </div>
            <span class="preview-count">2 of 3</span>
          </div>
          <div class="preview-task is-done">
            <span class="preview-check" aria-hidden="true">✓</span>
            <span>Pick up groceries</span>
          </div>
          <div class="preview-task">
            <span class="preview-check" aria-hidden="true"></span>
            <span>Send that quick email</span>
            <span class="preview-dot" aria-hidden="true"></span>
          </div>
          <div class="preview-task">
            <span class="preview-check" aria-hidden="true"></span>
            <span>Take a proper break</span>
          </div>
        </div>
        <p class="welcome-reassurance"><span aria-hidden="true">✦</span> Simple to start. Easy to come back to.</p>
      </div>

      <div class="welcome-panel">
        <template v-if="profileName && !isEditing">
          <p class="eyebrow">Welcome back</p>
          <h2 class="panel-title">Ready when you are, {{ profileName }}.</h2>
          <p class="panel-description">Pick up right where you left off.</p>
          <RouterLink class="welcome-submit" to="/tasks">Go to my tasks</RouterLink>
          <button class="text-button" type="button" @click="isEditing = true">
            Set up a different profile
          </button>
        </template>

        <template v-else>
          <p class="eyebrow">A little easier, starting now</p>
          <h2 class="panel-title">{{ isLogin ? 'Welcome back.' : 'Create your account.' }}</h2>
          <p class="panel-description">
            {{ isLogin ? 'Log in to get back to your tasks.' : 'It only takes a moment to get started.' }}
          </p>

          <div class="account-switch" aria-label="Choose an option">
            <button
              type="button"
              :class="{ selected: !isLogin }"
              :aria-pressed="!isLogin"
              @click="selectMode(false)"
            >
              Create account
            </button>
            <button
              type="button"
              :class="{ selected: isLogin }"
              :aria-pressed="isLogin"
              @click="selectMode(true)"
            >
              Log in
            </button>
          </div>

          <form class="welcome-form" @submit.prevent="submitAccountForm">
            <template v-if="!isLogin">
              <label for="profile-name">Your first name</label>
              <input
                id="profile-name"
                v-model="name"
                type="text"
                name="name"
                autocomplete="given-name"
                placeholder="e.g. Alex"
                maxlength="60"
                required
              />
            </template>

            <label for="account-email">Email address</label>
            <input
              id="account-email"
              v-model="email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="you@example.com"
              required
            />

            <label for="account-password">Password</label>
            <div class="password-field">
              <input
                id="account-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                :minlength="isLogin ? undefined : 8"
                :placeholder="isLogin ? 'Enter your password' : 'At least 8 characters'"
                required
              />
              <button
                class="password-toggle"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>

            <button class="welcome-submit" type="submit">
              {{ isLogin ? 'Log in' : 'Create account' }}
            </button>
            <p v-if="errorMessage" class="welcome-error" role="alert">{{ errorMessage }}</p>
          </form>

          <p class="privacy-note">
            Demo only: accounts aren’t verified, and your password is never sent or saved. Tasks stay in this browser.
          </p>
          <button v-if="profileName" class="text-button" type="button" @click="isEditing = false">
            Back to {{ profileName }}’s profile
          </button>
        </template>
      </div>
    </section>
  </main>
</template>
