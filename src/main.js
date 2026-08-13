import { Task, Taskbug } from "./model/task.js";

const tasks = []

// reander the task
function renderTaskCard(task) {
    const card = document.createElement("article");
    card.classList.add("task-card");

    const title = document.createElement("h3");
    title.textContent = task.title;

    const priority = document.createElement('span');
    priority.textContent = task.priority

    card.append(title);
    card.append(priority)
    return card;
}




function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );

    taskList.append(card);
}


// tasks.forEach(task => {
//     addCard(task)
// });


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



