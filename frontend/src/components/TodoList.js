import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodoList.css'

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newText, setNewText] = useState('');

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch all todos when the component is mounted
  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then(res => setTodos(res.data))
      .catch(console.error);
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (!newText.trim()) return;
    axios.post('http://localhost:5000/api/todos', { text: newText })
      .then(res => {
        setTodos([...todos, res.data]);
        setNewText('');
      })
      .catch(console.error);
  };

  // Toggle completed status
  const toggleComplete = (todo) => {
    axios.patch(`http://localhost:5000/api/todos/${todo._id}`, { completed: !todo.completed })
      .then(res => {
        setTodos(todos.map(t => t._id === todo._id ? res.data : t));
      })
      .catch(console.error);
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => setTodos(todos.filter(t => t._id !== id)))
      .catch(console.error);
  };

  // Start editing a todo
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditingText(todo.text);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  // Save the edited todo
  const saveEdit = (id) => {
    if (!editingText.trim()) return;
    axios.patch(`http://localhost:5000/api/todos/${id}`, { text: editingText })
      .then(res => {
        setTodos(todos.map(t => t._id === id ? res.data : t));
        cancelEdit();
      })
      .catch(console.error);
  };

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      {/* Add new todo */}
      <div className="new-todo">
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* List of todos */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} style={{ marginBottom: 10 }}>
            {/* Checkbox for completed toggle */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
            />

            {/* Display todo text or edit input */}
            {editingId === todo._id ? (
              <div className="editing-controls">
                <input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  style={{ marginLeft: 8 }}
                />
                <button className="save-btn" onClick={() => saveEdit(todo._id)}>Save</button>
                <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <>
                <span
                  onDoubleClick={() => startEdit(todo)}
                  style={{
                    marginLeft: 8,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {todo.text}
                </span>
                <div style={{ display: 'inline' }}>
                  <button className="edit-btn" onClick={() => startEdit(todo)} style={{ marginLeft: 8 }}>
                    Edit
                  </button>
                </div>
              </>
            )}

            {/* Delete button */}
            
              <button className="delete-btn"
              onClick={() => deleteTodo(todo._id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
