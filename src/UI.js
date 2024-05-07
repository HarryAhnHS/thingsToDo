import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';
import Storage from './storage.js';

import { isPast, isWithinInterval, formatDistance, formatDistanceToNow, format } from 'date-fns';

// Display: For each project in list, create tab in sidebar and display it's todos in main content page

    // Function: For each todo in project -- edit, delete, mark as done. 

// Function: Add Task (Main Content) - Title, Priority, Date, Description, which project to add to

// Function: Click Task for details

// Function: Add Project (Sidebar)

const UI = (() => {

    function initDisplay() {        
        const projectDivs = document.querySelectorAll('.project');
        const projectName = document.querySelector('.main-head');

        projectDivs.forEach((project) => {
            if (project.textContent == 'All') {
                resetActive();
                project.classList.add("active");
                projectName.textContent = "All Todos";
                clearTodos();
                Storage.getProjectList().updateAll();
                displayTodos('All');
            }
        });
    };

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

    function displayTodos(projectName) {
        Storage.getProjectList().getProject(projectName).getTodos().forEach((todo) => {
            createTodo(todo.title, todo.priority, todo.desc, todo.date, todo.done);
        });
    }


    function createTodo(title, priority, desc, date, done) {
        const todoList = document.querySelector('.todo-list');
        const today = new Date();

        if (isWithinInterval(date, {
            start: today,
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
        })) {
            // 1. If task's date is due within a week
            todoList.innerHTML += `<div class="todo">
                    <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
                    <div class="title-desc">
                        <div class="title">
                            <div>${title}</div>
                            <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
                        </div>
                        <div class="desc">${desc}</div>
                    </div>
                    <div class="date-time">
                        <div class="date">${formatDistanceToNow(date,{addSuffix: true})}</div>
                        <div class="time">@${format(date, "p")}</div>
                    </div>
                    <div class="edit">
                        Edit
                    </div>
                </div>`;
        }
        else if (isPast(date) && !done) {
            // 2. If overdue
            todoList.innerHTML += `<div class="todo overdue">
            <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
            <div class="title-desc">
                <div class="title">
                    <div>${title}</div>
                    <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
                    <div class="priority high">! Overdue</div>
                </div>
                <div class="desc">${desc}</div>
            </div>
            <div class="date-time">
                <div class="date">${formatDistance(date, today, {addSuffix: true})}</div>
                <div class="time"></div>
            </div>
            <div class="edit">
                Edit
            </div>
        </div>`;
        }
        else {
            // 3. Else, if due at any other time
            todoList.innerHTML += `<div class="todo">
            <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
            <div class="title-desc">
                <div class="title">
                    <div>${title}</div>
                    <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
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

    function clearTodos() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = "";
    }

    function resetActive() {
        const projectDivs = document.querySelectorAll('.project');
        projectDivs.forEach(project => {
            project.classList.remove("active");
        })
    }

    // Each project click event listeners and display selected content  
    function displaySelectedProjectContent() {
        const projectDivs = document.querySelectorAll('.project');
        const projectName = document.querySelector('.main-head');
        projectDivs.forEach((project) => {
            if (project.textContent == 'All') {
                project.addEventListener('click', (e) => {
                    resetActive();
                    e.target.classList.add("active");

                    projectName.textContent = "All Todos";
                    clearTodos();
                    Storage.getProjectList().updateAll();
                    displayTodos('All');
                })
            }
            else if (project.textContent == 'Today') {
                project.addEventListener('click', (e) => {
                    resetActive();
                    e.target.classList.add("active");

                    projectName.textContent = "Today";
                    clearTodos();
                    Storage.getProjectList().updateToday();
                    displayTodos('Today');
                })
            } 
            else if (project.textContent == 'This Week') {
                project.addEventListener('click', (e) => {
                    resetActive();
                    e.target.classList.add("active");
                    
                    projectName.textContent = "This Week";
                    clearTodos();
                    Storage.getProjectList().updateThisWeek();
                    displayTodos('This Week');
                })
            } 
            else if (project.textContent == 'Done') {
                project.addEventListener('click', (e) => {
                    resetActive();
                    e.target.classList.add("active");
                    
                    projectName.textContent = "Done";
                    clearTodos();
                    Storage.getProjectList().updateDone();
                    displayTodos('Done');
                })
            } 
            else {
                project.addEventListener('click', (e) => {
                    resetActive();
                    e.target.classList.add("active");
                    projectName.textContent = e.target.textContent.slice(2);
                    clearTodos();
                    displayTodos(e.target.textContent.slice(2));
                })
            }
        })
    }

        
    return {
        initDisplay,

        displayProjects,
        createProject,


        displayTodos,
        createTodo,

        clearTodos,
        resetActive,
        displaySelectedProjectContent,
    }
})();

export default UI;