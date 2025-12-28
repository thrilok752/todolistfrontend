import React, { useState, useEffect } from 'react';

// This component expects 'refreshTrigger' to re-fetch data, 
// ensuring the list updates after Create, Update, or Delete.
function TodoList({ refreshTrigger,accessToken }) {
    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- Configuration ---
    // const API_URL = "http://127.0.0.1:8000/todoapp/todolist/";
    const API_URL = `${API_BASE_URL}/todoapp/todolist/`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, 
};


    // --- READ Operation (GET) ---
    const fetchTodos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL,{ method: 'GET', headers: headers });
            if (!response.ok) {
                throw new Error(`Status: ${response.status}`);
            }
            const data = await response.json(); 
            setTodos(data);
        } catch (error) {
            console.error("Fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- DELETE Operation (DELETE) ---
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}${id}`, {
                method: 'DELETE', headers: headers // Method is DELETE
            });

            if (response.status === 204) { // 204 No Content is standard for successful DELETE
                // Instead of a full refresh, we can optimize by filtering the list instantly
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            } else {
                console.error("Failed to delete task:", response.status);
            }
        } catch (error) {
            console.error("DELETE request failed:", error);
        }
    };

    // --- UPDATE Operation (PUT/PATCH - Toggle Completion) ---
    const handleToggle = async (todo) => {
        // Prepare the new status
        const newStatus = !todo.is_completed; 

        try {
            const response = await fetch(`${API_URL}${todo.id}`, {
                method: 'PUT', // Using PUT for the update (backend handles partial=True)
                headers: headers,
                body: JSON.stringify({ 
                    is_completed: newStatus // Only send the field we are changing
                }),
            });

            if (response.ok) {
                // Optimize: Update the state instantly without a full re-fetch
                setTodos(prevTodos => 
                    prevTodos.map(t => 
                        t.id === todo.id ? { ...t, is_completed: newStatus } : t
                    )
                );
            } else {
                 console.error("Failed to update task:", await response.json());
            }

        } catch (error) {
            console.error("PUT request failed:", error);
        }
    };


    // --- Lifecycle Hook ---
    // Runs on initial mount AND every time refreshTrigger changes (after C/U/D)
    useEffect(() => {
        fetchTodos();
    }, [refreshTrigger]); 

    // --- Render ---
    return (
        <div>
            {isLoading ? (
                <p className="text-center text-xl font-bold text-gray-500">Loading tasks...</p>
            ) : (
                <ul className="space-y-3">
                    {todos.map(todo => (
                        <li key={todo.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                            
                            {/* Task Title & Toggle */}
                            <div 
                                onClick={() => handleToggle(todo)} // Click anywhere on the text to toggle
                                className="flex-grow cursor-pointer"
                            >
                                <span className={`text-lg ${todo.is_completed ? 'line-through text-green-600' : 'text-gray-800'}`}>
                                    {todo.task}
                                </span>
                            </div>

                            {/* Status and Delete Button */}
                            <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    todo.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {todo.is_completed ? 'Done' : 'Pending'}
                                </span>
                                
                                <button
                                    onClick={() => handleDelete(todo.id)}
                                    className="text-red-500 hover:text-red-700 transition duration-150"
                                >
                                    &times; {/* Simple 'x' symbol for delete */}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {todos.length === 0 && !isLoading && (
                <p className="text-center text-gray-500 mt-4">No tasks yet! Add one above.</p>
            )}
        </div>
    );
}

export default TodoList;