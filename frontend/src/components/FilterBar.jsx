import { useEffect, useRef } from 'react'

function FilterBar({
  search,
  setSearch,
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  dueFilter,
  setDueFilter,
  ordering,
  setOrdering,
  totalCount,
}) {
  const searchInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="filter-section">
      <div className="search-row">
        <div className="search-box">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or notes in PostgreSQL..."
            className="input-search"
          />
          <span className="shortcut-hint">/</span>
        </div>

        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="priority-filter"
        >
          <option value="-created_at">Sort: Newest First</option>
          <option value="due_date">Sort: Due Date (Earliest)</option>
          <option value="-due_date">Sort: Due Date (Latest)</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      <div className="filter-bar">
        <div className="filter-group-left">
          <div className="filter-tabs">
            <button
              type="button"
              className={filter === 'ALL' ? 'tab active' : 'tab'}
              onClick={() => setFilter('ALL')}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              className={filter === 'PENDING' ? 'tab active' : 'tab'}
              onClick={() => setFilter('PENDING')}
            >
              Pending
            </button>
            <button
              type="button"
              className={filter === 'COMPLETED' ? 'tab active' : 'tab'}
              onClick={() => setFilter('COMPLETED')}
            >
              Completed
            </button>
          </div>

          <button
            type="button"
            className={dueFilter === 'OVERDUE' ? 'btn-quick-filter active' : 'btn-quick-filter'}
            onClick={() => setDueFilter(dueFilter === 'OVERDUE' ? 'ALL' : 'OVERDUE')}
          >
            Overdue
          </button>
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="priority-filter"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Only</option>
          <option value="MEDIUM">Medium Only</option>
          <option value="LOW">Low Only</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar