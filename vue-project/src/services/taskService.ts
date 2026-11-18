import type { Task } from '../types/task'

type SampleTodo = {
  id: number
  title: string
  completed: boolean
}

export async function getSampleTasks(): Promise<Task[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  if (!response.ok) {
    throw new Error('Could not load sample tasks')
  }

  const sampleTodos = (await response.json()) as SampleTodo[]

  return sampleTodos.map((todo, index) => ({
    id: Date.now() + index,
    title: todo.title,
    done: todo.completed,
    category: 'study' as const,
    priority: 'medium' as const,
  }))
}
