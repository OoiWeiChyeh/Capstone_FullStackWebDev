import React, { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>📊 My Dashboard</h1>
          <p style={styles.subtitle}>Manage your tasks efficiently</p>
        </div>

        <TaskForm
          onTaskCreated={handleTaskCreated}
          editTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        <TaskList refresh={refreshKey} onEditTask={handleEditTask} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ecf0f1",
    paddingTop: "20px",
    paddingBottom: "40px",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 20px",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    color: "#2c3e50",
    marginBottom: "10px",
    fontSize: "2.5rem",
    fontWeight: "700",
  },
  subtitle: {
    color: "#7f8c8d",
    fontSize: "1.1rem",
    margin: 0,
  },
};

export default Dashboard;
