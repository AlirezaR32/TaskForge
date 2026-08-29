import { Task, UrgentTask } from "../model/task.js";

const STORAGE_KEY = "taskforge_tasks"
export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        throw new Error("Failed to save tasks");
    }

}


export function getTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);
        return parsed.map(rehydrateTask);
    } catch (error) {
        throw new Error("Failed to load tasks", {
            cause: error
        });
    }
}

// Convert a plain object from storage back into a Task/UrgentTask instance
function rehydrateTask(data) {
    let task;

    if (data.deadline !== undefined && data.deadline !== null) {
        task = new UrgentTask(
            data.title,
            data.description,
            data.status,
            data.deadline
        );
    } else {
        task = new Task(
            data.title,
            data.description,
            data.status,
            data.priority
        );
    }

    // Restore original values
    task.id = data.id;

    if (data.createdAt) {
        task.createdAt = new Date(data.createdAt);
    }

    // Keep counter ahead of existing IDs
    const numericId = Number(data.id);

    if (!Number.isNaN(numericId) && numericId >= Task.counter) {
        Task.counter = numericId + 1;
    }

    return task;
}

export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY)
}