import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Calendar, Flag, Activity } from "lucide-react";
import { taskAPI } from "../services/api";
import { theme } from "../styles/theme";

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await taskAPI.createTask(formData);
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        dueDate: "",
      });
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Plus size={28} style={styles.titleIcon} />
          Create New Task
        </h2>
        <p style={styles.subtitle}>Add a new task to your list</p>
      </div>

      {error && (
        <motion.div
          style={styles.error}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FileText size={18} style={styles.labelIcon} />
            Task Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter task title"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            <FileText size={18} style={styles.labelIcon} />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Enter task description (optional)"
            rows="3"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Flag size={18} style={styles.labelIcon} />
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Activity size={18} style={styles.labelIcon} />
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🚀 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Calendar size={18} style={styles.labelIcon} />
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          style={styles.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            "⏳ Creating..."
          ) : (
            <>
              <Plus size={20} style={{ marginRight: "8px" }} />
              Create Task
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

const styles = {
  container: {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))",
    backdropFilter: "blur(10px)",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    marginBottom: "32px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    margin: 0,
    marginBottom: "8px",
    color: theme.colors.dark,
    fontSize: "28px",
    fontWeight: "700",
  },
  titleIcon: {
    marginRight: "12px",
    color: theme.colors.primary,
  },
  subtitle: {
    color: theme.colors.gray[600],
    fontSize: "15px",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontWeight: "600",
    color: theme.colors.gray[700],
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  labelIcon: {
    marginRight: "8px",
    color: theme.colors.primary,
  },
  input: {
    padding: "14px 16px",
    border: `2px solid ${theme.colors.gray[200]}`,
    borderRadius: "12px",
    fontSize: "15px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "white",
  },
  textarea: {
    padding: "14px 16px",
    border: `2px solid ${theme.colors.gray[200]}`,
    borderRadius: "12px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "white",
  },
  select: {
    padding: "14px 16px",
    border: `2px solid ${theme.colors.gray[200]}`,
    borderRadius: "12px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: "white",
  },
  row: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px 24px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: theme.shadows.lg,
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #fecaca",
  },
};

export default TaskForm;
