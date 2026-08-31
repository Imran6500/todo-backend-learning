const mongoose = require("mongoose");
const sendResponse = require("../utils/response");
const Todo = require("../models/todoModel");
const bcrypt = require("bcryptjs");

const getTodos = async (req, res, next) => {
  try {
    let filter = {
      user: req.user.userId,
    };
    const completed = req.query.completed;

    if (completed !== undefined) {
      if (completed !== "true" && completed !== "false") {
        return sendResponse(res, 400, false, "Invalid Query");
      }
      filter.completed = completed === "true";
    }

    const search = req.query.search;

    if (search !== undefined && search.trim() !== "") {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
      return sendResponse(
        res,
        400,
        false,
        "Page and limit must be positive numbers",
      );
    }
    const totalTodos = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(totalTodos / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
    const skip = (page - 1) * limit;

    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendResponse(res, 200, true, "Todo fetched successfully", todos, {
      page,
      limit,
      totalTodos,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      completed: req.body.completed,
      user: req.user.userId,
    });

    sendResponse(res, 201, true, "Todo created successfully", todo);
  } catch (error) {
    next(error);
  }
};

const patchTodo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid ID");
    }
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedTodo) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo updated successfully", updatedTodo);
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid Id");
    }
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: id,
        user: req.user.userId,
      },
      {
        title: req.body.title,
        completed: req.body.completed,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedTodo) {
      return sendResponse(res, 404, false, "Todo not found");
    }
    sendResponse(res, 200, true, "Todo updated successfully", updatedTodo);
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Id is not valid");
    }

    const todo = await Todo.findOne({ _id: id, user: req.user.userId });

    if (!todo) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Found the Todo", todo);
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, false, "Invalid Id");
    }
    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      user: req.user.userId,
    });

    if (!deletedTodo) {
      return sendResponse(res, 404, false, "Todo not found");
    }

    sendResponse(res, 200, true, "Todo deleted successfully", deletedTodo);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoById,
  patchTodo,
};
