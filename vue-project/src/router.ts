import { createRouter, createWebHistory } from 'vue-router'
import AboutView from './views/AboutView.vue'
import TasksView from './views/TasksView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: TasksView },
    { path: '/about', component: AboutView },
  ],
})

export default router
