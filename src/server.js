const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db')
const todoRoutes = require('./routes/todoRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/todos", todoRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


