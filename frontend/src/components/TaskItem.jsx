import { useState } from 'react'

function TaskItem({ task, projects, onToggleComplete, onUpdateTask, onDeleteTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDesc, setEditDesc] = useState(task.description || '')
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editDueDate, setEditDueDate] = useState(task.due_date || '')
  const [editProject, setEditProject] = useState(task.project || '')

  const handleSave = () => {
    if (!editTitle.trim()) return
    onUpdateTask(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      due_date: editDueDate || null,
      project: editProject ? Number(editProject) : null,
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="task-card editing">
        <div className="edit-grid">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-main"
          />
          <select
            value={editProject}
            onChange={(e) => setEditProject(e.target.value)}
            className="input-select"
          >
            <option value="">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="input-select"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="input-date"
          />
        </div>
        <input
          type="text"
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description..."
          className="input-desc"
        />
        <div className="edit-actions">
          <button onClick={handleSave} className="btn-save">Save</button>
          <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task)}
          className="task-checkbox"
        />
        <div className="task-content">
          <div className="task-header">
            <span className="task-title">{task.title}</span>
            {task.project_name && (
              <span
                className="badge project-badge"
                style={{ backgroundColor: task.project_color, color: '#fff' }}
              >
                {task.project_name}
              </span>
            )}
            <span className={`badge badge-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            {task.due_date && (
              <span className="due-date">Due: {task.due_date}</span>
            )}
          </div>
          {task.description && <p className="task-desc">{task.description}</p>}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => setIsEditing(true)} className="btn-edit">Edit</button>
        <button onClick={() => onDeleteTask(task.id)} className="btn-delete">Delete</button>
      </div>
    </li>
  )
}

export default TaskItem