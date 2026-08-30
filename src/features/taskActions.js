import { saveTasks } from "../services/storage.js";

// Create a new task
export function createTask(tasks, task) {
    tasks.push(task);
    saveTasks(tasks);
}

// Delete a task by ID
export function deleteTask(tasks, taskId) {
    const index = tasks.findIndex(task => task.id === taskId);
    if (index === -1) return;

    tasks.splice(index, 1);
    saveTasks(tasks);
}

// Find a task by ID
export function findTask(tasks, taskId) {
    return tasks.find(task => task.id === taskId);
}

// Update task properties (title, description, status, priority)
export function updateTask(tasks, taskId, updates) {
    const task = findTask(tasks, taskId);
    if (!task) return;

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.status !== undefined) task.status = updates.status;
    if (updates.priority !== undefined) task.priority = updates.priority;

    saveTasks(tasks);
}

// Change task status
export function changeTaskStatus(tasks, taskId, newStatus) {
    const task = findTask(tasks, taskId);
    if (!task) return;

    task.changeStatus(newStatus);
    saveTasks(tasks);
}
