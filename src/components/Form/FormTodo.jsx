import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { Plus, Save } from 'lucide-react'
import { toast } from 'sonner'

const FormTodo = ({ onSave, initialData }) => {

  const [title, setTitle] = useState(initialData ? initialData.title : '')
  const [description, setDescription] = useState(initialData ? initialData.description : '')
  const [priority, setPriority] = useState(initialData ? initialData.priority : '')

  const sendData = (e) => {
    e.preventDefault()
    try {
      if (!title.trim() || !priority.trim()) {
        toast.warning('Campos incompletos', {
          description: 'Por favor, ingresa un titulo y selecciona una prioridad.'
        })
        return
      }
      const todoData = {
        id: initialData ? initialData.id : Date.now(),
        title: title,
        description: description,
        completed: initialData ? initialData.completed : false,
        priority: priority,
        createdAt: initialData ? initialData.createdAt : new Date()
      }
      onSave(todoData)
      if (!initialData) {
        setTitle('')
        setPriority('')
        setDescription('')
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Card className='px-2'>
      <div className="flex justify-between gap-2">
        <Input
          type={"text"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={"Título de la tarea"}
        />
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Prioridad"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup >
              <SelectLabel>Seleccione una:</SelectLabel>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Media">Media</SelectItem>
              <SelectItem value="Baja">Baja</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-between gap-2">
        <Input
          placeholder="Descripción (opcional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={sendData} className="bg-blue-400 text-gray-950">
          {initialData ? <><Save /> Guardar </> : <> <Plus /> Agregar </>}
        </Button>
      </div>
    </Card>
  )
}

export default FormTodo