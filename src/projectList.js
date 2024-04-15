// import Todo from './todo.js';
import Project from './project.js';

export default class List {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('All Todos'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('This Week'));
        this.projects.push(new Project('Done'));
    };

    addProject(newProject) {
        if (!this.projects.find((project) => project.getName == newProject.name)) {
            this.projects.push(newProject);
        }
    }

    deleteProject(projectName) {
        projects.filter((project) => project.getName !== projectName);
    }

    // Update All, Today, This Week, Done Projects
};