const express = require("express");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const logger = require("./middleware/loggerMiddleware");

const app = express();

app.use(logger);

app.use(express.json());

app.use("/api/v1/todos", todoRoutes);

app.use(errorHandler);

module.exports = app;