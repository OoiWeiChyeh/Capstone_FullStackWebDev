const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleFavorite,
  bulkDelete,
  getStats,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");

// All routes are protected
router.use(auth);

// Statistics route
router.get("/stats", getStats);

// Bulk operations
router.post("/bulk-delete", bulkDelete);

// Favorite toggle
router.patch("/:id/favorite", toggleFavorite);

// CRUD routes
router.route("/").get(getTasks).post(createTask);

router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;
