import React, { useState, useEffect } from "react";
import { taskAPI } from "../services/api";

const TaskList = ({ refresh, onEditTask }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
    search: "",
    sortBy: "createdAt",
    order: "desc",
    showFavorites: false,
  });
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [refresh, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};

      if (filters.status !== "all") params.status = filters.status;
      if (filters.priority !== "all") params.priority = filters.priority;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.showFavorites) params.favorite = "true";
      params.sortBy = filters.sortBy;
      params.order = filters.order;

      const response = await taskAPI.getTasks(params);
      setTasks(response.data.tasks);
      setFilteredTasks(response.data.tasks);
      setStats(response.data.stats);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskAPI.deleteTask(id);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete task");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await taskAPI.updateTask(id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert("Failed to update task");
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await taskAPI.toggleFavorite(id);
      fetchTasks();
    } catch (err) {
      alert("Failed to toggle favorite");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected");
      return;
    }

    if (window.confirm(`Delete ${selectedTasks.length} selected task(s)?`)) {
      try {
        await taskAPI.bulkDelete(selectedTasks);
        setSelectedTasks([]);
        fetchTasks();
      } catch (err) {
        alert("Failed to delete tasks");
      }
    }
  };

  const handleSelectTask = (id) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task._id));
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredTasks, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `tasks_${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleExportCSV = () => {
    const headers = [
      "Title",
      "Description",
      "Status",
      "Priority",
      "Category",
      "Due Date",
      "Tags",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredTasks.map((task) =>
        [
          `"${task.title}"`,
          `"${task.description || ""}"`,
          task.status,
          task.priority,
          task.category,
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
          `"${task.tags?.join(", ") || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `tasks_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#e74c3c";
      case "medium":
        return "#f39c12";
      case "low":
        return "#3498db";
      default:
        return "#95a5a6";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#27ae60";
      case "in-progress":
        return "#f39c12";
      case "pending":
        return "#95a5a6";
      default:
        return "#95a5a6";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "work":
        return "💼";
      case "personal":
        return "👤";
      case "shopping":
        return "🛒";
      case "health":
        return "💊";
      default:
        return "📌";
    }
  };

  const isOverdue = (task) => {
    return (
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "completed"
    );
  };

  if (loading) {
    return <div style={styles.loading}>⏳ Loading tasks...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Statistics Dashboard */}
      {stats && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{stats.total}</div>
            <div style={styles.statLabel}>Total Tasks</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#95a5a6" }}>
              {stats.pending}
            </div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#f39c12" }}>
              {stats.inProgress}
            </div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#27ae60" }}>
              {stats.completed}
            </div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#e74c3c" }}>
              {stats.overdue}
            </div>
            <div style={styles.statLabel}>Overdue</div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statValue, color: "#ffd700" }}>
              {stats.favorites}
            </div>
            <div style={styles.statLabel}>⭐ Favorites</div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div style={styles.filterContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterRow}>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="pending">⏸️ Pending</option>
            <option value="in-progress">⚡ In Progress</option>
            <option value="completed">✅ Completed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
            style={styles.filterSelect}
          >
            <option value="all">All Priority</option>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            style={styles.filterSelect}
          >
            <option value="all">All Categories</option>
            <option value="work">💼 Work</option>
            <option value="personal">👤 Personal</option>
            <option value="shopping">🛒 Shopping</option>
            <option value="health">💊 Health</option>
            <option value="other">📌 Other</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            style={styles.filterSelect}
          >
            <option value="createdAt">Sort: Created Date</option>
            <option value="dueDate">Sort: Due Date</option>
            <option value="priority">Sort: Priority</option>
            <option value="title">Sort: Title</option>
          </select>

          <button
            onClick={() =>
              setFilters({
                ...filters,
                order: filters.order === "asc" ? "desc" : "asc",
              })
            }
            style={styles.sortBtn}
            title="Toggle sort order"
          >
            {filters.order === "asc" ? "⬆️ Asc" : "⬇️ Desc"}
          </button>

          <button
            onClick={() =>
              setFilters({ ...filters, showFavorites: !filters.showFavorites })
            }
            style={{
              ...styles.favoriteBtn,
              backgroundColor: filters.showFavorites ? "#ffd700" : "#fff",
            }}
            title="Show favorites only"
          >
            ⭐ {filters.showFavorites ? "All" : "Favorites"}
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div style={styles.bulkActions}>
          <span>{selectedTasks.length} task(s) selected</span>
          <button onClick={handleBulkDelete} style={styles.bulkDeleteBtn}>
            🗑️ Delete Selected
          </button>
          <button onClick={() => setSelectedTasks([])} style={styles.clearBtn}>
            Clear Selection
          </button>
        </div>
      )}

      {/* Export Buttons */}
      <div style={styles.exportContainer}>
        <button onClick={handleExportJSON} style={styles.exportBtn}>
          📥 Export JSON
        </button>
        <button onClick={handleExportCSV} style={styles.exportBtn}>
          📊 Export CSV
        </button>
      </div>

      {/* Task List Header */}
      <div style={styles.listHeader}>
        <h2 style={styles.title}>My Tasks ({filteredTasks.length})</h2>
        <label style={styles.selectAllLabel}>
          <input
            type="checkbox"
            checked={
              selectedTasks.length === filteredTasks.length &&
              filteredTasks.length > 0
            }
            onChange={handleSelectAll}
            style={styles.checkbox}
          />
          Select All
        </label>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={styles.empty}>
          <h3>No tasks found! 📝</h3>
          <p>
            {filters.search ||
            filters.status !== "all" ||
            filters.priority !== "all" ||
            filters.category !== "all"
              ? "Try adjusting your filters"
              : "Create your first task above to get started."}
          </p>
        </div>
      ) : (
        <div style={styles.taskGrid}>
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              style={{
                ...styles.taskCard,
                ...(isOverdue(task) ? styles.overdueCard : {}),
                ...(selectedTasks.includes(task._id)
                  ? styles.selectedCard
                  : {}),
              }}
            >
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedTasks.includes(task._id)}
                onChange={() => handleSelectTask(task._id)}
                style={styles.taskCheckbox}
              />

              {/* Favorite Star */}
              <button
                onClick={() => handleToggleFavorite(task._id)}
                style={styles.favoriteIcon}
                title="Toggle favorite"
              >
                {task.isFavorite ? "⭐" : "☆"}
              </button>

              {/* Category Icon */}
              <div style={styles.categoryBadge}>
                {getCategoryIcon(task.category)}
              </div>

              <div style={styles.taskHeader}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <span
                  style={{
                    ...styles.priorityBadge,
                    backgroundColor: getPriorityColor(task.priority),
                  }}
                >
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p style={styles.description}>{task.description}</p>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div style={styles.tagsContainer}>
                  {task.tags.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={styles.taskFooter}>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  style={{
                    ...styles.statusSelect,
                    color: getStatusColor(task.status),
                  }}
                >
                  <option value="pending">⏸️ Pending</option>
                  <option value="in-progress">⚡ In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>

                <div style={styles.actions}>
                  <button
                    onClick={() => onEditTask(task)}
                    style={styles.editBtn}
                    title="Edit task"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    style={styles.deleteBtn}
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {task.dueDate && (
                <div
                  style={{
                    ...styles.dueDate,
                    ...(isOverdue(task) ? styles.overdueBadge : {}),
                  }}
                >
                  📅 {isOverdue(task) ? "⚠️ OVERDUE: " : "Due: "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}

              {task.completedAt && (
                <div style={styles.completedAt}>
                  ✅ Completed:{" "}
                  {new Date(task.completedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: "30px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#7f8c8d",
  },
  filterContainer: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  searchBox: {
    marginBottom: "15px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    border: "2px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterSelect: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    flex: 1,
    minWidth: "150px",
  },
  sortBtn: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  favoriteBtn: {
    padding: "10px 20px",
    border: "2px solid #ffd700",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  bulkActions: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "15px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px",
  },
  bulkDeleteBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  clearBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  exportContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  exportBtn: {
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#2c3e50",
    margin: 0,
  },
  selectAllLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "500",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  taskCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
    position: "relative",
    border: "2px solid transparent",
  },
  selectedCard: {
    border: "2px solid #3498db",
    backgroundColor: "#f0f8ff",
  },
  overdueCard: {
    border: "2px solid #e74c3c",
    backgroundColor: "#fff5f5",
  },
  taskCheckbox: {
    position: "absolute",
    top: "15px",
    left: "15px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  favoriteIcon: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: 0,
  },
  categoryBadge: {
    position: "absolute",
    top: "15px",
    right: "50px",
    fontSize: "20px",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "10px",
    marginTop: "30px",
  },
  taskTitle: {
    margin: 0,
    color: "#2c3e50",
    fontSize: "1.2rem",
    flex: 1,
    paddingRight: "10px",
  },
  priorityBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    color: "white",
    fontWeight: "500",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  },
  description: {
    color: "#7f8c8d",
    fontSize: "14px",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "15px",
  },
  tag: {
    backgroundColor: "#ecf0f1",
    color: "#34495e",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  taskFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "15px",
  },
  statusSelect: {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    flex: 1,
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  editBtn: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  dueDate: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#7f8c8d",
    fontWeight: "500",
  },
  overdueBadge: {
    color: "#e74c3c",
    fontWeight: "bold",
  },
  completedAt: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#27ae60",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#7f8c8d",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "15px",
    borderRadius: "4px",
    textAlign: "center",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default TaskList;
