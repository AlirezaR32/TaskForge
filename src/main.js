import { Task } from "./model/task.js";
import { addCard } from "./ui/taskView.js";
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

})


taskBoard.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-status")) {
        const card = event.target.closest(".task-card");

        const id = card.dataset.taskId

        const task = tasks.find((task) => task.id === id )

        if (!task) return;
        task.status = event.target.value

        card.remove()
        addCard(task)

    }
})
