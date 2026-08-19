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
};

// Find a task by ID

export function findTask(tasks, taskId) {
    return tasks.find(task => task.id === taskId);
}

// Update task properties (title, status, priority)
export function updateTask(tasks, taskId, updates, form) {
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
    } finally {
        // Clear the form after updating
        if (form) {
            form.remove();
        }
}}

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

export function setupEdit() {
    document.addEventListener("submit", event => {
        const editForm = event.target.closest(".edit-form");
        if (!editForm) {
            return;
        }
        event.preventDefault();
    
        const form = event.target;
        const id = form.dataset.taskId;
    
        const title = form.querySelector('#edit-task-name').value;
        const status = form.querySelector("#edit-task-status").value;
        const priority = form.querySelector("#edit-task-priority").value;
    
        updateTask(tasks, id, { title, status, priority }, form);
    });
}