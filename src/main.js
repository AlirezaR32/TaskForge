import { Task } from "./model/task.js";
import { addCard, showEditForm } from "./ui/taskView.js";
let tasks = []


const form = document.querySelector("#task-form");
form.addEventListener("submit", event => {
    event.preventDefault();

    const title = form.querySelector('#task-name').value;
    const status = form.querySelector("#task-status").value;
    const priority = form.querySelector("#task-priority").value;

    const task = new Task(title, status, priority)

    tasks.push(task);
    addCard(task);

    form.reset();
})


const taskBoard = document.querySelector(".task-board");

taskBoard.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-task")) {
        const card = event.target.closest(".task-card");

        const id = card.getAttribute("data-task-id");

        tasks = tasks.filter(task => task.id !== id);
        card.remove()
    }

    if (event.target.classList.contains("edit-task")) {
        const card = event.target.closest(".task-card");

        const id = card.dataset.taskId

        const task = tasks.find((task) => task.id === id)
        showEditForm(task)
    }

})


taskBoard.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-status")) {
        const card = event.target.closest(".task-card");

        const id = card.dataset.taskId

        const task = tasks.find((task) => task.id === id)

        if (!task) return;
        task.status = event.target.value

        card.remove()
        addCard(task)

    }
})



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

        const card = document.querySelector(`[data-task-id="${id}"]`);
        card.remove()
        addCard(task);
        form.remove();

    });


// search
const searchInput = document.querySelector("#search")

function renderSearchRes(taskList) {
    const taskLists = document.querySelectorAll(".task-list");
    
    taskLists.forEach(taskList => {
        taskList.innerHTML = "";
    })

    taskList.forEach(task => {
        addCard(task);
    });
}
searchInput.addEventListener("input", event => {
    const query = event.target.value;
    const filterTask = tasks.filter(task =>
        task.title.toLowerCase().includes(query.toLowerCase())
    );
    
    renderSearchRes(filterTask);

})