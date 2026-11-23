<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const profileKey = 'task-tracker-profile'
const draftKey = 'task-tracker-account-draft'
type AccountMode = 'signup' | 'login'

interface AccountDraft {
  mode: AccountMode
  step: number
  name: string
  email: string
}

const router = useRouter()
const profileName = ref(loadProfile())
const savedDraft = loadDraft()
const name = ref(savedDraft?.name ?? '')
const email = ref(savedDraft?.email ?? '')
const password = ref('')
const errorMessage = ref('')
const formSaveError = ref('')
const isEditing = ref(Boolean(savedDraft))
const isLogin = ref(savedDraft?.mode === 'login')
const currentStep = ref(savedDraft?.step ?? 1)
const showPassword = ref(false)
const isSubmitting = ref(false)
const totalSteps = computed(() => (isLogin.value ? 2 : 3))

function loadProfile(): string {
  try {
    return localStorage.getItem(profileKey)?.trim() ?? ''
  } catch {
    return ''
  }
}

function loadDraft(): AccountDraft | null {
  try {
    const savedValue = localStorage.getItem(draftKey)
    if (!savedValue) return null

    const value: unknown = JSON.parse(savedValue)
    if (
      typeof value !== 'object' ||
      value === null ||
      !('mode' in value) ||
      (value.mode !== 'signup' && value.mode !== 'login') ||
      !('step' in value) ||
      typeof value.step !== 'number' ||
      !('name' in value) ||
      typeof value.name !== 'string' ||
      !('email' in value) ||
      typeof value.email !== 'string'
    ) {
      return null
    }

    const stepCount = value.mode === 'login' ? 2 : 3
    if (!Number.isInteger(value.step) || value.step < 1 || value.step > stepCount) return null

    return {
      mode: value.mode,
      step: value.step,
      name: value.name,
      email: value.email,
    }
  } catch {
    return null
  }
}

watch([name, email, isLogin, currentStep], () => {
  try {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        mode: isLogin.value ? 'login' : 'signup',
        step: currentStep.value,
        name: name.value,
        email: email.value,
      }),
    )
    formSaveError.value = ''
  } catch {
    formSaveError.value = 'We couldn’t save your progress on this device. Keep this page open.'
  }
})

async function submitAccountForm() {
  if (isSubmitting.value) return

  const trimmedName = name.value.trim()
  if (!isLogin.value && !trimmedName) {
    errorMessage.value = 'Please enter your first name.'
    return
  }

  isSubmitting.value = true
  try {
    if (isLogin.value) {
      localStorage.removeItem(profileKey)
    } else {
      localStorage.setItem(profileKey, trimmedName)
      profileName.value = trimmedName
    }
    localStorage.removeItem(draftKey)
    errorMessage.value = ''
    password.value = ''
    await router.push('/tasks')
  } catch {
    errorMessage.value = 'We couldn’t continue. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

function handleStepSubmit() {
  if (isSubmitting.value) return

  if (!isLogin.value && currentStep.value === 1 && !name.value.trim()) {
    errorMessage.value = 'Please enter your first name.'
    return
  }

  errorMessage.value = ''
  if (currentStep.value < totalSteps.value) {
    currentStep.value += 1
  } else {
    void submitAccountForm()
  }
}

function selectMode(login: boolean) {
  isLogin.value = login
  currentStep.value = 1
  password.value = ''
  showPassword.value = false
  errorMessage.value = ''
}

function goBack() {
  currentStep.value = Math.max(1, currentStep.value - 1)
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

          <div class="account-switch" role="group" aria-label="Choose an option">
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

          <div
            class="form-progress"
            role="progressbar"
            :aria-label="`Step ${currentStep} of ${totalSteps}`"
            aria-valuemin="1"
            :aria-valuemax="totalSteps"
            :aria-valuenow="currentStep"
          >
            <div class="form-progress-fill" :style="{ width: `${(currentStep / totalSteps) * 100}%` }"></div>
          </div>
          <p class="step-label">Step {{ currentStep }} of {{ totalSteps }}</p>

          <form class="welcome-form" @submit.prevent="handleStepSubmit">
            <template v-if="!isLogin && currentStep === 1">
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

            <template v-else-if="(isLogin && currentStep === 1) || (!isLogin && currentStep === 2)">
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
            </template>

            <template v-else>
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
            </template>

            <p v-if="formSaveError" class="welcome-error" role="alert">{{ formSaveError }}</p>
            <p v-if="errorMessage" class="welcome-error" role="alert">{{ errorMessage }}</p>

            <div class="form-actions">
              <button
                v-if="currentStep > 1"
                class="form-back"
                type="button"
                :disabled="isSubmitting"
                @click="goBack"
              >
                Back
              </button>
              <button class="welcome-submit" type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="submit-spinner" aria-hidden="true"></span>
                {{
                  isSubmitting
                    ? 'Opening your tasks…'
                    : currentStep < totalSteps
                      ? 'Continue'
                      : isLogin
                        ? 'Log in'
                        : 'Create account'
                }}
              </button>
            </div>
          </form>

          <p class="privacy-note">
            Demo only: accounts aren’t verified. Your name and email are saved in this browser to remember your progress; your password is never saved or sent.
          </p>
          <button v-if="profileName" class="text-button" type="button" @click="isEditing = false">
            Back to {{ profileName }}’s profile
          </button>
        </template>
      </div>
    </section>
  </main>
</template>
