// import Todo from './todo.js';
import Project from './project.js';

export default class ProjectList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('All Todos'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('This Week'));
        this.projects.push(new Project('Done'));
    };

    /**
     * 
     * @param {Project} newProject - instance of Project object
     */
    addProject(newProject) {
        if (!this.projects.some((project) => project.name == newProject.getName())) {
            this.projects.push(newProject);
        }
        else {
            console.log('Project with same name exists');
            return;
        }
    }

    deleteProject(projectName) {
        this.projects.filter((project) => project.name !== projectName);
    }

    renameProject(projectName, newName) {
        let idx = this.projects.findIndex((project) => project.name === projectName);
        this.projects[idx].setName(newName);
    }

    getProjects() {
        return this.projects;
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.name === projectName)
    }

    // Update All, Today, This Week, Done Projects
};