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

    const status = document.createElement("select");
    status.classList.add("task-status");
    const statuses = ["todo", "doing", "done"];
    
    statuses.forEach((s) => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s.toUpperCase();

        if (s === task.status) {
            option.selected = true;
        }

        status.append(option);
    })

    card.append(title, priority, status, deleteButton);
    return card;
}



export function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );
    taskList.append(card);
}