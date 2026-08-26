const Todo = require("../models/todoModel");

const getTodos = async (req, res)=>{
    try {
        const todos = await Todo.find();

        res.status(200).json({
            message:"Todos fetched successfully",
            data:todos
        });

    } catch (error) {

        res.status(500).json({
            message:"Failed to load todos",
            error:error.message
        });        
    }
};

module.exports = {
    getTodos
}