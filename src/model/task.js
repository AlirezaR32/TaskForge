export class Task{
    static counter = 0;

    constructor(title,description, status="todo", priority){
        this.id = String(Task.counter++);
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;    
        this.createdAt = new Date();  
    }

    changeStatus(status) {
        this.status = status;
    }
}



export class UrgentTask extends Task{
    constructor(title,description, status, deadline){
        super(title,description, status, "high");
        this.deadline = deadline;
    }

    isOverdue() {
    return new Date(this.deadline) < new Date();
}
}
