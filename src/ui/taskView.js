export function renderTaskCard(task) {
    const card = document.createElement("article");
    card.classList.add("task-card");
    card.setAttribute("data-task-id", task.id);

    const title = document.createElement("h3");
    title.textContent = task.title;

    const priority = document.createElement('span');
    priority.textContent = task.priority

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-task");

    card.append(title, priority, deleteButton);
    return card;
}



export function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );

    taskList.append(card);
}