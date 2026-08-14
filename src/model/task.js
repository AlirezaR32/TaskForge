export class Task{
    static counter = 0;

    constructor(title, status="todo", priority){
        this.id = String(Task.counter++);
        this.title = title;
        this.status = status;
        this.priority = priority;    
        this.createAt = new Date();  
    }

    changeStatus(status) {
        this.status = status;
    }
}

export class Taskbug extends Task{
    constructor(title, priority, severity) {
        super(title, "todo", priority);
        this.severity = severity
    }
}

