const express = require('express');

const app = express();

const PORT = 5000;

const todos = [
    {
        id: 1,
        title: "Learn Node.js",
        completed: false
    },
    {
        id: 2,
        title: "Learn Express.js",
        completed: false
    }
];

app.use(express.json());

app.get('/', (req, res)=>{
res.send('Hello world');
});

app.get('/api/todos', (req, res)=>{
   res.json(todos);
});

app.post('/api/todos', (req, res)=>{
    console.log(req.body);

  const newTodo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: req.body.completed ?? false
};

todos.push(newTodo);

res.json({
    message: 'Todo created successfully',
    data: newTodo
});
});

app.get('/api/todos/:id', (req, res)=>{
   const id = parseInt(req.params.id);
   console.log(`Fetching for id ${id}`);
   const todo = todos.find(todo =>todo.id === id);

   if(!todo){
    return res.status(404).json({
        message: 'Todo not found',       
    });
   }

   res.json({
    message: 'Todo found successfully',
    data: todo
   })

});


app.put('/api/todos/:id', (req, res)=> {
    const id = parseInt(req.params.id);
    console.log(`Updating for id ${id}`);
    const todo = todos.find(todo => todo.id===id);

    if(!todo){
        return res.status(404).json({
            message:'Todo not found'
        });
    }
    
    todo.title = req.body.title;
    todo.completed = req.body.isCompleted;


    res.json({
        message: 'Todo updated successfully',
        data: todo
    });
});

app.delete('/api/todos/:id', (req, res)=>{
    const id = parseInt(req.params.id);
    console.log(`deleting todo of id ${id}`);
    
    const index = todos.findIndex(todo => todo.id===id);

    if(index === -1){
        return res.status(404).json({
            message:'id not found'
        })
    }
    
    if(index !== -1){
        todos.splice(index, 1);
        res.json({
            message: 'Todo deleted successfully',
            data:  todos
        });
    }
    

});


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});