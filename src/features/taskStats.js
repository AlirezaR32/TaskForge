export function getTaskStates() {
    return {
        total: tasks.length,
        todo: tasks.filter((task) => task.status == 'todo').length,
        doing: tasks.filter((task) => task.status === "doing").length,
        done: tasks.filter((task) => task.status === "done").length,

        highPriority: tasks.filter((task) => task.priority === "high").length
    }
}

export function getTaskByStates(tasks) {
    return tasks.reduce((stats, task) => {
        stats[task.status]++;
        return stats
    }, {
        todo: 0,
        doing: 0,
        done: 0
    });
}

