import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { todoAPI } from '../services/api';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);
    const { user, logout } = useAuth();

    // Fetch todos when component mounts
    useEffect(() => {
        if (user) {  // Make sure user is loaded
            fetchTodos();
        }
    }, [user]);

    const fetchTodos = async () => {
        try {
            const response = await todoAPI.getAll(user.id);
            setTodos(response.data.todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const response = await todoAPI.create({
                task: newTask,
                user_id: user.id,  // Always set user_id when creating
                priority: 'medium',
                category: 'general'
            });
            setTodos([response.data.todo, ...todos]);
            setNewTask('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            await todoAPI.update(id, { completed: !completed });
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, completed: !completed } : todo
            ));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await todoAPI.delete(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Welcome, {user.username}!</h1>
                <button onClick={logout} style={{ padding: '8px 16px' }}>
                    Logout
                </button>
            </div>

            {/* Add Todo Form */}
            <form onSubmit={addTodo} style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Add a new todo..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px' }}>
                        Add Todo
                    </button>
                </div>
            </form>

            {/* Todo List */}
            <div>
                <h2>Your Todos ({todos.length})</h2>
                {todos.length === 0 ? (
                    <p>No todos yet. Add one above!</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {todos.map(todo => (
                            <li
                                key={todo.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    marginBottom: '5px',
                                    backgroundColor: todo.completed ? '#f0f0f0' : 'white'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id, todo.completed)}
                                    style={{ marginRight: '10px' }}
                                />
                                <span
                                    style={{
                                        flex: 1,
                                        textDecoration: todo.completed ? 'line-through' : 'none'
                                    }}
                                >
                  {todo.task}
                </span>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{
                                        backgroundColor: '#dc3545',
                                        color: 'white',
                                        border: 'none',
                                        padding: '5px 10px'
                                    }}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
