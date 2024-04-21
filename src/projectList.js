// import Todo from './todo.js';
import Project from './project.js';

export default class ProjectList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('All'));
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
        this.projects = this.projects.filter((project) => project.name !== projectName);
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
    updateAll() {
        this.getProject('All').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "All" && project.name != "Today" && project.name != "This Week" && project.name != "Done") {
                project.getTodos().forEach((todo) => {
                    buffer.push(todo);
                })
            }
        })

        this.getProject('All').setTodos(buffer);
    }

    updateToday() {
        this.getProject('Today').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "All" && project.name != "Today" && project.name != "This Week" && project.name != "Done") {
                project.getTodayTodos().forEach((todo) => {
                    buffer.push(todo);
                })
            }
        })

        this.getProject('Today').setTodos(buffer);
    }

    updateThisWeek() {
        this.getProject('This Week').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "All" && project.name != "Today" && project.name != "This Week" && project.name != "Done") {
                project.getThisWeekTodos().forEach((todo) => {
                    buffer.push(todo);
                })
            }
        })

        this.getProject('This Week').setTodos(buffer);
    }

    // Marked completed or overdue
    updateDone() {
        this.getProject('Done').setTodos([]);

        let buffer = [];
        this.projects.forEach((project) => {
            if (project.name != "All" && project.name != "Today" && project.name != "This Week" && project.name != "Done") {
                project.getTodos().forEach((todo) => {
                    if (todo.done) buffer.push(todo);
                })
            }
        })

        this.getProject('Done').setTodos(buffer);

    }

};