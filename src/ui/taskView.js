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

    card.dataset.taskId = task.id;

    // Priority configuration
    const priorityStyles = {
        low: {
            line: "bg-slate-400",
            badge: "bg-slate-100 text-slate-600",
        },

        medium: {
            line: "bg-blue-500",
            badge: "bg-blue-100 text-blue-700",
        },

        high: {
            line: "bg-orange-500",
            badge: "bg-orange-100 text-orange-700",
        },

        urgent: {
            line: "bg-red-500",
            badge: "bg-red-100 text-red-700",
        }
    };

    const style =
        priorityStyles[task.priority] ??
        priorityStyles.low;



    // Card

    card.className = `
        task-card
        relative
        overflow-hidden
        w-full
        shrink-0
        bg-surface-container-lowest
        border
        border-outline-variant
        rounded-lg
        p-3
        shadow-sm
        hover:shadow-md
        hover:border-secondary
        transition-all
        duration-200
        cursor-grab
    `;

    // Priority line


    const priorityLine = document.createElement("div");

    priorityLine.className = `
        absolute
        top-0
        left-0
        w-full
        h-[3px]
        ${style.line}
    `;

    // Header

    const header = document.createElement("div");

    header.className = `
        flex
        items-center
        justify-between
        mt-1
        mb-3
    `;


    // Priority badge

    const priority = document.createElement("span");

    priority.className = `
        ${style.badge}
        text-[11px]
        px-2
        py-1
        rounded-md
        font-bold
        uppercase
        tracking-wide
    `;

    priority.textContent = task.priority;


    // Title


    const title = document.createElement("h3");

    title.className = `
        text-sm
        font-semibold
        text-on-surface
        leading-5
        mb-2
        break-words
    `;

    title.textContent = task.title;


    // Description


    const description = document.createElement("p");

    description.className = `
        text-xs
        text-on-surface-variant
        leading-5
        mb-4
        break-words
    `;

    description.textContent =
        task.description || "No description";

    // Deadline


    if (task.deadline) {

        const deadline = document.createElement("div");

        deadline.className = `
            flex
            items-center
            gap-1
            text-xs
            text-on-surface-variant
            mb-3
        `;

        deadline.innerHTML = `
            <span class="material-symbols-outlined text-[16px]">
                schedule
            </span>
            <span>${formatDeadline(task.deadline)}</span>
        `;

        card.append(deadline);
    }


    // Actions

    const actions = document.createElement("div");

    actions.className = `
        flex
        gap-2
        justify-end
        pt-2
        border-t
        border-outline-variant
    `;


    // Edit button

    const editButton = document.createElement("button");

    editButton.type = "button";

    editButton.textContent = "Edit";

    editButton.className = `
        edit-task
        px-3
        py-1.5
        rounded-lg
        border
        border-outline-variant
        text-xs
        font-medium
        text-on-surface
        hover:bg-surface-container
        hover:border-secondary
        transition
    `;


    // Delete button

    const deleteButton = document.createElement("button");

    deleteButton.type = "button";

    deleteButton.textContent = "Delete";

    deleteButton.className = `
        delete-task
        px-3
        py-1.5
        rounded-lg
        bg-red-500
        text-white
        text-xs
        font-medium
        hover:bg-red-600
        active:scale-95
        transition
    `;


    // --------------------------------
    // Build card
    // --------------------------------

    header.append(priority);

    actions.append(
        editButton,
        deleteButton
    );

    card.append(
        priorityLine,
        header,
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
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );
    
    if(taskList) {
        taskList.append(card);
        updateTaskCounts();
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

export function updateTaskCounts() {
    const columns = {
        todo: document.querySelector('[data-status="todo"] .task-list'),
        doing: document.querySelector('[data-status="doing"] .task-list'),
        done: document.querySelector('[data-status="done"] .task-list'),
    };

    document.querySelector("#todo-count").textContent =
        columns.todo.children.length;

    document.querySelector("#doing-count").textContent =
        columns.doing.children.length;

    document.querySelector("#done-count").textContent =
        columns.done.children.length;
}

export function openEditModal(task) {

    if (!task) return;

    document.querySelector("#edit-task-id").value = task.id;
    document.querySelector("#edit-task-name").value = task.title;
    document.querySelector("#edit-task-description").value =
        task.description ?? "";

    document.querySelector("#edit-task-status").value =
        task.status;

    document.querySelector("#edit-task-priority").value =
        task.priority;

    const modal = document.querySelector("#edit-task-modal");

    modal.classList.remove("hidden");
    modal.classList.add("flex");
}