import { Task, UrgentTask } from "./model/task.js";
import { addCard, showEditForm } from "./ui/taskView.js";
import { saveTasks, getTasks } from "./services/storage.js";
import { getUIState, saveUIState } from "./services/sessionStorage.js";
import { matchesFilters, matchesSearch, getFilteredTasks } from "./features/taskFilters.js";
import { renderTasks } from "./ui/taskView.js";
import { fetchTasks } from "./api/taskApi.js";
import { renderState } from "./ui/stateView.js";
import { createTask, deleteTask, findTask, updateTask, changeTaskStatus } from "./features/taskActions.js";
import { setupAddTask, setupEditForm, setupTaskBoard } from "./features/taskEvents.js";

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

priorityFilter.value = uiState.priority;
searchInput.value = uiState.search;
statusFilter.value = uiState.status;

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

setupEditForm(tasks);

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
