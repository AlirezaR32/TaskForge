
import { getUIState, saveUIState } from "./services/sessionStorage.js";
import { getFilteredTasks } from "./features/taskFilters.js";
import { renderTasks } from "./ui/taskView.js";
import { renderState } from "./ui/stateView.js";
import { getTasks, saveTasks } from "./services/storage.js";
import { setupAddTask, setupTaskBoard, setupFilters } from "./features/taskEvents.js";

// render task
let tasks = [];
tasks = getTasks();

const uiState = getUIState();

const statusFilter = document.querySelector("#status-filter");
const priorityFilter = document.querySelector("#priority-filter");
const searchInput = document.querySelector("#search");
const mobileNav = document.querySelector("#mobile-nav");
const mobileNavToggle = document.querySelector("#mobile-nav-toggle");
const mobileNavClose = document.querySelector("#mobile-nav-close");
const mobileNavBackdrop = document.querySelector("#mobile-nav-backdrop");

function syncMobileNavState(isOpen) {
    if (!mobileNav || !mobileNavToggle || !mobileNavBackdrop) {
        return;
    }

    const shouldOpen = Boolean(isOpen);
    mobileNav.classList.toggle("-translate-x-full", !shouldOpen);
    mobileNav.classList.toggle("translate-x-0", shouldOpen);
    mobileNavBackdrop.classList.toggle("hidden", !shouldOpen);
    mobileNavToggle.setAttribute("aria-expanded", String(shouldOpen));
    document.body.classList.toggle("overflow-hidden", shouldOpen && window.innerWidth < 1024);

    uiState.mobileNavOpen = shouldOpen;
    saveUIState(uiState);
}

if (mobileNavToggle) {
    mobileNavToggle.addEventListener("click", () => {
        syncMobileNavState(!uiState.mobileNavOpen);
    });
}

if (mobileNavClose) {
    mobileNavClose.addEventListener("click", () => syncMobileNavState(false));
}

if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", () => syncMobileNavState(false));
}

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        syncMobileNavState(false);
    }
});

priorityFilter.value = uiState.priority;
searchInput.value = uiState.search;
statusFilter.value = uiState.status;
syncMobileNavState(uiState.mobileNavOpen);


//add task
const form = document.querySelector("#task-form");
const prioritySelect = form.querySelector("#task-priority");
const deadlineField = form.querySelector("#deadline-field");
const deadlineInput = form.querySelector("#task-deadline");

// show/hide the deadline field when "Urgent" is selected
export function toggleDeadlineField() {
    const isUrgent = prioritySelect.value === "urgent";
    deadlineField.hidden = !isUrgent;
    deadlineInput.required = isUrgent;
    if (!isUrgent) {
        deadlineInput.value = "";
    }
}

prioritySelect.addEventListener("change", toggleDeadlineField);
toggleDeadlineField();

// ====================
// Add Task Modal
// ====================

const openBtn = document.querySelector("#open-task-modal");
const openBtnMobile = document.querySelector("#open-task-modal-mobile");
const modal = document.querySelector("#task-modal");
const closeTaskModalButton = document.querySelector("#close-task-modal");
const taskFormError = document.querySelector("#task-form-error");

function openTaskModal() {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    syncMobileNavState(false);
    form.querySelector("#task-name").focus();
}

function closeTaskModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    form.reset();
    toggleDeadlineField();
    if (taskFormError) {
        taskFormError.textContent = "";
        taskFormError.classList.add("hidden");
    }
}

if (openBtn) {
    openBtn.addEventListener("click", openTaskModal);
}

if (openBtnMobile) {
    openBtnMobile.addEventListener("click", openTaskModal);
}

if (closeTaskModalButton) {
    closeTaskModalButton.addEventListener("click", closeTaskModal);
}

modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeTaskModal();
    }
});

setupAddTask(form, tasks, prioritySelect, deadlineField, deadlineInput, modal);


// delete task & edit task
const taskBoard = document.querySelector(".task-board");
setupTaskBoard(taskBoard, tasks)

// wire up search / status / priority filters
setupFilters(searchInput, statusFilter, priorityFilter);


// ====================
// Board rendering
// ====================

export function updateView() {
    saveUIState({
        search: searchInput.value,
        status: statusFilter.value,
        priority: priorityFilter.value
    });
    const filteredTasks = getFilteredTasks(
        tasks,
        searchInput.value,
        statusFilter.value,
        priorityFilter.value
    );
    renderTasks(filteredTasks);

    if (filteredTasks.length === 0) {
        renderState(tasks.length === 0 ? "empty-data" : "empty-result");
    } else {
        renderState(null);
    }
}

updateView();


// ====================
// Edit Task Modal
// ====================

const editModal = document.querySelector("#edit-task-modal");
const editForm = document.querySelector("#edit-task-form");

const closeEditButton = document.querySelector("#close-edit-modal");
const cancelEditButton = document.querySelector("#cancel-edit");

const editTaskId = document.querySelector("#edit-task-id");
const editTaskName = document.querySelector("#edit-task-name");
const editTaskDescription = document.querySelector("#edit-task-description");
const editTaskStatus = document.querySelector("#edit-task-status");
const editTaskPriority = document.querySelector("#edit-task-priority");


// Close buttons
closeEditButton.addEventListener("click", closeEditModal);
cancelEditButton.addEventListener("click", closeEditModal);


// Close by clicking outside
editModal.addEventListener("click", (event) => {

    if (event.target === editModal) {
        closeEditModal();
    }

});


// Submit edit
editForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const id = editTaskId.value;

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    task.title = editTaskName.value.trim();

    task.description = editTaskDescription.value.trim();

    task.status = editTaskStatus.value;

    task.priority = editTaskPriority.value;

    saveTasks(tasks);

    updateView();

    closeEditModal();
});

function closeEditModal() {

    editModal.classList.add("hidden");
    editModal.classList.remove("flex");

    editForm.reset();
}

// Escape key closes whichever overlay is currently open
document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (!editModal.classList.contains("hidden")) {
        closeEditModal();
    } else if (!modal.classList.contains("hidden")) {
        closeTaskModal();
    } else if (uiState.mobileNavOpen) {
        syncMobileNavState(false);
    }
});
