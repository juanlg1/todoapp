import { useState } from "react";
import "./App.css";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Search, ListTodo, BrushCleaning, NotebookPen } from "lucide-react";
import { Badge } from "./components/ui/badge";
import FormTodo from "./components/Form/FormTodo";
import TodoList from "./components/TodoList";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./components/ui/dialog";
import { Toaster } from "./components/ui/sonner";
import useTodos from "./hooks/useTodos";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";

function App() {

  const { todos, pending, addTodo, completeAllTodo, deleteAllTodo, removeTodo, toggleComplete, updateTodo, isEditOpenDialog, todoEdit, setIsEditOpenDialog, setTodoEdit } = useTodos()

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const handleEditClick = (todo) => {
    setTodoEdit(todo)
    setIsEditOpenDialog(true)
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50" >
        <div className="max-w-4xl mx-auto px-4 py-2 flex flex-col gap-4">
          <header className="flex flex-col gap-2 text-center mt-4">
            <div className="flex justify-center items-center gap-2">
              <ListTodo className="text-blue-400" size={32} />
              <h1 className="text-4xl font-medium">Mis Tareas</h1>
            </div>
            <p className="text-xl">Organiza y gestiona tus tareas diarias</p>
          </header>
          <section className="mx">
            <FormTodo onSave={addTodo} />
          </section>
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input type="text" placeholder="Buscar tareas..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-col sm:flex-row  justify-between gap-4">
            <Card className="px-2 flex flex-col justify-center items-center gap-2 sm:flex-row">
              <p className=" text-sm font-medium">Filtrar por: </p>
              <div className="flex gap-2.5">
                <Button variant={filter === 'all' ? 'default' : 'outline'} className={`cursor-pointer ${filter === 'all' ? 'bg-blue-300 text-black' : ''}`} onClick={() => setFilter('all')} >Todas</Button>
                <Button variant={filter === 'active' ? 'default' : 'outline'} className={`cursor-pointer ${filter === 'active' ? 'bg-blue-300 text-black' : ''}`} onClick={() => setFilter('active')}>Pendientes</Button>
                <Button variant={filter === 'completed' ? 'default' : 'outline'} className={`cursor-pointer ${filter === 'completed' ? 'bg-blue-300 text-black' : ''}`} onClick={() => setFilter('completed')}>Completas</Button>
              </div>
              <hr />
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium whitespace-nowrap">Ordenar por: </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Más recientes</SelectItem>
                      <SelectItem value="oldest">Más antiguas</SelectItem>
                      <SelectItem value="priority-high">Prioridad (Alta primero)</SelectItem>
                      <SelectItem value="priority-medium">Prioridad (Media primero)</SelectItem>
                      <SelectItem value="priority-low">Prioridad (Baja primero)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Card>
            <div className="flex flex-col gap-2">
              {todos.length !== 0 && (
                <>
                  <Button className="bg-blue-300 text-gray-950 hover:bg-blue-400" onClick={completeAllTodo}>Completar Todo</Button>
                  <Button variant="destructive" onClick={deleteAllTodo}>Eliminar realizadas</Button>
                </>
              )}
            </div>
          </div>
          <Card className="px-2">
            {todos.length === 0 ? (
              <div className="flex flex-col justify-center items-center gap-2 p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                <NotebookPen className="text-blue-400" size={38} />
                <p className="text-center font-bold text-xl">Tu agenda está vacía </p>
                <p className="text-center text-base">¡Ingresa una nueva actividad para comenzar!</p>
              </div>
            ) :
              <TodoList
                filter={filter}
                search={search}
                todos={todos}
                toggleComplete={toggleComplete}
                removeTodo={removeTodo}
                handleEdit={handleEditClick}
                sortBy={sortBy}
              />}
          </Card>
          <footer>
            <p className="text-center text-gray-600">
              {todos.length === 0 ? '' : `${pending} de ${todos.length} tareas pendientes`}
            </p>
          </footer>
        </div>
      </div>
      <Dialog open={isEditOpenDialog} onOpenChange={setIsEditOpenDialog} >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Tarea</DialogTitle>
            <DialogDescription>
              Edite los datos de su tarea y guarde para continuar
            </DialogDescription>
            {isEditOpenDialog && (
              <FormTodo
                initialData={todoEdit}
                onSave={updateTodo}
              />
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Toaster richColors position="bottom-right" />
    </>
  );
}

export default App;
