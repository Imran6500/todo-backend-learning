const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Todo = require("./src/models/todoModel");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`server is running on PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MongoDB connection failed: `, error);
  });

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();

    res.status(200).json({
      message: "Todos fetched successfully",
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load todos",
      error: error.message,
    });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
    });

    res.status(201).json({
      message: "Todo created successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create todo",
      error: error.message,
    });
  }
});

app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo found successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch todo",
      error: error.message,
    });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        completed: req.body.isCompleted ?? false,
      },
      {
        new: true,
      },
    );

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.status(200).json({
      message: "Todo updated successfully",
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update todo",
      error: error.message,
    });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    res.status(200).json({
      message: "Todo deleted successfully", 
      data: todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Delete Todo",
      error: error.message,
    });
  }
});
