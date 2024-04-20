// Todo Class
export default class Todo {
    constructor(title, desc, date, priority) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.priority = priority;
        this.done = false;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setDesc(desc) {
        this.desc = desc;
    }

    getDesc() {
        return this.desc;
    }

    setDueDate(date) {
        this.date = date;
    }

    getDueDate() {
        return this.date;
    }

    setPriority(priority) {
        this.priority = priority;
    }

    getPriority() {
        return this.priority;
    }

    setDone(isDone) {
        this.done = isDone;
    } 

    getDone() {
        return this.done;
    } 
};