
import { getUIState, saveUIState } from "./services/sessionStorage.js";
import { getFilteredTasks } from "./features/taskFilters.js";
import { renderTasks } from "./ui/taskView.js";
import { getTasks, saveTasks } from "./services/storage.js";
import { setupAddTask, setupTaskBoard } from "./features/taskEvents.js";

// render task
let tasks = [];
tasks = getTasks();

renderTasks(tasks);
// console.log(tasks)

// api
// async function loadTasks() {
//     renderState("loading");

//     try {
//         tasks = await fetchTasks();

//         if (tasks.length === 0) {
//             renderState("empty-data");
//             return;
//         }

//         renderState("success");
//         updateView();

//     } catch (error) {
//         console.error(error);

//         renderState("error");
//     }
// }

// loadTasks();

// console.log(tasks);



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

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && uiState.mobileNavOpen) {
        syncMobileNavState(false);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
        syncMobileNavState(false);
    }
});

priorityFilter.value = uiState.priority;
searchInput.value = uiState.search;
statusFilter.value = uiState.status;
syncMobileNavState(uiState.mobileNavOpen);

updateView();


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

setupAddTask(form, tasks, prioritySelect, deadlineField, deadlineInput);


// delete task & edit task
const taskBoard = document.querySelector(".task-board");
setupTaskBoard(taskBoard, tasks)


//edit task
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
}

const openBtn = document.querySelector("#open-task-modal");
const modal = document.querySelector("#task-modal");

openBtn.addEventListener("click",()=>{
    modal.classList.remove("hidden");
    modal.classList.add("flex");
});


modal.addEventListener("click",(e)=>{

 if(e.target === modal){
    modal.classList.add("hidden");
 }

});


// Edit Task Modal
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
    console.log(editForm)

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