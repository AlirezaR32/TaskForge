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

    card.className = `
        task-card
        bg-white
        border
        rounded-lg
        p-3
        shadow-sm
        hover:border-blue-500
        transition
        cursor-grab
        relative
        overflow-hidden
        w-full
    `;

    card.dataset.taskId = task.id;


    // priority line
    const priorityLine = document.createElement("div");

    priorityLine.className = `
        absolute
        top-0
        left-0
        w-full
        h-[2px]
        bg-red-500
    `;


    // priority badge
    const priority = document.createElement("span");

    priority.className = `
        bg-red-100
        text-red-700
        text-xs
        px-2
        py-1
        rounded
        font-bold
        uppercase
    `;

    priority.textContent = task.priority;



    // title

    const title = document.createElement("h3");

    title.className = `
        text-sm
        font-semibold
        text-gray-800
        mt-4
        mb-2
    `;

    title.textContent = task.title;



    // description (اگر مدل داری)

    const description = document.createElement("p");

    description.className = `
        text-xs
        text-gray-500
        mb-4
    `;

    description.textContent =
        task.description ?? "";



    // buttons container

    const actions = document.createElement("div");

    actions.className = `
        flex
        gap-2
        justify-end
    `;



    const editButton = document.createElement("button");

    editButton.textContent = "Edit";

    editButton.className = `
        px-3
        py-1
        rounded-lg
        border
        hover:bg-gray-100
        transition
    `;

    editButton.classList.add("edit-task");



    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";

    deleteButton.className = `
        px-3
        py-1
        rounded-lg
        bg-red-500
        text-white
        hover:bg-red-600
        transition
    `;

    deleteButton.classList.add("delete-task");



    actions.append(
        editButton,
        deleteButton
    );


    card.append(
        priorityLine,
        priority,
        title,
        description,
        actions
    );


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
    console.log(task)
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );
    
    if(taskList) {
        taskList.append(card);
    } else {
        console.log(task)
        console.log(task.status)
        console.log(taskList);
    }
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