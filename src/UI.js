import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';
import Storage from './storage.js';

import { isPast, isWithinInterval, formatDistance, formatDistanceToNow, format, add } from 'date-fns';

// Display: For each project in list, create tab in sidebar and display it's todos in main content page

    // Function: For each todo in project -- edit, delete, mark as done. 

// Function: Add Task (Main Content) - Title, Priority, Date, Description, which project to add to

// Function: Click Task for details

// Function: Add Project (Sidebar)

const UI = (() => {

    function resetDisplay() {
        initDisplay();
        displayProjects();
        displaySelectedProjectContent();
    }

    function initDisplay() {        
        const projectDivs = document.querySelectorAll('.project');
        const projectName = document.querySelector('.main-head');

        projectDivs.forEach((project) => {
            if (project.textContent == 'All') {
                resetActive();
                project.classList.add("active");
                projectName.textContent = "All";
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
        // Clear Previous ProjectList
        const myProjectList = document.querySelector('.my-projects');
        myProjectList.innerHTML = "";

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

        const sharp = document.createElement('span');
        sharp.innerHTML = `#&nbsp;`;

        const projectName = document.createElement('div');
        projectName.textContent = `${name}`;

        sharp.style['color'] = `#${Storage.getProjectList().getProject(name).getColor()}`;

        project.appendChild(sharp);
        project.appendChild(projectName);

        myProjectList.appendChild(project);
    }

    function displayTodos(projectName) {
        if (Storage.getProjectList().getProject(projectName).getTodos().length === 0) {
            // Edge-case - if no todos
            if (projectName == "Done") {
                // No done todos
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🦥";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "Nothing done!"
                
                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);  
                
                todoList.appendChild(emptySaver);
            }
            else {
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🎊";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "Everything done!"
                
                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);  
                
                todoList.appendChild(emptySaver);
            }
        }
        else {
            Storage.getProjectList().getProject(projectName).getTodos().forEach((todo) => {
                createTodo(todo.title, todo.priority, todo.desc, todo.date, todo.done);
            });
        }

    }

    function createTodo(title, priority, desc, date, done) {
    
        const todo = document.createElement('div');
        todo.classList.add('todo');

            const check = document.createElement('input');
            check.setAttribute('type','checkbox');
            check.setAttribute('class','checkbox');
            check.setAttribute('id','0_0'); // TODO
            check.classList.add(`${priority.toLowerCase()}`);

            const title_desc = document.createElement('div');
            title_desc.classList.add('title-desc');
                const title_tags = document.createElement('div');
                title_tags.classList.add('title-tags');

                    const titleText = document.createElement('div');
                    titleText.textContent = title;
                    const priorityText = document.createElement('div');
                    priorityText.classList.add('priority');
                    priorityText.classList.add(priority.toLowerCase());
                    priorityText.textContent = `${priority} Priority`;

                title_tags.appendChild(titleText);
                title_tags.appendChild(priorityText);

                const descText = document.createElement('div');
                descText.classList.add('desc');
                descText.textContent = desc;

            title_desc.appendChild(title_tags);
            title_desc.appendChild(descText);

            const date_time = document.createElement('div');
            date_time.classList.add('date-time');

                const dateText = document.createElement('div');
                dateText.classList.add('date');

                const timeText = document.createElement('div');
                timeText.classList.add('time');
                
                const today = new Date();
                if (isWithinInterval(date, {
                    start: today,
                    end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)})) {
                    // 1. If task's date is due within a week
                        dateText.textContent = formatDistanceToNow(date,{addSuffix: true});
                        timeText.textContent = `@${format(date, "p")}`;
                }
                else if (isPast(date) && !done) {
                    // 2. If overdue
                    dateText.textContent = formatDistance(date, today, {addSuffix: true});
                    timeText.textContent = "";
                }
                else {
                    // 3. Else
                    dateText.textContent = format(date, "PPP");
                    timeText.textContent = `@${format(date, "p")}`;
                }

            date_time.appendChild(dateText);
            date_time.appendChild(timeText);

            const edit_delete = document.createElement('div');
            edit_delete.classList.add('edit-delete');
            edit_delete.innerHTML += 
            `<svg class = "edit-svg" opacity="0.8" width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
            <svg class = "delete-svg" opacity="0.8" width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;

        todo.appendChild(check);
        todo.appendChild(title_desc);
        todo.appendChild(date_time);
        todo.appendChild(edit_delete);

        // Check for conditions before appending todo into list
        if (isPast(date) && !done) {
            // IF OVERDUE
            todo.classList.add('overdue');

            const overdue = document.createElement('div');
            overdue.classList.add("priority");
            overdue.classList.add("high");
            overdue.textContent = "! Overdue";

            title_tags.appendChild(overdue);
        }

        // Append new div into todolist
        const todoList = document.querySelector('.todo-list');
        todoList.appendChild(todo);
    }


    // function createTodo(title, priority, desc, date, done) {
    //     const todoList = document.querySelector('.todo-list');
    //     const today = new Date();

    //     if (isWithinInterval(date, {
    //         start: today,
    //         end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
    //     })) {
    //         // 1. If task's date is due within a week
    //         todoList.innerHTML += `<div class="todo">
    //                 <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
    //                 <div class="title-desc">
    //                     <div class="title-tags">
    //                         <div>${title}</div>
    //                         <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
    //                     </div>
    //                     <div class="desc">${desc}</div>
    //                 </div>
    //                 <div class="date-time">
    //                     <div class="date">${formatDistanceToNow(date,{addSuffix: true})}</div>
    //                     <div class="time">@${format(date, "p")}</div>
    //                 </div>
    //                 <div class="edit-delete">
    //                     <svg class = "edit-svg" opacity="0.8" width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
    //                     <svg class = "delete-svg" opacity="0.8" width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>
    //                 </div>
    //             </div>`;
    //     }
    //     else if (isPast(date) && !done) {
    //         // 2. If overdue
    //         todoList.innerHTML += `<div class="todo overdue">
    //         <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
    //         <div class="title-desc">
    //             <div class="title">
    //                 <div>${title}</div>
    //                 <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
    //                 <div class="priority high">! Overdue</div>
    //             </div>
    //             <div class="desc">${desc}</div>
    //         </div>
    //         <div class="date-time">
    //             <div class="date">${formatDistance(date, today, {addSuffix: true})}</div>
    //             <div class="time"></div>
    //         </div>
    //         <div class="edit">
    //         <svg class = "edit-svg" width="20px" height="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
    //         </div>
    //     </div>`;
    //     }
    //     else {
    //         // 3. Else, if due at any other time
    //         todoList.innerHTML += `<div class="todo">
    //         <input type="checkbox" class="checkbox ${priority.toLowerCase()}" id="0_0">
    //         <div class="title-desc">
    //             <div class="title">
    //                 <div>${title}</div>
    //                 <div class="priority ${priority.toLowerCase()}">${priority} Priority</div>
    //             </div>
    //             <div class="desc">${desc}</div>
    //         </div>
    //         <div class="date-time">
    //             <div class="date">${format(date, "PPP")}</div>
    //             <div class="time">@${format(date, "p")}</div>
    //         </div>
    //         <div class="edit">
    //         <svg class = "edit-svg" width="20px" height="25px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>
    //         </div>
    //     </div>`;
    //     }
    // };

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
                    projectName.textContent = "# " + e.target.textContent.slice(2).toUpperCase();
                    projectName.style['color'] = `#${Storage.getProjectList().getProject(e.target.textContent.slice(2)).getColor()}`;

                    clearTodos();
                    displayTodos(e.target.textContent.slice(2));
                })
            }
        })
    }

    // Add project - popup
    function newProject() {
        const button = document.querySelector("#new-project");
        const myProjects = document.querySelector(".my-projects");
        const dialog = document.querySelector(".new-project-dialog");
        const colors = document.querySelectorAll(".color");

        const form = document.querySelector(".new-project-dialog-container");
        const name = document.querySelector("#project-name");

        const add = document.querySelector("#new-project-submit");
        const cancel = document.querySelector("#new-project-cancel");

        colors.forEach((color) => {
            const inner = document.createElement('div');
            inner.style['background-color'] = `#${color.id}`;
            inner.style['height'] = `30px`;
            inner.style['width'] = `30px`;
            inner.style['border-radius'] = '5px';

            color.appendChild(inner);
        });

        button.addEventListener("click", (e) => {
            form.reset();
            dialog.showModal();

            // Default color
            colors.forEach((color) => {
                color.classList.remove('selected');
            })
            document.getElementById('f94144').classList.add('selected');

            // Color choose
            colors.forEach((color) => {
                color.addEventListener('click', (e) => {
                    colors.forEach((color)=> {
                        color.classList.remove('selected');
                    })
                    color.classList.add('selected');
                })
            })

            add.addEventListener('click', (e) => {
                e.preventDefault();
                if (name.value != "" && !Storage.getProjectList().projectExists(name.value)) {
                    const project = document.createElement("div");
                    project.classList.add("project");
                    project.textContent = "# " + name.value;

                    myProjects.appendChild(project);

                    // Storage - add new project
                    colors.forEach((color) => {
                        if (color.classList.contains("selected")) {
                            Storage.addProject(new Project(name.value, color.id));
                        }
                    })

                    // Refresh projects and todos
                    resetDisplay();

                    dialog.close();
                }
                else {
                    console.log("Invalid name")
                }
            })

            cancel.addEventListener('click', (e) => {
                e.preventDefault();
                dialog.close();
            });
        });
    }

    // Add task - popup
    function newTask() {

    }


    // Edit task - popup
    function editProject() {

    }

    // Delete task 
    function addProject() {

    }

    // Toggle task as done - visual check + move to "Done" project
    function toggleDone() {
        
    }

    // If empty todo

        
    return {
        resetDisplay,
        initDisplay,

        displayProjects,
        createProject,


        displayTodos,
        createTodo,

        clearTodos,
        resetActive,
        displaySelectedProjectContent,

        newProject
    }
})();

export default UI;