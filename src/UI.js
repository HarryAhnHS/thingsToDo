import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';
import Storage from './storage.js';

import { isWithinInterval, formatDistanceToNow, format } from 'date-fns';

// Display: For each project in list, create tab in sidebar and display it's todos in main content page

    // Function: For each todo in project -- edit, delete, mark as done. 

// Function: Add Task (Main Content) - Title, Priority, Date, Description, which project to add to

// Function: Click Task for details

// Function: Add Project (Sidebar)

const UI = (() => {

    /**
     * Function to display user created projects in sidebar
     */
    function displayProjects() {
        Storage.getProjectList().getProjects().forEach((project) => {
            if (project.name != 'All' && project.name != 'Today' && project.name != 'This Week' && project.name != 'Done') {
                UI.createProject(project.name);
            }
        });
    }

    /**
     * helper function to createproject element and append
     * @param {*} name project name
     */
    function createProject(name) {
        const myProjectList = document.querySelector('.my-projects');

        const project = document.createElement('div');
        project.classList.add('project');
        project.textContent = `* ${name}`;

        myProjectList.appendChild(project);
    }

    function displayTasks(projectName) {
        Storage.getProjectList().getProject(projectName).getTodos().forEach((todo) => {
            createTask(todo.title, todo.priority, todo.desc, todo.date);
        });
    }


    function createTask(title, priority, desc, date) {
        const todoList = document.querySelector('.todo-list');
        const today = new Date();
        if (isWithinInterval(date, {
            start: today,
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        })) {
            // If task's date is due within a week
            todoList.innerHTML += `<div class="todo">
                    <input type="checkbox" class="checkbox" id="0_0">
                    <div class="title-desc">
                        <div class="title">
                            <div>${title}</div>
                            <div class="priority">${priority} Priority</div>
                        </div>
                        <div class="desc">${desc}</div>
                    </div>
                    <div class="date-time">
                        <div class="date">${formatDistanceToNow(date)}</div>
                        <div class="time">@${format(date, "p")}</div>
                    </div>
                    <div class="edit">
                        Edit
                    </div>
                </div>`;
        }
        else {
            todoList.innerHTML += `<div class="todo">
            <input type="checkbox" class="checkbox" id="0_0">
            <div class="title-desc">
                <div class="title">
                    <div>${title}</div>
                    <div class="priority">${priority} Priority</div>
                </div>
                <div class="desc">${desc}</div>
            </div>
            <div class="date-time">
                <div class="date">${format(date, "PPP")}</div>
                <div class="time">@${format(date, "p")}</div>
            </div>
            <div class="edit">
                Edit
            </div>
        </div>`;
        }
    };

        
    return {
        displayProjects,
        createProject,

        displayTasks,
        createTask
    }
})();

export default UI;