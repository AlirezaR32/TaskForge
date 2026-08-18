export function renderTasks(taskList) {
    const taskLists = document.querySelectorAll(".task-list");

    taskLists.forEach(taskList => {
        taskList.innerHTML = "";
    })

    taskList.forEach(task => {
        addCard(task);
    });
}

export function renderTaskCard(task) {
    const card = document.createElement("article");
    card.classList.add("task-card");
    card.setAttribute("data-task-id", task.id);

    const title = document.createElement("h3");
    title.textContent = task.title;

    const isUrgent = task.deadline !== undefined && task.deadline !== null;
    if (isUrgent) {
        card.classList.add("urgent-task");
    }

    const priority = document.createElement('span');
    priority.classList.add("task-priority-badge");
    priority.textContent = isUrgent ? "URGENT" : task.priority;

    if (isUrgent && task.deadline) {
        const deadline = document.createElement("span");
        deadline.classList.add("task-deadline");
        const formatted = formatDeadline(task.deadline);
        deadline.textContent = `⏰ ${formatted}`;
        card.append(deadline);
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-task");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-task");

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

    card.append(title, priority, status, deleteButton, editButton);
    return card;
}

function formatDeadline(deadline) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
        return String(deadline);
    }
    return date.toLocaleString();
}



export function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );
    taskList.append(card);
}

export function renderEditForm(task) {
    const title = document.createElement("h2")
    title.textContent = "Edit Task";

    const form = document.createElement("form");
    form.classList.add("edit-form");
    form.setAttribute("data-task-id", task.id);
    
    const nameInput = document.createElement("input");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("id", "edit-task-name");
    nameInput.value = task.title;    
    const status = document.createElement("select");
    status.setAttribute("id", "edit-task-status");
    status.classList.add("edit-task-status");
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
    

    const priority = document.createElement("select");
    priority.setAttribute("id", "edit-task-priority");
    priority.classList.add("edit-task-priority");
    const priorities = ["low", "medium", "high"];
    
    priorities.forEach((s) => {
        const option = document.createElement("option");
        option.value = s;
        option.textContent = s.toUpperCase();

        if (s === task.priority) {
            option.selected = true;
        }

        priority.append(option);
    })

    const submitButton = document.createElement("button");
    submitButton.setAttribute("type", "submit");
    submitButton.classList.add("edit-task-btn");
    submitButton.setAttribute("id", "edit-task-btn");
    submitButton.textContent = "submit";
    
    form.append(title, nameInput, status, priority , submitButton);
    return form;

}

export function showEditForm(task) {
    if (document.querySelector(".edit-form")) return;
    
    const form = renderEditForm(task);

    document.body.append(form)

}