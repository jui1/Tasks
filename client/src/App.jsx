
import { useEffect, useState } from "react";

const API = import.meta.env.API_URL;

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // GET: Fetch tasks from backend
  async function fetchTasks() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch tasks");
      }

      // Supports { success: true, data: [...] }
      // and a direct array response
      const taskList = Array.isArray(result)
        ? result
        : result.data;

      if (!Array.isArray(taskList)) {
        throw new Error("Unexpected response from backend");
      }

      setTasks(taskList);
    } catch (err) {
      setError(err.message || "Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  // Fetch tasks when the component loads
 
useEffect(() => {
  async function loadTasks() {
    await fetchTasks();
  }

  loadTasks();
}, []);


  // POST: Add a new task to the database
  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          status: "Pending",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add task");
      }

      setTitle("");
      setMessage("Task added successfully!");

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to add task");
    } finally {
      setSaving(false);
    }
  }

  // PUT: Update task status in the database
  async function handleStatusChange(id, newStatus) {
    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update task");
      }

      setMessage("Task status updated!");
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to update task");
    }
  }

  // DELETE: Remove a task from the database
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete task");
      }

      setMessage("Task deleted successfully!");
      await fetchTasks();
    } catch (err) {
      setError(err.message || "Unable to delete task");
    }
  }

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Task Manager</h1>
      <p>Organize your tasks and track your progress.</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <input
          type="text"
          placeholder="Enter your task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            flex: 1,
            minWidth: 0,
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "12px 18px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" style={{ color: "#15803d" }}>
          {message}
        </p>
      )}

      <h2>My Tasks ({tasks.length})</h2>

      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks yet. Add your first task!</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              padding: "14px",
              marginBottom: "10px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                flex: 1,
                minWidth: "100px",
                overflowWrap: "anywhere",
                textDecoration:
                  task.status === "Completed"
                    ? "line-through"
                    : "none",
              }}
            >
              {task.title}
            </span>

            <select
              value={task.status || "Pending"}
              onChange={(e) =>
                handleStatusChange(task.id, e.target.value)
              }
              aria-label={`Status for ${task.title}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              type="button"
              onClick={() => handleDelete(task.id)}
              style={{
                padding: "8px 12px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <button
        type="button"
        onClick={fetchTasks}
        disabled={loading}
        style={{
          marginTop: "12px",
          padding: "10px 14px",
          cursor: "pointer",
        }}
      >
        Refresh Tasks
      </button>
    </main>
  );
}

export default App;
