import React, { useState } from "react";
import { taskAPI } from "../services/api";

const TaskForm = ({ onTaskCreated, editTask, onCancelEdit }) => {
  const [formData, setFormData] = useState(
    editTask || {
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      category: "other",
      dueDate: "",
      tags: "",
      isFavorite: false,
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (editTask) {
      setFormData({
        ...editTask,
        tags: editTask.tags ? editTask.tags.join(", ") : "",
      });
    }
  }, [editTask]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
      };

      if (editTask) {
        await taskAPI.updateTask(editTask._id, taskData);
      } else {
        await taskAPI.createTask(taskData);
      }

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "pending",
        category: "other",
        dueDate: "",
        tags: "",
        isFavorite: false,
      });

      if (onCancelEdit) onCancelEdit();
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          {editTask ? "✏️ Edit Task" : "➕ Create New Task"}
        </h2>
        {editTask && (
          <button onClick={onCancelEdit} style={styles.cancelBtn}>
            Cancel
          </button>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Title *
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter task title"
            />
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter task description"
              rows="3"
            />
          </label>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Priority
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
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="pending">⏸️ Pending</option>
                <option value="in-progress">⚡ In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="work">💼 Work</option>
                <option value="personal">👤 Personal</option>
                <option value="shopping">🛒 Shopping</option>
                <option value="health">💊 Health</option>
                <option value="other">📌 Other</option>
              </select>
            </label>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Due Date
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate ? formData.dueDate.split("T")[0] : ""}
                onChange={handleChange}
                style={styles.input}
              />
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Tags (comma-separated)
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., urgent, review, meeting"
              />
            </label>
          </div>
        </div>

        <div style={styles.checkboxGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="isFavorite"
              checked={formData.isFavorite}
              onChange={handleChange}
              style={styles.checkbox}
            />
            ⭐ Mark as Favorite
          </label>
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading
            ? "⏳ Saving..."
            : editTask
            ? "💾 Update Task"
            : "➕ Create Task"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    margin: 0,
    color: "#2c3e50",
  },
  cancelBtn: {
    backgroundColor: "#95a5a6",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    marginBottom: "5px",
    fontWeight: "500",
    color: "#34495e",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    resize: "vertical",
  },
  select: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  },
  row: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "500",
    color: "#34495e",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  button: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
  },
};

export default TaskForm;
