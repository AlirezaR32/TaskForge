import { findTask,deleteTask, createTask, changeTaskStatus, updateTask } from "./taskActions.js";
import { showEditForm } from "../ui/taskView.js";
import { toggleDeadlineField, updateView } from "../main.js";
import {Task, UrgentTask} from "../model/task.js";

export function setupTaskBoard(
    taskBoard,
    tasks,

) {
    taskBoard.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task");
    const editButton = event.target.closest(".edit-task");
    
    if (deleteButton) {
        const card = deleteButton.closest(".task-card");
        const id = card.getAttribute("data-task-id");
        deleteTask(tasks, id);
    }

    if (editButton) {
        const card = editButton.closest(".task-card");
        const id = card.dataset.taskId;
        const task = findTask(tasks, id);
        showEditForm(task);
    }
    
    // status change
    taskBoard.addEventListener("change", (event) => {
        if (event.target.classList.contains("task-status")) {
            const card = event.target.closest(".task-card");
            const id = card.dataset.taskId;
            const newStatus = event.target.value;
            changeTaskStatus(tasks, id, newStatus);
        }
    });
});
}

export function setupAddTask(form, tasks, prioritySelect, deadlineField, deadlineInput) {
    
    form.addEventListener("submit", event => {
        event.preventDefault();
    
        const title = form.querySelector('#task-name').value;
        const status = form.querySelector("#task-status").value;
        const selectedPriority = prioritySelect.value;
    
        let task;
    
        if (selectedPriority === "urgent") {
            const deadline = deadlineInput.value;
            task = new UrgentTask(title, status, deadline);
        } else {
            task = new Task(title, status, selectedPriority);
        }
    
        createTask(tasks, task);
    
        form.reset();
        toggleDeadlineField();
    })
};
export function setupFilters(searchInput,
    statusFilter,
    priorityFilter
) {
    // search
    searchInput.addEventListener("input", () => {
        updateView
    });
    
    
    // fillter
    statusFilter.addEventListener("change", updateView);
    priorityFilter.addEventListener("change", updateView);
    
}


// Edit
export function setupEditForm(tasks) {
    document.addEventListener("submit", event => {
        const editForm = event.target.closest(".edit-form");

        if (!editForm) {
            return;
        }

        event.preventDefault();

        const id = editForm.dataset.taskId;

        const title = editForm.querySelector("#edit-task-name").value;
        const status = editForm.querySelector("#edit-task-status").value;
        const priority = editForm.querySelector("#edit-task-priority").value;

        updateTask(tasks, id, {
            title,
            status,
            priority
        }, editForm);
    });
}