import { isToday, isThisWeek } from "date-fns";


export default class Project {
    constructor(name) {
        this.name = name;
        this.todos = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    getTodos() {
        return this.todos;
    }

    

    addTodo(newTodo) {
        if (!this.todos.find((todo) => todo.getTitle == newTodo.title)) {
            this.todos.push(newTodo);
        }
    }

    deleteTodo(todoTitle) {
        this.todos.filter((todo) => todo.title !== todoTitle);
    }

    finishTodo(todo) {
        todo.setDone(true);
    }

    getTodayTodos() {
        return this.todos.filter((todo) => isToday(todo.getDate));
    }

    getThisWeekTodos() {
        return this.todos.filter((todo) => isThisWeek(todo.getDate));
    }
}