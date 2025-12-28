import React, { useState } from 'react';

function TodoForm({ onTodoCreated,accessToken}) {
    const [title, setTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`, 
};

    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop the browser default form submission
        if (!title.trim()) return; // Prevent submitting empty titles

        setIsSubmitting(true);
        // const URL = "http://127.0.0.1:8000/todoapp/todolist/";
        const URL = API.todolf;

        try {
            const response = await fetch(URL, {
                method: 'POST', // 1. Set the method to POST
                headers: headers,
                // 3. Convert JavaScript object to a JSON string for the body
                body: JSON.stringify({ 
                    task: title,
                    is_completed: false // Default value for creation
                }),
            });

            if (response.ok) {
                // Success: Clear the form and trigger the list refresh
                setTitle('');
                if (onTodoCreated) onTodoCreated();
            } else {
                console.error("Failed to create todo:", await response.json());
            }

        } catch (error) {
            console.error("POST request failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task..."
                disabled={isSubmitting}
                className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition duration-150"
            >
                {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
        </form>
    );
}

export default TodoForm;