import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckSquare, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { theme } from "../styles/theme";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      style={styles.navbar}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          <motion.div
            style={styles.logoWrapper}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckSquare size={28} color="white" />
            <span style={styles.brandText}>TaskMaster</span>
          </motion.div>
        </Link>

        <div style={styles.navLinks}>
          {user ? (
            <>
              <motion.div
                style={styles.userInfo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div style={styles.avatar}>
                  <User size={18} color="white" />
                </div>
                <span style={styles.username}>{user.username}</span>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                style={styles.logoutBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} style={{ marginRight: "6px" }} />
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" style={styles.link}>
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" style={styles.registerLink}>
                  Register
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

const styles = {
  navbar: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "1rem 0",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backdropFilter: "blur(10px)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    textDecoration: "none",
  },
  logoWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
  },
  brandText: {
    color: "white",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "white",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  registerLink: {
    color: theme.colors.dark,
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "10px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    border: "none",
    boxShadow: theme.shadows.md,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    padding: "8px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    color: "white",
    fontWeight: "600",
    fontSize: "15px",
  },
  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    boxShadow: theme.shadows.md,
  },
};

export default Navbar;
