import { Task, Taskbug } from "./model/task.js";

let todo = []

todo.push(new Task('salam', 'doing', 'low'))
todo.push(new Task('salam', 'doing', 'low'))
todo.push(new Task('salam', 'doing', 'low'))
todo.push(new Task('salam', 'doing', 'low'))
todo.push(new Task('salam', 'doing', 'low'))

console.log(todo)

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

const task1 = new Task('salam', 'done', 'low')


function addCard(task) {
    const card = renderTaskCard(task)
    const todoList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );

    todoList.append(card);
}


todo.forEach(task => {
    addCard(task)
});