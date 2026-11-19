import { useState } from 'react'

function TaskForm({ projects, onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [projectId, setProjectId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      due_date: dueDate || null,
      project: projectId ? Number(projectId) : null,
      completed: false,
    })

    setTitle('')
    setDescription('')
    setPriority('MEDIUM')
    setDueDate('')
    setProjectId('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
          className="input-main"
          required
        />
      </div>

      <div className="form-row-split">
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="input-select"
        >
          <option value="">No Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-select"
        >
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
      </div>

      <div className="form-row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-date"
        />
      </div>

      <div className="form-row">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional notes or details..."
          className="input-desc"
        />
        <button type="submit" className="btn-primary">+ Add Task</button>
      </div>
    </form>
  )
}

export default TaskForm