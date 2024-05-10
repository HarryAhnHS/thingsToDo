import { compareAsc, isToday, isThisWeek, isPast } from "date-fns";
import Todo from "./todo";


export default class Project {
    constructor(name, color) {
        this.name = name;
        this.todos = [];
        this.color = color;
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setColor(color) {
        this.color = color;
    } 

    getColor() {
        return this.color;
    }

    getTodos() {
        return this.todos;
    }

    setTodos(todos) {
        this.todos = todos;
    }

    getTodo(todoTitle) {
        return this.todos.find((todo) => todo.title == todoTitle);
    }

    /**
     * 
     * @param {Todo} newTodo - instance of Todo object to be added
     */
    addTodo(newTodo) {
        if (!this.todos.some((todo) => todo.title == newTodo.getTitle())) {
            this.todos.push(newTodo);
        }
    }

    deleteTodo(todoTitle) {
        this.todos = this.todos.filter((todo) => todo.title !== todoTitle);
    }

    getTodayTodos() {
        return this.todos.filter((todo) => isToday(todo.date));
    }

    getThisWeekTodos() {
        return this.todos.filter((todo) => isThisWeek(todo.date));
    }

    getOverdueTodos() {
        return this.todos.filter((todo) => isPast(todo.date));
    }

    sortTodos() {
        this.todos.sort((a,b) => compareAsc(a.date, b.date));
    }
}