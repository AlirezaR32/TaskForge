import { Task, UrgentTask } from "../model/task.js";

const STORAGE_KEY = "taskforge_tasks";

export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        throw new Error("Failed to save tasks", { cause: error });
    }
}

export function getTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        const parsed = JSON.parse(data);

        if (!Array.isArray(parsed)) {
            throw new Error("Stored tasks must be an array");
        }

        return parsed.map(rehydrateTask);
    } catch (error) {
        throw new Error("Failed to load tasks", { cause: error });
    }
}

function rehydrateTask(data) {
    const status = ["todo", "doing", "done"].includes(data.status)
        ? data.status
        : "todo";

    const hasDeadline = data.deadline !== undefined && data.deadline !== null && data.deadline !== "";

    const task = hasDeadline
        ? new UrgentTask(data.title ?? "", data.description ?? "", status, data.deadline)
        : new Task(
            data.title ?? "",
            data.description ?? "",
            status,
            ["low", "medium", "high"].includes(data.priority) ? data.priority : "low"
        );

    task.id = String(data.id);

    if (data.createdAt) {
        const createdAt = new Date(data.createdAt);
        if (!Number.isNaN(createdAt.getTime())) {
            task.createdAt = createdAt;
        }
    }

    const numericId = Number(data.id);
    if (!Number.isNaN(numericId) && numericId >= Task.counter) {
        Task.counter = numericId + 1;
    }

    return task;
}

export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY);
}
