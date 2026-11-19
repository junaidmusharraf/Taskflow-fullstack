function FilterBar({
  search,
  setSearch,
  filter,
  setFilter,
  priorityFilter,
  setPriorityFilter,
  ordering,
  setOrdering,
  totalCount,
}) {
  return (
    <div className="filter-section">
      <div className="search-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks by title or notes in PostgreSQL..."
          className="input-search"
        />
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
        <div className="filter-tabs">
          <button
            className={filter === 'ALL' ? 'tab active' : 'tab'}
            onClick={() => setFilter('ALL')}
          >
            All ({totalCount})
          </button>
          <button
            className={filter === 'PENDING' ? 'tab active' : 'tab'}
            onClick={() => setFilter('PENDING')}
          >
            Pending
          </button>
          <button
            className={filter === 'COMPLETED' ? 'tab active' : 'tab'}
            onClick={() => setFilter('COMPLETED')}
          >
            Completed
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