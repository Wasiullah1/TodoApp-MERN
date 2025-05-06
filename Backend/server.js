require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');  // Import todoRoutes

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error(err));

// // Todo model
// const Todo = mongoose.model('Todo', new mongoose.Schema({
//   text: { type: String, required: true }
// }));

// // POST route to add a new todo
// app.post('/api/todos', async (req, res) => {
//   const todo = new Todo({
//     text: req.body.text,
//   });

//   try {
//     const newTodo = await todo.save();
//     res.status(201).json(newTodo); // Return the newly created todo
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // GET route to fetch all todos
// app.get('/api/todos', async (req, res) => {
//   try {
//     const todos = await Todo.find(); // Get all todos from the database
//     res.json(todos); // Send them as a response
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// Use the todoRoutes for the /api/todos endpoint
app.use('/api/todos', todoRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
