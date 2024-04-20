import { isToday, isThisWeek } from "date-fns";
import Todo from "./todo";


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
        console.log(this.todos.some((todo) => todo.title == newTodo.getTitle()));
        if (!this.todos.some((todo) => todo.title == newTodo.getTitle())) {
            console.log("Here");
            this.todos.push(newTodo);
        }
    }

    deleteTodo(todoTitle) {
        this.todos.filter((todo) => todo.title !== todoTitle);
    }

    getTodayTodos() {
        return this.todos.filter((todo) => isToday(todo.date));
    }

    getThisWeekTodos() {
        return this.todos.filter((todo) => isThisWeek(todo.date));
    }
}