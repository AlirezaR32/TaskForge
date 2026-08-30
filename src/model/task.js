const VALID_STATUSES = ["todo", "doing", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

export class Task {
    static counter = 0;

    constructor(title, description = "", status = "todo", priority = "low") {
        if (!VALID_STATUSES.includes(status)) {
            throw new Error("Invalid task status");
        }

        if (!VALID_PRIORITIES.includes(priority)) {
            throw new Error("Invalid task priority");
        }

        this.id = String(Task.counter++);
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = new Date();
    }

    changeStatus(status) {
        if (!VALID_STATUSES.includes(status)) {
            throw new Error("Invalid task status");
        }

        this.status = status;
    }
}

export class UrgentTask extends Task {
    constructor(title, description = "", status = "todo", deadline) {
        super(title, description, status, "high");
        this.deadline = deadline;
    }

    isOverdue() {
        return new Date(this.deadline) < new Date();
    }
}
