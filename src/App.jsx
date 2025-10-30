import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Trash2, PlusCircle, X, RotateCcw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const categories = ["Work", "Personal", "Shopping", "Fitness", "Other"];

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
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
    toast.success("Task added ✅");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    toast.success("Task updated");
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    setDeletedTasks([...deletedTasks, taskToDelete]);
    setTasks(tasks.filter((task) => task.id !== id));
    toast("Moved to deleted 🗑️");
  };

  const restoreTask = (id) => {
    const taskToRestore = deletedTasks.find((task) => task.id === id);
    setTasks([...tasks, taskToRestore]);
    setDeletedTasks(deletedTasks.filter((task) => task.id !== id));
    toast.success("Task restored 🔄");
  };

  const permanentlyDeleteTask = (id) => {
    setDeletedTasks(deletedTasks.filter((task) => task.id !== id));
    toast("Deleted permanently ❌");
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "Active") return !task.completed;
    if (activeTab === "Completed") return task.completed;
    return false;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white flex flex-col items-center py-10 transition-all duration-500">
      <Toaster />
      <h1 className="text-4xl font-extrabold mb-8 tracking-wide text-indigo-300">
        TaskMate Pro 💼
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Active", "Completed", "Deleted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 ${
              activeTab === tab
                ? "bg-indigo-500 text-white scale-105"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Input + Add Button */}
      <div className="flex items-center gap-4 mb-6 relative">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none w-72"
        />
        <button
          onClick={() => setShowCategoryBox(true)}
          className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-lg text-white hover:bg-indigo-400 transition-all shadow-md"
        >
          <PlusCircle size={20} /> Add Task
        </button>

        {/* Category Box */}
        {showCategoryBox && (
          <div
            ref={categoryBoxRef}
            className="absolute bg-gray-800 border border-indigo-600 p-4 rounded-lg shadow-xl w-52 top-full mt-3 right-0"
          >
            <div className="flex justify-between mb-3">
              <h2 className="text-lg text-indigo-300">Choose Category</h2>
              <button onClick={() => setShowCategoryBox(false)}>
                <X size={20} className="text-white hover:text-indigo-400" />
              </button>
            </div>
            {categories.map((i) => (
              <button
                key={i}
                onClick={() => addTask(i)}
                className="block w-full text-left px-3 py-2 rounded hover:bg-indigo-600 transition"
              >
                {i}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Task List */}
      <ul className="w-full max-w-md space-y-3 mt-4">
        {activeTab !== "Deleted" ? (
          filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex justify-between items-center bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-md transition-all"
              >
                <span className={`${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.text} <span className="text-indigo-400 text-sm">({task.category})</span>
                </span>
                <div className="flex gap-3">
                  <button onClick={() => toggleComplete(task.id)}>
                    <CheckCircle
                      size={22}
                      className={task.completed ? "text-green-400" : "text-gray-400 hover:text-green-300"}
                    />
                  </button>
                  <button onClick={() => deleteTask(task.id)}>
                    <Trash2 size={22} className="text-red-400 hover:text-red-300" />
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400 text-center">No tasks available.</p>
          )
        ) : (
          deletedTasks.map((task) => (
            <div key={task.id} className="flex justify-between bg-gray-700 p-4 rounded-lg shadow">
              <span>
                {task.text} <span className="text-indigo-400 text-sm">({task.category})</span>
              </span>
              <div className="flex gap-3">
                <button onClick={() => restoreTask(task.id)}>
                  <RotateCcw className="text-yellow-400 hover:text-yellow-300" />
                </button>
                <button onClick={() => permanentlyDeleteTask(task.id)}>
                  <Trash2 className="text-red-500 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
