import { Task, UrgentTask } from "./model/task.js";
import { addCard, showEditForm } from "./ui/taskView.js";
import { saveTasks, getTasks } from "./services/storage.js";
import { getUIState, saveUIState } from "./services/sessionStorage.js";
import { matchesFilters, matchesSearch, getFilteredTasks } from "./features/taskFilters.js";
import { renderTasks } from "./ui/taskView.js";
import { fetchTasks } from "./api/taskApi.js"
import { renderState } from "./ui/stateView.js";        


// render task
let tasks = [];
// tasks = getTasks();

renderTasks(tasks);
// console.log(tasks)

// api
async function loadTasks() {
    renderState("loading");

    try {
        tasks = await fetchTasks();

        if (tasks.length === 0) {
            renderState("empty-data");
            return;
        }

        renderState("success");
        updateView();

    } catch (error) {
        console.error(error);

        renderState("error");
    }
}

loadTasks();

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
function toggleDeadlineField() {
    const isUrgent = prioritySelect.value === "urgent";
    deadlineField.hidden = !isUrgent;
    deadlineInput.required = isUrgent;
    if (!isUrgent) {
        deadlineInput.value = "";
    }
}

prioritySelect.addEventListener("change", toggleDeadlineField);
toggleDeadlineField();

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

    try {
        tasks.push(task);
        saveTasks(tasks);
        addCard(task);
    } catch (error) {
        renderState("error");
    }

    form.reset();
    toggleDeadlineField();
})


// delete task
const taskBoard = document.querySelector(".task-board");
taskBoard.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task");
    const editButton = event.target.closest(".edit-task");
    if (deleteButton) {
        const card = deleteButton.closest(".task-card");

        const id = card.getAttribute("data-task-id");


        try {
            tasks = tasks.filter(task => task.id !== id);
            saveTasks(tasks);
            card.remove();
        } catch (error) {
            renderState("error");
        }
    }

    if (editButton) {
        const card = editButton.closest(".task-card");

        const id = card.dataset.taskId

        const task = tasks.find((task) => task.id === id)
        showEditForm(task)
    }

})

// status change
taskBoard.addEventListener("change", (event) => {

    if (event.target.classList.contains("task-status")) {
        const card = event.target.closest(".task-card");

        const id = card.dataset.taskId

        const task = tasks.find((task) => task.id === id)

        if (!task) return;

        try {
            task.changeStatus(event.target.value);
            saveTasks(tasks);
            card.remove();
            addCard(task);
        } catch (error) {
            renderState("error");
        }

    }
})


//edit task
document.addEventListener("submit", event => {
    const editForm = event.target.closest(".edit-form")
    if (!editForm) {
        return;
    }
    event.preventDefault();

    const form = event.target;
    const id = form.dataset.taskId;

    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const title = form.querySelector('#edit-task-name').value;
    const status = form.querySelector("#edit-task-status").value;
    const priority = form.querySelector("#edit-task-priority").value;


    task.title = title;
    task.status = status;
    task.priority = priority;



    try {
        saveTasks(tasks);

        const card = document.querySelector(`[data-task-id="${id}"]`);
        card.remove()
        addCard(task);
        form.remove();
    } catch (error) {
        renderState("error");
    }

});


// search
searchInput.addEventListener("input", () => {
    updateView();
});


// fillter
statusFilter.addEventListener("change", updateView);
priorityFilter.addEventListener("change", updateView);



function updateView() {
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