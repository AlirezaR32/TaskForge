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
        task = new UrgentTask(data.title, data.status, data.deadline);
    } else {
        task = new Task(data.title, data.status, data.priority);
    }

    // Preserve the original id and createdAt instead of the freshly generated ones
    task.id = data.id;
    if (data.createdAt) {
        task.createdAt = new Date(data.createdAt);
    }

    // Keep the id counter ahead of any existing ids to avoid collisions
    const numericId = Number(data.id);
    if (!Number.isNaN(numericId) && numericId >= Task.counter) {
        Task.counter = numericId + 1;
    }

    return task;
}

export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY)
}