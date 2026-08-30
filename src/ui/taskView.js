const COLUMN_STATUSES = ["todo", "doing", "done"];

const PRIORITY_STYLES = {
    low: {
        badge: "bg-surface-container text-on-surface-variant",
        bar: "bg-outline",
        label: "Low",
    },
    medium: {
        badge: "bg-secondary-container text-on-secondary-container",
        bar: "bg-secondary",
        label: "Medium",
    },
    high: {
        badge: "bg-error-container text-on-error-container",
        bar: "bg-error",
        label: "High",
    },
    urgent: {
        badge: "bg-error text-on-error",
        bar: "bg-error",
        label: "Urgent",
    },
};

export function renderTasks(taskList) {
    const taskLists = document.querySelectorAll(".task-list");

    taskLists.forEach(list => {
        list.innerHTML = "";
    });

    taskList.forEach(task => {
        addCard(task);
    });

    renderEmptyPlaceholders();
}

function formatDeadline(deadline) {
    const date = new Date(deadline);
    if (isNaN(date.getTime())) {
        return String(deadline);
    }
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function renderTaskCard(task) {
    const isUrgent = Boolean(task.deadline);
    const priorityKey = isUrgent ? "urgent" : (task.priority || "low");
    const style = PRIORITY_STYLES[priorityKey] || PRIORITY_STYLES.low;
    const isOverdue = isUrgent && new Date(task.deadline) < new Date();

    const card = document.createElement("article");
    card.className = "task-card group relative w-full shrink-0 cursor-grab overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-3 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-secondary hover:shadow-[0_4px_10px_rgba(15,23,42,0.1)]";
    card.dataset.taskId = task.id;

    // priority accent bar
    const priorityLine = document.createElement("div");
    priorityLine.className = `absolute top-0 left-0 h-[3px] w-full ${style.bar}`;
    card.append(priorityLine);

    // top row: priority badge + hover actions
    const topRow = document.createElement("div");
    topRow.className = "mb-2 mt-1 flex items-start justify-between gap-2";

    const priorityBadge = document.createElement("span");
    priorityBadge.className = `${style.badge} font-label-code text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide`;
    priorityBadge.textContent = style.label;
    topRow.append(priorityBadge);

    const actions = document.createElement("div");
    actions.className = "flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.setAttribute("aria-label", "Edit task");
    editButton.className = "edit-task rounded p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors";
    editButton.innerHTML = '<span class="material-symbols-outlined text-[16px]">edit</span>';

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.className = "delete-task rounded p-1 text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors";
    deleteButton.innerHTML = '<span class="material-symbols-outlined text-[16px]">delete</span>';

    actions.append(editButton, deleteButton);
    topRow.append(actions);
    card.append(topRow);

    // title
    const title = document.createElement("h3");
    title.className = "mb-1 font-body-md text-body-md font-semibold leading-tight text-on-surface";
    title.textContent = task.title;
    card.append(title);

    // description
    if (task.description) {
        const description = document.createElement("p");
        description.className = "mb-2 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant";
        description.textContent = task.description;
        card.append(description);
    }

    // deadline (urgent tasks only)
    if (isUrgent) {
        const deadlineRow = document.createElement("div");
        deadlineRow.className = `flex items-center gap-1 font-body-sm text-[11px] font-medium ${isOverdue ? "text-error" : "text-on-surface-variant"}`;
        deadlineRow.innerHTML = `<span class="material-symbols-outlined text-[14px]">schedule</span> ${isOverdue ? "Overdue: " : "Due "}${formatDeadline(task.deadline)}`;
        card.append(deadlineRow);
    }

    return card;
}

export function addCard(task) {
    const card = renderTaskCard(task);
    const taskList = document.querySelector(
        `[data-status="${task.status}"] .task-list`
    );

    if (taskList) {
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

    form.append(title, nameInput, status, priority, submitButton);
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

    renderEmptyPlaceholders();
}

function renderEmptyPlaceholders() {
    COLUMN_STATUSES.forEach(status => {
        const list = document.querySelector(`[data-status="${status}"] .task-list`);
        if (!list) return;

        const hasCards = list.querySelector(".task-card") !== null;
        let placeholder = list.querySelector(".task-list-empty");

        if (hasCards) {
            if (placeholder) placeholder.remove();
            return;
        }

        if (!placeholder) {
            placeholder = document.createElement("div");
            placeholder.className = "task-list-empty flex flex-1 flex-col items-center justify-center gap-1 py-8 text-center text-on-surface-variant";
            placeholder.innerHTML = '<span class="material-symbols-outlined text-[28px] opacity-50">inbox</span><p class="font-body-sm text-body-sm">No tasks here</p>';
            list.append(placeholder);
        }
    });
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
