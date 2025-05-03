const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');  // Import the Todo model

// POST - Create a new todo
router.post('/', async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });

  try {
    const newTodo = await todo.save(); // Save the new todo to the database
    res.status(201).json(newTodo);     // Send the created todo back in the response
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();  // Get all todos from the database
    res.json(todos);                  // Send the todos back in the response
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH - Update a todo (text or completed)
router.patch('/:id', async (req, res) => {
  try {
    const updates = {};

    if (req.body.text !== undefined) updates.text = req.body.text;
    if (req.body.completed !== undefined) updates.completed = req.body.completed;

    // Find and update the todo by ID
    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(todo);  // Return the updated todo
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Delete a todo by ID
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
