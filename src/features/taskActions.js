import { saveTasks, getTasks } from "../services/storage.js";
import { renderState } from "../ui/stateView.js";
import { addCard } from "../ui/taskView.js";

// Create a new task and add it to the board
export function createTask(tasks, task) {
    try {
        tasks.push(task);
        saveTasks(tasks);
        addCard(task);
    } catch (error) {
        renderState("error");
    }
}

//  Delete a task by ID and remove its card from the DOM
export function deleteTask(tasks, taskId) {
    try {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        const card = document.querySelector(`[data-task-id="${taskId}"]`);
        if (card) {
            card.remove();
        }
    } catch (error) {
        renderState("error");
    }
}

// Find a task by ID

export function findTask(tasks, taskId) {
    return tasks.find(task => task.id === taskId);
}

// Update task properties (title, status, priority)
export function updateTask(tasks, taskId, updates) {
    const task = findTask(tasks, taskId);
    if (!task) return;

    try {
        if (updates.title !== undefined) task.title = updates.title;
        if (updates.status !== undefined) task.status = updates.status;
        if (updates.priority !== undefined) task.priority = updates.priority;

        saveTasks(tasks);

        const card = document.querySelector(`[data-task-id="${taskId}"]`);
        if (card) {
            card.remove();
        }
        addCard(task);
    } catch (error) {
        renderState("error");
    }
}

// Change task status and move card to correct column
export function changeTaskStatus(tasks, taskId, newStatus) {
    const task = findTask(tasks, taskId);
    if (!task) return;

    try {
        task.changeStatus(newStatus);
        saveTasks(tasks);

        const card = document.querySelector(`[data-task-id="${taskId}"]`);
        if (card) {
            card.remove();
        }
        addCard(task);
    } catch (error) {
        renderState("error");
    }
}
