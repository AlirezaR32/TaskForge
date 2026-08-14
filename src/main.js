import { Task } from "./model/task.js";
import { addCard, showEditForm } from "./ui/taskView.js";
let tasks = []


const form = document.querySelector("#task-form");
form.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.querySelector('#task-name').value;
    const status = document.querySelector("#task-status").value;
    const priority = document.querySelector("#task-priority").value;

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
        console.log(task)
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
    event.preventDefault();
    if (event.target.classList.contains("edit-form")) {
        const form = event.target;
        const id = form.dataset.taskId;

        const task = tasks.find((task) => task.id === id);

        const title = document.querySelector('#edit-task-name').value;
        const status = document.querySelector("#edit-task-status").value;
        const priority = document.querySelector("#edit-task-priority").value;


        task.title = title;
        task.status = status;
        task.priority = priority;
        
        const card = document.querySelector(`[data-task-id="${id}"]`);
        card.remove()
        addCard(task);
        form.remove();

    }
});