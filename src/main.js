import { Task } from "./model/task.js";
import { addCard } from "./ui/taskView.js";
const tasks = []




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



