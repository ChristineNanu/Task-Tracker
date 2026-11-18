export type TaskCategory = 'work' | 'personal' | 'study'
export type TaskPriority = 'low' | 'medium' | 'high'

export type Task = {
  id: number
  title: string
  done: boolean
  dueDate?: string
  // Optional to support tasks saved before category and priority were added.
  category?: TaskCategory
  priority?: TaskPriority
}

export type TaskFormData = {
  title: string
  dueDate: string
  category: TaskCategory
  priority: TaskPriority
}
