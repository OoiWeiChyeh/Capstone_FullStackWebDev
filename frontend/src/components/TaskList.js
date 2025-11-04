import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, Flag, ListChecks } from "lucide-react";
import { taskAPI } from "../services/api";
import { theme } from "../styles/theme";

const TaskList = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks);
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

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return {
          color: "#ef4444",
          bg: "#fee2e2",
          icon: "🔴",
        };
      case "medium":
        return {
          color: "#f59e0b",
          bg: "#fef3c7",
          icon: "🟡",
        };
      case "low":
        return {
          color: "#10b981",
          bg: "#d1fae5",
          icon: "🟢",
        };
      default:
        return {
          color: "#6b7280",
          bg: "#f3f4f6",
          icon: "⚪",
        };
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed":
        return { color: "#10b981", bg: "#d1fae5", icon: "✅" };
      case "in-progress":
        return { color: "#f59e0b", bg: "#fef3c7", icon: "🚀" };
      case "pending":
        return { color: "#6b7280", bg: "#f3f4f6", icon: "⏳" };
      default:
        return { color: "#6b7280", bg: "#f3f4f6", icon: "⏳" };
    }
  };

  if (loading) {
    return (
      <motion.div
        style={styles.loading}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={styles.spinner}></div>
        <p>Loading your tasks...</p>
      </motion.div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        style={styles.empty}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ListChecks size={64} color={theme.colors.gray[400]} />
        <h3 style={styles.emptyTitle}>No tasks yet! 📝</h3>
        <p style={styles.emptyText}>
          Create your first task above to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <ListChecks
            size={28}
            style={{ marginRight: "12px", color: theme.colors.primary }}
          />
          My Tasks
        </h2>
        <span style={styles.badge}>
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>

      <div style={styles.taskGrid}>
        <AnimatePresence>
          {tasks.map((task, index) => {
            const priorityStyle = getPriorityStyles(task.priority);
            const statusStyle = getStatusStyles(task.status);

            return (
              <motion.div
                key={task._id}
                style={styles.taskCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                }}
              >
                <div style={styles.taskHeader}>
                  <h3 style={styles.taskTitle}>{task.title}</h3>
                  <span
                    style={{
                      ...styles.priorityBadge,
                      backgroundColor: priorityStyle.bg,
                      color: priorityStyle.color,
                    }}
                  >
                    <Flag size={14} style={{ marginRight: "4px" }} />
                    {priorityStyle.icon} {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p style={styles.description}>{task.description}</p>
                )}

                <div style={styles.taskMeta}>
                  {task.dueDate && (
                    <div style={styles.dueDate}>
                      <Calendar size={14} style={{ marginRight: "6px" }} />
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                <div style={styles.taskFooter}>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task._id, e.target.value)
                    }
                    style={{
                      ...styles.statusSelect,
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color,
                    }}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in-progress">🚀 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>

                  <motion.button
                    onClick={() => handleDelete(task._id)}
                    style={styles.deleteBtn}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    color: theme.colors.dark,
    fontSize: "28px",
    fontWeight: "700",
    margin: 0,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
  },
  taskGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  taskCard: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
    backdropFilter: "blur(10px)",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
    gap: "12px",
  },
  taskTitle: {
    margin: 0,
    color: theme.colors.dark,
    fontSize: "18px",
    fontWeight: "600",
    flex: 1,
  },
  priorityBadge: {
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },
  description: {
    color: theme.colors.gray[600],
    fontSize: "14px",
    marginBottom: "16px",
    lineHeight: "1.6",
  },
  taskMeta: {
    marginBottom: "16px",
  },
  dueDate: {
    display: "flex",
    alignItems: "center",
    fontSize: "13px",
    color: theme.colors.gray[600],
    fontWeight: "500",
  },
  taskFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    paddingTop: "16px",
    borderTop: `1px solid ${theme.colors.gray[200]}`,
  },
  statusSelect: {
    flex: 1,
    padding: "10px 14px",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
  },
  deleteBtn: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loading: {
    textAlign: "center",
    padding: "60px 20px",
    color: theme.colors.gray[600],
  },
  spinner: {
    width: "50px",
    height: "50px",
    margin: "0 auto 20px",
    border: `4px solid ${theme.colors.gray[200]}`,
    borderTop: `4px solid ${theme.colors.primary}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  },
  emptyTitle: {
    fontSize: "24px",
    color: theme.colors.dark,
    marginTop: "20px",
    marginBottom: "10px",
  },
  emptyText: {
    color: theme.colors.gray[600],
    fontSize: "16px",
  },
};

export default TaskList;
