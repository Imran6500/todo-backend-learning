const express = require('express');
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const {getTodos, createTodo, updateTodo, deleteTodo, getTodoById, patchTodo} = require('../controllers/todoController');

const validate = require("../middleware/validateMiddleware");
const {createTodoSchema, updateTodoSchema, patchTodoSchema} = require("../validations/todoValidation");

router.get("/", authMiddleware, getTodos);

router.post("/", authMiddleware, validate(createTodoSchema), createTodo);

router.put("/:id", authMiddleware, validate(updateTodoSchema), updateTodo);

router.patch("/:id", authMiddleware, validate(patchTodoSchema), patchTodo);

router.get("/:id", authMiddleware, getTodoById);

router.delete("/:id",authMiddleware , deleteTodo);

module.exports = router;