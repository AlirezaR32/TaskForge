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



export class UrgentTask extends Task{
    constructor(title, status, deadline){
        super(title, status, "high");
        this.deadline = deadline;
    }

    isUrgent(){
        return this.priority == "high";
    }
}
