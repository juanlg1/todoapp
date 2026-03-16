import { useState, useEffect } from 'react'
import { toast } from 'sonner'

const useTodos = () => {

  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [isEditOpenDialog, setIsEditOpenDialog] = useState(false)
  const [todoEdit, setTodoEdit] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (newTodo) => {
    try {
      setTodos(prev => [...prev, newTodo])
      toast.success('¡Tarea agregada exitosamente!', {
        description: `Se agregó: ${newTodo.title}`
      })
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error al agregar la tarea')
    }
  }

  const updateTodo = (updatedTodo) => {
    setTodos(prev => prev.map(
      todo => todo.id === updatedTodo.id ? updatedTodo : todo
    ))
    setIsEditOpenDialog(false)
    setTodoEdit(null)
    toast.success('¡Tarea actualizada!', {
      description: 'Los cambios se guardaron correctamente.'
    })
  }

  const removeTodo = (id) => {
    const todoToRemove = todos.find(todo => todo.id === id)
    toast.warning('Estas seguro de eliminar esta tarea?', {
      description: `Se eliminara ${todoToRemove?.title}`,
      action: {
        label: 'Eliminar',
        onClick: () => {
          setTodos(prev => prev.filter(todo => todo.id !== id))
          toast.success('Tarea eliminada permanentemente')
        }
      },
      cancel: {
        label: 'Cancelar'
      }
    })
  }

  const deleteAllTodo = () => {
    try {
      toast.warning('Estas seguro de eliminar todas las tareas completadas?', {
        description: `Se eliminaran de forma permanente`,
        action: {
          label: 'Eliminar',
          onClick: () => {
            setTodos(prev => prev.filter(todo => !todo.completed))
            toast.success('Tareas completadas eliminadas')
          }
        },
        cancel: {
          label: 'Cancelar'
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const completeAllTodo = () => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev => prev.map(todo => ({ ...todo, completed: !allCompleted }))
    )
    if (!allCompleted) {
      toast.success('¡Todas las tareas marcadas como completadas!')
    } else {
      toast.info('Todas las tareas marcadas como pendientes')
    }
  }

  const toggleComplete = (id) => {
    try {
      const todoToToggle = todos.find(todo => todo.id === id)
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
      if (todoToToggle) {
        if (!todoToToggle.completed) {
          toast.success('¡Tarea completada!', { description: todoToToggle.title })
        } else {
          toast.info('Tarea pendiente', { description: todoToToggle.title })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const pending = todos.filter(todo => !todo.completed).length


  return {
    todos,
    pending,
    isEditOpenDialog,
    setIsEditOpenDialog,
    setTodoEdit,
    todoEdit,
    addTodo,
    updateTodo,
    removeTodo,
    deleteAllTodo,
    completeAllTodo,
    toggleComplete
  }
}

export default useTodos