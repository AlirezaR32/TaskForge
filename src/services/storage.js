const STORAGE_KEY = "taskforge_tasks"
export function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}


export function getTasks() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);

        if (!data) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to load tasks:", error);
        return [];
    }
}

export function clearTasks() {
    localStorage.removeItem(STORAGE_KEY)
}