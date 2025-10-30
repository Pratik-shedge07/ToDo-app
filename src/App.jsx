import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Trash2, PlusCircle, X, RotateCcw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const categories = ["Work", "Personal", "Shopping", "Fitness", "Other"];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [activeTab, setActiveTab] = useState("Active");
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [showCategoryBox, setShowCategoryBox] = useState(false);
  const categoryBoxRef = useRef(null);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    const savedDeleted = JSON.parse(localStorage.getItem("deletedTasks"));
    if (savedTasks) setTasks(savedTasks);
    if (savedDeleted) setDeletedTasks(savedDeleted);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [tasks, deletedTasks]);

  const addTask = (selectedCategory) => {
    if (!newTask.trim()) {
      toast.error("Task cannot be empty");
      return;
    }
    const task = { id: Date.now(), text: newTask, category: selectedCategory, completed: false };
    setTasks([...tasks, task]);
    setNewTask("");
    setShowCategoryBox(false);
    toast.success("Task added successfully");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success("Task status updated");
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    setDeletedTasks([...deletedTasks, taskToDelete]);
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success("Task moved to deleted");
  };

  const restoreTask = (id) => {
    const taskToRestore = deletedTasks.find((task) => task.id === id);
    setTasks([...tasks, taskToRestore]);
    setDeletedTasks(deletedTasks.filter((task) => task.id !== id));
    toast.success("Task restored");
  };

  const permanentlyDeleteTask = (id) => {
    setDeletedTasks(deletedTasks.filter((task) => task.id !== id));
    toast.success("Task permanently deleted");
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "Active") return !task.completed;
    if (activeTab === "Completed") return task.completed;
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <Toaster />
      <h1 className="text-4xl font-bold mb-6">To-Do List</h1>
      <div className="flex gap-4 mb-6">
        {["Active", "Completed", "Deleted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded transition ${
              activeTab === tab ? "bg-yellow-500 text-black" : "bg-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 mb-6 relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task..."
          className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={() => setShowCategoryBox(true)}
          className="flex items-center gap-2 bg-yellow-500 px-4 py-2 rounded text-black hover:bg-yellow-400 transition"
        >
          <PlusCircle size={20} /> Add Task
        </button>
        {showCategoryBox && (
          <div ref={categoryBoxRef} className="absolute bg-gray-800 p-4 rounded shadow-lg w-52 top-full mt-2 right-0">
            <div className="flex justify-between mb-2">
              <h2 className="text-lg">Select Category</h2>
              <button onClick={() => setShowCategoryBox(false)}>
                <X size={20} className="text-white" />
              </button>
            </div>
            {categories.map((i) => (
              <button
                key={i}
                onClick={() => addTask(i)}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded"
              >
                {i}
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className="w-full max-w-md space-y-3 mt-6">
        {activeTab !== "Deleted" ? (
          filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-800 p-4 rounded shadow-md"
              >
                <span className={`${task.completed ? "line-through text-gray-400" : ""}`}>{task.text} ({task.category})</span>
                <div className="flex gap-3">
                  <button onClick={() => toggleComplete(task.id)}>
                    <CheckCircle size={24} className={task.completed ? "text-green-400" : "text-gray-400"} />
                  </button>
                  <button onClick={() => deleteTask(task.id)}>
                    <Trash2 size={24} className="text-red-400" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tasks available.</p>
          )
        ) : (
          deletedTasks.map((task) => (
            <div key={task.id} className="flex justify-between bg-gray-700 p-4 rounded">
              <span>{task.text} ({task.category})</span>
              <div className="flex gap-3">
                <button onClick={() => restoreTask(task.id)}><RotateCcw className="text-yellow-400" /></button>
                <button onClick={() => permanentlyDeleteTask(task.id)}><Trash2 className="text-red-500" /></button>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;