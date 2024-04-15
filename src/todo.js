// Todo Class
export default class Todo {
    constructor(title, desc, date, priority) {
        this.title = title;
        this.desc = desc;
        this.date = date;
        this.priority = priority;
        this.done = False;
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

    setDate(date) {
        this.date = date;
    }

    getDate() {
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