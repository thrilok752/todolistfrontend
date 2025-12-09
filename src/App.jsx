import React, { useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './todolist';

function App() {
    // State used to force the TodoList to refresh its data after a successful POST request.
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function passed as a prop to TodoForm. It increments the state, 
    // which triggers the useEffect hook in TodoList.
    const handleTodoCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen w-screen bg-blue-200 p-8">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                    Simple To-Do List (Legacy Non-Auth)
                </h1>

                {/* The form component handles POST requests */}
                <TodoForm onTodoCreated={handleTodoCreated} />

                <hr className="my-6 border-gray-200" />

                {/* The list component handles GET requests and refreshes when the trigger changes */}
                <TodoList refreshTrigger={refreshTrigger} />
            </div>
        </div>
    );
}

export default App;