export function validateTaskInput({ title, status, priority }) {
    const errors = {};

    const cleanTitle = title.trim();

    if (!cleanTitle) {
        errors.title = "Task title is required.";
    } else if (cleanTitle.length < 3) {
        errors.title = "Task title must be at least 3 characters.";
    } else if (cleanTitle.length > 100) {
        errors.title = "Task title must be less than 100 characters.";
    }

    const validStatuses = ["todo", "doing", "done"];

    if (!validStatuses.includes(status)) {
        errors.status = "Invalid task status.";
    }

    const validPriorities = ["low", "medium", "high", "urgent"];

    if (!validPriorities.includes(priority)) {
        errors.priority = "Invalid task priority.";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
        data: {
            title: cleanTitle,
            status,
            priority
        }
    };
}