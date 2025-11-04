import React, { useState } from "react";
import { motion } from "framer-motion";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.content}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={styles.heroSection}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 style={styles.welcomeTitle}>Welcome to Your Dashboard 🎯</h1>
          <p style={styles.welcomeText}>
            Manage your tasks efficiently and stay productive
          </p>
        </motion.div>

        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList refresh={refreshKey} />
      </motion.div>

      <div style={styles.backgroundPattern}></div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    paddingTop: "40px",
    paddingBottom: "60px",
    position: "relative",
    overflow: "hidden",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    position: "relative",
    zIndex: 1,
  },
  heroSection: {
    textAlign: "center",
    marginBottom: "48px",
  },
  welcomeTitle: {
    fontSize: "48px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "12px",
    letterSpacing: "-1px",
  },
  welcomeText: {
    fontSize: "18px",
    color: "#6b7280",
    fontWeight: "500",
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },
};

export default Dashboard;
