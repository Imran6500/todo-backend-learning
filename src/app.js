const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const logger = require("./middleware/loggerMiddleware");
const notFound = require("./middleware/notFoundMiddleware");
const sendResponse = require("./utils/response");

const app = express();


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: {
        success: false,
        message: "Too many requests, please try again later"
    }
});

app.use(helmet());
app.use(cors());
app.use(express.json({limit: "10kb"}));


app.use(logger);
app.use(apiLimiter);
app.get("/health", (req, res) => {
    const databaseConnected = mongoose.connection.readyState ==1;
    if(!databaseConnected){
        return sendResponse(res,503,false," Server unavailable", {
            server:"up",
            database:"down"
        });
    }

   sendResponse(res,200,true,"Server is healthy",
    {
            server:"up",
            database:"up"
        });
});
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);



module.exports = app;