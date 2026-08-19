// search 

export function matchesSearch(task, query) {
    return task.title.toLowerCase().includes(query.toLowerCase());
}

// fillter

export function matchesFilters(task, status, priority) {
    const statusMatch =
        status === "all" || task.status === status;

    const priorityMatch =
        priority === "all" || task.priority === priority;

    return statusMatch && priorityMatch;
}


export function getFilteredTasks(
    tasks,
    search,
    status,
    priority
) {
    return tasks.filter(task => {
        return matchesSearch(task, search) && matchesFilters(task, status, priority);
    });
}