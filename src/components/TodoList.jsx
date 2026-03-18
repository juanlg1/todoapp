import { Circle, CircleCheck, Edit2, SearchX, Trash2 } from 'lucide-react'
import React, { useMemo } from 'react'
import { Button } from './ui/button'
import useDebounce from '@/hooks/useDebounce'

const TodoList = ({ todos, search, filter, toggleComplete, removeTodo, handleEdit, sortBy }) => {

  const debounceSearch = useDebounce(search, 500)

  const filteredSearch = useMemo(() => {
    const filtered = todos.filter(todo => {
      const inputFilter = todo.title.toLowerCase().includes(debounceSearch.toLowerCase()) ||
        todo.description.toLowerCase().includes(debounceSearch.toLowerCase())
      const matchesSearch = filter === 'all' || (filter === 'active' && !todo.completed) || (filter === 'completed' && todo.completed)
      return inputFilter && matchesSearch
    })

    return filtered.sort((a, b) => {
      // Ordena por fecha mas reciente primero
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      // Ordena por fecha mas antigua primero
      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      // Ordena por prioridad (Alta antes que media, media antes que baja)

      if (sortBy === 'priority-high') {
        // Peso numerico a cada palabra para compararlas
        const weight = { 'Alta': 3, 'Media': 2, 'Baja': 1 }
        // Comparacion de pesos(Ej: 3 - 2 = 1, si es positivo b va despues)
        const diff = weight[b.priority] - weight[a.priority]
        // Si tienen la misma prioridad, desempatamos por fecha mas reciente
        if (diff === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return diff
      }

      if (sortBy === 'priority-medium') {
        const weight = { 'Media': 3, 'Alta': 2, 'Baja': 1 }

        const diff = weight[b.priority] - weight[a.priority]
        if (diff === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return diff
      }

      if (sortBy === 'priority-low') {
        const weight = { 'Baja': 3, 'Media': 2, 'Alta': 1 }
        const diff = weight[b.priority] - weight[a.priority]
        if (diff === 0) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return diff
      }
      return 0 // por si acaso
    })
  }, [todos, debounceSearch, filter, sortBy])

  if (filteredSearch.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 mt-4">
        <SearchX className="h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-1">No se encontraron tareas</h3>
        <p className="text-slate-500">
          Intenta buscar con otras palabras o cambiar el filtro arriba.
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
      {filteredSearch.map(todo => (
        <div key={todo.id} className={`p-4 rounded-xl flex flex-col justify-between gap-4 bg-card ring-1 ring-foreground/10 ${todo.completed ? 'opacity-60 line-through' : 'opacity-100'}`}>
          <div className="flex items-start justify-between">
            <div>
              {todo.completed ?
                <CircleCheck className='text-blue-400 cursor-pointer' onClick={() => toggleComplete(todo.id)} /> :
                <Circle className="text-slate-400 cursor-pointer" onClick={() => toggleComplete(todo.id)} />}
            </div>

            <p className={`${todo.priority === 'Alta' && 'bg-red-200 text-red-500' ||
              todo.priority === 'Media' && 'bg-yellow-200 text-yellow-900' ||
              todo.priority === 'Baja' && 'bg-blue-300 text-blue-900'} font-medium rounded-xl px-2 py-1 text-xs`}>
              {todo.priority}
            </p>
          </div>
          <div className="flex flex-col gap-2 wrap-break-word">
            <h2 className="text-xl font-bold line-clamp-3" >{todo.title}</h2>
            <p className="text-slate-500 text-sm line-clamp-4">{todo.description}</p>
          </div>

          <div className="flex justify-between items-center mt-2 border-t pt-2">
            <p className="text-xs text-slate-400">Fecha: {new Date(todo.createdAt).toLocaleDateString()}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => handleEdit(todo)}>
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => removeTodo(todo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TodoList