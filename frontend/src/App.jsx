import { useState, useEffect, useCallback } from 'react'
import AuthForm from './components/AuthForm'
import ProjectBar from './components/ProjectBar'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import TaskItem from './components/TaskItem'
import './App.css'

const TASKS_URL = 'http://127.0.0.1:8000/api/tasks/'
const PROJECTS_URL = 'http://127.0.0.1:8000/api/projects/'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || '')
  const [username, setUsername] = useState(() => localStorage.getItem('taskflow_user') || '')

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [filter, setFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [ordering, setOrdering] = useState('-created_at')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleAuthSuccess = (newToken, newUsername) => {
    localStorage.setItem('taskflow_token', newToken)
    localStorage.setItem('taskflow_user', newUsername)
    setToken(newToken)
    setUsername(newUsername)
    setPage(1)
  }

  const handleLogout = useCallback(() => {
    localStorage.removeItem('taskflow_token')
    localStorage.removeItem('taskflow_user')
    setToken('')
    setUsername('')
    setTasks([])
    setProjects([])
  }, [])

  const authHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    }),
    [token]
  )

  const fetchProjects = useCallback(() => {
    if (!token) return
    fetch(PROJECTS_URL, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          handleLogout()
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) setProjects(data)
      })
      .catch((err) => console.error('Error fetching projects:', err))
  }, [token, authHeaders, handleLogout])

  const fetchTasks = useCallback(() => {
    if (!token) return
    const params = new URLSearchParams({
      page: page.toString(),
      ordering,
    })

    if (search.trim()) params.append('search', search.trim())
    if (selectedProject !== 'ALL') params.append('project', selectedProject)
    if (filter !== 'ALL') params.append('completed', filter)
    if (priorityFilter !== 'ALL') params.append('priority', priorityFilter)

    fetch(`${TASKS_URL}?${params.toString()}`, { headers: authHeaders() })
      .then((res) => {
        if (res.status === 401) {
          handleLogout()
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data) {
          setTasks(data.results || [])
          setTotalCount(data.count || 0)
          setHasNext(Boolean(data.next))
          setHasPrev(Boolean(data.previous))
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err)
        setLoading(false)
      })
  }, [token, page, search, selectedProject, filter, priorityFilter, ordering, authHeaders, handleLogout])

  useEffect(() => {
    if (token) {
      fetchProjects()
      fetchTasks()
    }
  }, [token, fetchProjects, fetchTasks])

  if (!token) {
    return (
      <div className="app-container auth-wrapper">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  const handleFilterChange = (setter) => (value) => {
    setter(value)
    setPage(1)
  }

  const handleCreateProject = (projectData) => {
    fetch(PROJECTS_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(projectData),
    }).then(() => fetchProjects())
  }

  const handleAddTask = (newTaskData) => {
    fetch(TASKS_URL, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(newTaskData),
    }).then(() => {
      setPage(1)
      fetchTasks()
      fetchProjects()
    })
  }

  const handleToggleComplete = (task) => {
    fetch(`${TASKS_URL}${task.id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ completed: !task.completed }),
    }).then(() => fetchTasks())
  }

  const handleUpdateTask = (id, updatedFields) => {
    fetch(`${TASKS_URL}${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(updatedFields),
    }).then(() => {
      fetchTasks()
      fetchProjects()
    })
  }

  const handleDeleteTask = (id) => {
    fetch(`${TASKS_URL}${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(() => {
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchTasks()
      }
      fetchProjects()
    })
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 5))

  return (
    <div className="app-container">
      <header className="app-header header-flex">
        <div>
          <h1>TaskFlow</h1>
          <p>Relational PostgreSQL + Django REST + React</p>
        </div>
        <div className="user-controls">
          <span className="user-badge">Signed in as <strong>{username}</strong></span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      <ProjectBar
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={handleFilterChange(setSelectedProject)}
        onCreateProject={handleCreateProject}
      />

      <TaskForm projects={projects} onAddTask={handleAddTask} />

      <FilterBar
        search={search}
        setSearch={handleFilterChange(setSearch)}
        filter={filter}
        setFilter={handleFilterChange(setFilter)}
        priorityFilter={priorityFilter}
        setPriorityFilter={handleFilterChange(setPriorityFilter)}
        ordering={ordering}
        setOrdering={handleFilterChange(setOrdering)}
        totalCount={totalCount}
      />

      {loading ? (
        <p className="empty-state">Querying PostgreSQL...</p>
      ) : tasks.length === 0 ? (
        <p className="empty-state">No tasks yet. Create your first private task above!</p>
      ) : (
        <>
          <ul className="task-list">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                projects={projects}
                onToggleComplete={handleToggleComplete}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </ul>

          <div className="pagination-bar">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!hasPrev}
              className="btn-page"
            >
              &larr; Previous
            </button>
            <span className="page-info">
              Page {page} of {totalPages} ({totalCount} total)
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNext}
              className="btn-page"
            >
              Next &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default App