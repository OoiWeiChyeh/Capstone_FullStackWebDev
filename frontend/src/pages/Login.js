import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    const result = await login(formData);

    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div style={styles.container}>
      <motion.div
        style={styles.card}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div style={styles.header} variants={itemVariants}>
          <div style={styles.iconWrapper}>
            <LogIn size={48} color="white" />
          </div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Login to manage your tasks</p>
        </motion.div>

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
          <motion.div style={styles.formGroup} variants={itemVariants}>
            <label style={styles.label}>
              <Mail size={18} style={styles.labelIcon} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div style={styles.formGroup} variants={itemVariants}>
            <label style={styles.label}>
              <Lock size={18} style={styles.labelIcon} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter your password"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            style={styles.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variants={itemVariants}
          >
            {loading ? (
              "Logging in..."
            ) : (
              <>
                Login <ArrowRight size={20} style={{ marginLeft: "8px" }} />
              </>
            )}
          </motion.button>
        </form>

        <motion.p style={styles.footer} variants={itemVariants}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </motion.p>
      </motion.div>

      <div style={styles.backgroundDecoration}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    padding: "50px 40px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "480px",
    position: "relative",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  iconWrapper: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: theme.shadows.lg,
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: theme.colors.dark,
    marginBottom: "10px",
  },
  subtitle: {
    color: theme.colors.gray[600],
    fontSize: "16px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
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
  },
  input: {
    padding: "14px 18px",
    border: `2px solid ${theme.colors.gray[200]}`,
    borderRadius: "12px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    outline: "none",
    backgroundColor: theme.colors.gray[50],
  },
  button: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    boxShadow: theme.shadows.lg,
    transition: "all 0.3s ease",
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    color: theme.colors.gray[600],
    fontSize: "15px",
  },
  link: {
    color: theme.colors.primary,
    textDecoration: "none",
    fontWeight: "600",
    transition: "color 0.3s",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "24px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #fecaca",
  },
  backgroundDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    overflow: "hidden",
    zIndex: 0,
  },
  blob1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    top: "-250px",
    right: "-250px",
    animation: "float 20s ease-in-out infinite",
  },
  blob2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    bottom: "-200px",
    left: "-200px",
    animation: "float 15s ease-in-out infinite reverse",
  },
};

export default Login;
