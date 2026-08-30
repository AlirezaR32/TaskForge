import { findTask, deleteTask, createTask, changeTaskStatus } from "./taskActions.js";
import { openEditModal } from "../ui/taskView.js";
import { renderState } from "../ui/stateView.js";
import { toggleDeadlineField, updateView } from "../main.js";
import { Task, UrgentTask } from "../model/task.js";
import { validateTaskInput } from "./taskValidation.js";

export function setupTaskBoard(taskBoard, tasks) {

    taskBoard.addEventListener("click", (event) => {
        const deleteButton = event.target.closest(".delete-task");
        const editButton = event.target.closest(".edit-task");

        if (deleteButton) {
            const card = deleteButton.closest(".task-card");
            const id = card.getAttribute("data-task-id");
            try {
                deleteTask(tasks, id);
                updateView();
            } catch (error) {
                renderState("error");
            }
        }

        if (editButton) {
            const card = editButton.closest(".task-card");
            const id = card.dataset.taskId;
            const task = findTask(tasks, id);
            openEditModal(task);
        }
    });

    // status change - registered once, not inside the click listener
    taskBoard.addEventListener("change", (event) => {
        if (event.target.classList.contains("task-status")) {
            const card = event.target.closest(".task-card");
            const id = card.dataset.taskId;
            const newStatus = event.target.value;
            try {
                changeTaskStatus(tasks, id, newStatus);
                updateView();
            } catch (error) {
                renderState("error");
            }
        }
    });
}

export function setupAddTask(form, tasks, prioritySelect, deadlineField, deadlineInput, modal) {

    const errorEl = form.querySelector("#task-form-error");

    function showError(message) {
        if (!errorEl) return;
        errorEl.textContent = message;
        errorEl.classList.remove("hidden");
    }

    function clearError() {
        if (!errorEl) return;
        errorEl.textContent = "";
        errorEl.classList.add("hidden");
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const titleInput = form.querySelector('#task-name');
        const status = form.querySelector("#task-status").value;
        const description = form.querySelector("#task-description").value.trim();
        const selectedPriority = prioritySelect.value;

        const { valid, errors, data } = validateTaskInput({
            title: titleInput.value,
            status,
            priority: selectedPriority
        });

        if (!valid) {
            showError(errors.title || errors.status || errors.priority);
            return;
        }

        clearError();

        let task;

        if (selectedPriority === "urgent") {
            const deadline = deadlineInput.value;
            task = new UrgentTask(data.title, description, data.status, deadline);
        } else {
            task = new Task(data.title, description, data.status, data.priority);
        }

        try {
            createTask(tasks, task);
            updateView();
        } catch (error) {
            renderState("error");
            return;
        }

        form.reset();
        toggleDeadlineField();

        if (modal) {
            modal.classList.add("hidden");
            modal.classList.remove("flex");
        }
    });
};

export function setupFilters(searchInput, statusFilter, priorityFilter) {
    // search
    searchInput.addEventListener("input", updateView);

    // filter
    statusFilter.addEventListener("change", updateView);
    priorityFilter.addEventListener("change", updateView);
}
