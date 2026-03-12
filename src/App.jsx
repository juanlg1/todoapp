import { useState, useEffect } from "react";
import "./App.css";
import Todo from "./pages/Todo";

function App() {


  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [tasks, setTasks] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const filteredTask = todos.filter(todo => {
    const searchFilter = todo.text.toLowerCase().includes(search.toLocaleLowerCase())

    const matchesSearch = filter === 'all' ||
      filter === 'active' && !todo.completed ||
      filter === 'completed' && todo.completed
    return searchFilter && matchesSearch
  })

  const addTask = (e) => {
    e.preventDefault()
    try {
      if (!tasks.trim()) return
      const newTodo = {
        id: Date.now(),
        text: tasks,
        completed: false
      }
      setTodos([...todos, newTodo])
      setTasks('')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleComplete = (id) => {
    try {
      setTodos(prev =>
        prev.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
      )
    } catch (error) {
      console.error(error)
    }
  }

  const toggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed)
    setTodos(prev =>
      prev.map(todo => ({ ...todo, completed: !allCompleted }))
    )
  }

  const remaining = todos.filter(todo => todo.completed).length

  const editTodo = (e) => {
    e.preventDefault()
    try {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === editId ? { ...todo, text: tasks } : todo
        )
      )
      setTasks('')
      setEditId(null)
    } catch (error) {
      console.error(error)
    }
  }

  const startEdit = (todo) => {
    setEditId(todo.id)
    setTasks(todo.text)
  }

  const cancelEdit = () => {
    setEditId(null)
    setTasks('')
  }

  const removeTask = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const removeTaskCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }


  return (
    <>
      <h1 className="">Todo app - Lista de tareas</h1>
      <div className="flex margintb">
        {todos.length === 0 ? 'No tienes tareas pendientes' : ` ${remaining} de ${todos.length} tareas completadas`}
        <div className="flex gap">
          <button onClick={() => setFilter('all')}>todos</button>
          <button onClick={() => setFilter('active')}>activas</button>
          <button onClick={() => setFilter('completed')}>completas</button>
        </div>
      </div>
      <div className="flex margintb gap">
        <div className="">
          <form className="flex gap" onSubmit={editId ? editTodo : addTask}>
            <input type="text" placeholder="Ingrese nueva tarea" value={tasks} onChange={(e) => setTasks(e.target.value)} />
            <button className="btn btn-primary" type="submit">{editId ? 'Update' : 'Add'}</button>
            {editId && <button type="button" onClick={cancelEdit}>Cancelar</button>}
          </form>
        </div>
        <div className="flex gap">
          <input type="text" placeholder="Buscar nueva tarea" value={search} onChange={(e) => setSearch(e.target.value)} />
          <button type="button" onClick={toggleAll}>Completar todas</button>
          <button type="button" onClick={removeTaskCompleted}>Eliminar todas</button>
        </div>
      </div>
      {todos.length === 0 && <div>Agrega tu primera tarea para comenzar</div>}
      {filteredTask.map(todo =>
        <div key={todo.id} className="flex">
          <div>
            <p style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</p>
          </div>
          <div className="flex gap margintb">
            <button onClick={() => toggleComplete(todo.id)} style={{ background: todo.completed ? 'green' : 'black' }}>Realizado</button>
            <button onClick={() => startEdit(todo)}>Editar</button>
            <button onClick={() => removeTask(todo.id)}>Eliminar</button>
          </div>
        </div>
      )}

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Todo />
    </>
  );
}

export default App;
