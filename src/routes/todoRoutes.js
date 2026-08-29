const express = require('express');

const router = express.Router();

const {getTodos, createTodo, updateTodo, deleteTodo, getTodoById} = require('../controllers/todoController');

router.get("/", getTodos);

router.post("/", createTodo);

router.put("/:id", updateTodo);

router.get("/:id", getTodoById);

router.delete("/:id", deleteTodo);

module.exports = router;