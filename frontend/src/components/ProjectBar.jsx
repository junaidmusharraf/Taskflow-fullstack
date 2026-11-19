import { useState } from 'react'

function ProjectBar({ projects, selectedProject, setSelectedProject, onCreateProject }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#2563eb')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateProject({ name: name.trim(), color })
    setName('')
  }

  return (
    <div className="project-section">
      <div className="project-pills">
        <button
          className={selectedProject === 'ALL' ? 'pill active' : 'pill'}
          onClick={() => setSelectedProject('ALL')}
        >
          All Projects
        </button>
        {projects.map((proj) => (
          <button
            key={proj.id}
            className={selectedProject === proj.id ? 'pill active' : 'pill'}
            style={{ borderLeft: `4px solid ${proj.color}` }}
            onClick={() => setSelectedProject(proj.id)}
          >
            {proj.name} ({proj.task_count})
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="project-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New project name..."
          className="input-small"
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Pick project color"
          className="input-color"
        />
        <button type="submit" className="btn-secondary">+ Project</button>
      </form>
    </div>
  )
}

export default ProjectBar