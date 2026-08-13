// reander the task
export function renderTaskCard(task) {
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



export function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );

    taskList.append(card);
}