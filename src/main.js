import { Task } from "./model/task.js";
import { addCard, showEditForm } from "./ui/taskView.js";
import { saveTasks, getTasks } from "./services/storage.js";
import { getUIState, saveUIState } from "./services/sessionStorage.js";

// render task
function renderTasks(taskList) {
    const taskLists = document.querySelectorAll(".task-list");

    taskLists.forEach(taskList => {
        taskList.innerHTML = "";
    })

    taskList.forEach(task => {
        addCard(task);
    });
}

let tasks = getTasks();
renderTasks(tasks);

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
form.addEventListener("submit", event => {
    event.preventDefault();

    const title = form.querySelector('#task-name').value;
    const status = form.querySelector("#task-status").value;
    const priority = form.querySelector("#task-priority").value;

    const task = new Task(title, status, priority)

    tasks.push(task);
    saveTasks(tasks);
    addCard(task);

    form.reset();
})


// delete task 
const taskBoard = document.querySelector(".task-board");
taskBoard.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-task")
    if (deleteButton) {
        const card = deleteButton.closest(".task-card" );

        const id = card.getAttribute("data-task-id");

        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);
        card.remove()
    }

    if (event.target.classList.contains("edit-task")) {
        const card = event.target.closest(".task-card");

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
        task.status = event.target.value;
        saveTasks(tasks);

        card.remove()
        addCard(task)

    }
})


//edit task
document.addEventListener("submit", event => {
    if (!event.target.classList.contains("edit-form")) {
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

    saveTasks(tasks);

    const card = document.querySelector(`[data-task-id="${id}"]`);
    card.remove()
    addCard(task);
    form.remove();

});


// search

searchInput.addEventListener("input", () => {
    updateView();
});

function matchesSearch(task) {
    const query = searchInput.value.toLowerCase();

    return task.title.toLowerCase().includes(query);
}




// fillter

function matchesFilters(task) {
    const status = statusFilter.value;
    const priority = priorityFilter.value;

    const statusMatch =
        status === "all" || task.status === status;

    const priorityMatch =
        priority === "all" || task.priority === priority;

    return statusMatch && priorityMatch;
}

statusFilter.addEventListener("change", updateView);
priorityFilter.addEventListener("change", updateView);

function getFilteredTasks() {
    return tasks.filter(task => {
        return matchesSearch(task) && matchesFilters(task);
    });
}

function updateView() {
    saveUIState({
        search: searchInput.value,
        status: statusFilter.value,
        priority: priorityFilter.value
    });
    renderTasks(getFilteredTasks())
}
