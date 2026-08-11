class Task{
    constructor(title, status, priority){
        this.title = title;
        this.status = status;
        this.priority = priority;
    }

    changeStatus(status) {
        this.status = status;
    }
}

class Taskbug extends Task{
    constructor(title, priority, severity) {
        super(title, "todo", priority);
        this.severity = severity
    }
}