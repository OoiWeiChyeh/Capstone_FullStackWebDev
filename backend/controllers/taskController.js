const Task = require("../models/Task");

// @desc    Get all tasks with filtering, sorting, and search
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const { status, priority, category, search, sortBy, order, favorite } =
      req.query;

    // Build query
    let query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (favorite === "true") query.isFavorite = true;

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "asc" ? 1 : -1;
    } else {
      sort = { createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sort);

    // Calculate statistics
    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      overdue: tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < new Date() &&
          t.status !== "completed"
      ).length,
      favorites: tasks.filter((t) => t.isFavorite).length,
    };

    res.json({ tasks, count: tasks.length, stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      tags,
      isFavorite,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      tags: tags || [],
      isFavorite: isFavorite || false,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      tags,
      isFavorite,
    } = req.body;

    task.title = title !== undefined ? title : task.title;
    task.description =
      description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.category = category !== undefined ? category : task.category;
    task.tags = tags !== undefined ? tags : task.tags;
    task.isFavorite = isFavorite !== undefined ? isFavorite : task.isFavorite;

    await task.save();

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/tasks/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isFavorite = !task.isFavorite;
    await task.save();

    res.json({
      message: "Favorite status updated",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Bulk delete tasks
// @route   POST /api/tasks/bulk-delete
// @access  Private
exports.bulkDelete = async (req, res) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({ message: "Invalid task IDs" });
    }

    await Task.deleteMany({
      _id: { $in: taskIds },
      user: req.user._id,
    });

    res.json({
      message: `${taskIds.length} task(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const stats = {
      total: tasks.length,
      byStatus: {
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in-progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
      },
      byPriority: {
        low: tasks.filter((t) => t.priority === "low").length,
        medium: tasks.filter((t) => t.priority === "medium").length,
        high: tasks.filter((t) => t.priority === "high").length,
      },
      byCategory: {
        work: tasks.filter((t) => t.category === "work").length,
        personal: tasks.filter((t) => t.category === "personal").length,
        shopping: tasks.filter((t) => t.category === "shopping").length,
        health: tasks.filter((t) => t.category === "health").length,
        other: tasks.filter((t) => t.category === "other").length,
      },
      overdue: tasks.filter(
        (t) =>
          t.dueDate &&
          new Date(t.dueDate) < new Date() &&
          t.status !== "completed"
      ).length,
      favorites: tasks.filter((t) => t.isFavorite).length,
      completionRate:
        tasks.length > 0
          ? (
              (tasks.filter((t) => t.status === "completed").length /
                tasks.length) *
              100
            ).toFixed(1)
          : 0,
    };

    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
