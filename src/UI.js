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

    function refreshCurrentProjects() {
        displayProjects();
        displaySelectedProjectContent();
        newTodo();
    }

    function refreshCurrentTodos() {
        const projects = document.querySelectorAll(".project");
        projects.forEach((project) => {
            if (project.classList.contains("active")) {
                clearTodos();
                displayTodos(project.textContent.slice(2).toUpperCase());
            }
        })
    }

    function refreshTodosFor(projectName) {
        clearTodos();
        displayTodos(projectName);
    }

    function initDisplay() {        
        const projectDivs = document.querySelectorAll('.project');
        const projectName = document.querySelector('.main-head');

        projectDivs.forEach((project) => {
            if (project.textContent == 'ALL') {
                resetActive();
                project.classList.add("active");
                projectName.textContent = "All";
                clearTodos();
                Storage.getProjectList().updateAll();
                displayTodos('ALL');
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
            if (project.name != 'ALL' && project.name != 'TODAY' && project.name != 'THIS WEEK' && project.name != 'DONE') {
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
        project.classList.add('new');

        const sharp = document.createElement('span');
        sharp.innerHTML = `#&nbsp;`;
        sharp.style['pointer-events'] = 'none';

        const projectName = document.createElement('div');
        projectName.textContent = `${name}`;
        projectName.style['pointer-events'] = 'none';

        sharp.style['color'] = `#${Storage.getProjectList().getProject(name).getColor()}`;

        project.appendChild(sharp);
        project.appendChild(projectName);

        myProjectList.appendChild(project);
    }

    function displayTodos(projectName) {
        if (Storage.getProjectList().getProject(projectName).getTodos().length == 0) {
            // Edge-case - if no todos
            if (projectName == "DONE") {
                // No done todos
                const todoList = document.querySelector('.todo-list');

                const emptySaver = document.createElement("div");
                emptySaver.classList.add("empty-saver");

                const emoji = document.createElement("div");
                emoji.classList.add("emoji");
                emoji.textContent = "🦥";

                const text = document.createElement("div");
                text.classList.add("empty-text");
                text.textContent = "Nothing Done!"
                
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
                text.textContent = "No Todos!"
                
                emptySaver.appendChild(emoji);
                emptySaver.appendChild(text);  
                
                todoList.appendChild(emptySaver);
            }
        }
        else {
            Storage.getProjectList().getProject(projectName).getTodos().forEach((todo) => {
                createTodo(todo.title, todo.priority, todo.desc, todo.date, todo.done, todo.project);
            });
        }

    }

    function createTodo(title, priority, desc, date, done, project) {
    
        const todo = document.createElement('div');
        todo.classList.add('todo');

            const check = document.createElement('input');
            check.setAttribute('type','checkbox');
            check.setAttribute('class','checkbox');
            // check.setAttribute('id','0_0'); // TODO
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
                    priorityText.textContent = `${priority.charAt(0).toUpperCase()+ priority.slice(1)} Priority`;
                    
                    // Add project name as tag
                    const projectName = document.createElement('div');
                    projectName.classList.add("priority");
                    projectName.style['color'] = `#${Storage.getProjectList().getProject(project).getColor()}`;
                    projectName.style['outline'] = `1px solid #${Storage.getProjectList().getProject(project).getColor()}`;
                    projectName.textContent = `#${project}`;

                title_tags.appendChild(titleText);

                title_tags.appendChild(projectName);
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

                const edit_svg = document.createElement('div');
                edit_svg.classList.add('edit-svg');
                edit_svg.innerHTML = `<svg opacity="0.8" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>`
                // Edit delete task configuration
                edit_svg.onclick = (e) => {
                    console.log(e.target, title, project)
                    editTodo(title, project);
                }

                const delete_svg = document.createElement('div');
                delete_svg.classList.add('delete-svg');
                delete_svg.innerHTML = `<svg opacity="0.8" width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg>`;
                // Edit delete task configuration
                // delete_svg.onclick = deleteTodo(title, project);
            
                edit_delete.appendChild(edit_svg);
                edit_delete.appendChild(delete_svg);

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
        const head = document.querySelector('.main-head');
        
        projectDivs.forEach((project) => {
            if (project.textContent == 'ALL') {
                project.addEventListener('click', (e) => {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "All";
                    head.style.color = 'black'; 

                    clearTodos();
                    Storage.getProjectList().updateAll();
                    displayTodos('ALL');
                })
            }
            else if (project.textContent == 'TODAY') {
                project.addEventListener('click', (e) => {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    head.textContent = "Today";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateToday();
                    displayTodos('TODAY');
                })
            } 
            else if (project.textContent == 'THIS WEEK') {
                project.addEventListener('click', (e) => {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");
                    
                    head.textContent = "This Week";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateThisWeek();
                    displayTodos('THIS WEEK');
                })
            } 
            else if (project.textContent == 'DONE') {
                project.addEventListener('click', (e) => {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");
                    
                    head.textContent = "Done";
                    head.style.color = 'black';

                    clearTodos();
                    Storage.getProjectList().updateDone();
                    displayTodos('DONE');
                })
            } 
            else {
                project.addEventListener('click', (e) => {
                    head.innerHTML = ""; // Reset head
                    resetActive();
                    e.target.classList.add("active");

                    const intro = document.createElement('div');
                    intro.innerHTML = "Project&nbsp";
                    intro.style['font-style'] = "italic";
                    intro.style['font-weight'] = "100";

                    const sharp = document.createElement('span');
                    sharp.innerHTML = "#&nbsp";

                    const title = document.createElement('div');
                    title.classList.add("head-title");

                    sharp.style.color = `#${Storage.getProjectList().getProject(e.currentTarget.textContent.slice(2)).getColor()}`;
                    title.style.color = `#${Storage.getProjectList().getProject(e.currentTarget.textContent.slice(2)).getColor()}`;
                    
                    title.textContent = e.target.textContent.slice(2).toUpperCase();

                    const button = document.createElement('button');
                    button.id = "new-todo";
                    button.textContent = `+ Add Todo`

                    head.appendChild(intro);
                    head.appendChild(sharp);
                    head.appendChild(title);
                    head.appendChild(button);

                    clearTodos();
                    displayTodos(e.target.textContent.slice(2).toUpperCase());
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

            // Unselected color
            colors.forEach((color) => {
                color.classList.remove('selected');
                color.style['outline'] = `1px solid rgba(51, 51, 51, 0.2)`;
            })

            // Select default color to first choice
            document.getElementById('f94144').classList.add('selected');
            document.getElementById('f94144').style['outline'] = '2px solid #f94144';
            

            // Color choose
            colors.forEach((color) => {
                color.addEventListener('click', (e) => {
                    colors.forEach((color)=> {
                        color.classList.remove('selected');
                        color.style['outline'] = `1px solid rgba(51, 51, 51, 0.2)`;
                    })
                    color.classList.add('selected');
                    color.style['outline'] = `2px solid #${color.id}`;
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
                            Storage.addProject(new Project(name.value.toUpperCase(), color.id));
                        }
                    })

                    // Refresh projects and todos
                    refreshCurrentProjects();

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
    function newTodo() {
        const myProjects = document.querySelectorAll(".project.new");
        const dialog = document.querySelector(".new-todo-dialog");
        const form = document.querySelector(".new-todo-dialog-container");

        var projectName;
        var newTodoBtn;

        myProjects.forEach((project) => {
            project.addEventListener('click', (e) => {

                projectName = e.target.textContent.slice(2).toUpperCase();
                newTodoBtn = document.querySelector("#new-todo"); 

                // NEW TODO BUTTON IS ADDING EVENT LISTENER FOR EACH CLICK IN PROJECT, NEED TO DELETE WHEN NEW PROJECT CLICKED
                newTodoBtn.addEventListener("click", function newTodoPopup(e) {
                    e.preventDefault();
                    form.reset();

                    console.log("Add Click Running for "+ projectName);
        
                    const priorities = document.querySelectorAll(".priority-radio");
                    
                    // Priority reset to low
                    priorities.forEach((priority) => {
                        priority.classList.remove('selected');
                    });
                    document.querySelector("#low").classList.add('selected');
        
                    // Project - name
                    const intro = document.querySelector('.intro');
                    intro.style['font-weight'] = "300";
                    intro.style['font-style'] = "italic";
        
                    const sharp = document.querySelector('.sharp-name');
                    sharp.innerHTML = `#&nbsp${projectName}`;
                    sharp.style.color = `#${Storage.getProjectList().getProject(projectName).getColor()}`;
                    sharp.style['font-weight'] = "600";
        
                    // Set due date and time to current
                    const dateinput = document.querySelector("#todo-date");
                    const timeinput = document.querySelector("#todo-time");
        
                    let today = new Date();
                    let todayLater = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()+1);
        
                    dateinput.value = format(today, "yyyy-MM-dd");
                    timeinput.value = format(todayLater, "HH:mm");
        
                    // Priority choose
                    priorities.forEach((priority) => {
                        priority.addEventListener('click', (e) => {
                            priorities.forEach((priority)=> {
                                priority.classList.remove('selected');
                            })
                            priority.classList.add('selected');
                        })
                    });
        
                    dialog.showModal();
        
                    const titleinput = document.querySelector("#todo-title");
                    const descinput = document.querySelector("#todo-desc");
        
                    const add = document.querySelector("#new-todo-submit");
                    add.textContent = "Add";
                    const cancel = document.querySelector("#new-todo-cancel");
        
                    add.addEventListener('click', function adding(e) {
                        console.log("Clicked add");
                        e.preventDefault();
                        if (titleinput.value != "" && !Storage.getProjectList().getProject(projectName).todoExists(titleinput.value)) {
                            // If unique title - able to add
        
                            // convert date, time inputs into Date object
                            let dateString =  `${dateinput.value}T${timeinput.value}`;
                                        
                            // Find current selected priority
                            let priorityinput = "low";
                            priorities.forEach((priority) => {
                                if (priority.classList.contains('selected')) {
                                    priorityinput = priority.id;
                                }
                            })
        
                            // Add to storage
                            Storage.addTodo(projectName, new Todo(titleinput.value, descinput.value, new Date(dateString), priorityinput, projectName));
                            dialog.close();

                            add.removeEventListener('click',adding);
        
                            // refresh current page's todos
                            refreshCurrentTodos();
                        }
                        else {
                            console.log("Invalid name");
                        }
                    });
        
                    cancel.addEventListener('click', function cancelling(e) {
                        e.preventDefault();
                        dialog.close();

                        cancel.removeEventListener('click',cancelling);
                    });


                    // If new project clicked, then need to delete original new todo button event listener  
                    // Ready for new iteration of click 
                    myProjects.forEach((project) => {
                        project.addEventListener('click', function deleteEvent(e) {
                            newTodoBtn.removeEventListener('click', newTodoPopup);
                            // Then clicking delete event listeners
                            myProjects.forEach((project) => project.removeEventListener('click',deleteEvent));
                        });
                    });
                });   
            });
        })
    }


    // Edit task - popup
    function editTodo(todoTitle, todoProject) {
        console.log("edit tab opened", todoTitle, todoProject);
        const dialog = document.querySelector(".new-todo-dialog");
        const form = document.querySelector(".new-todo-dialog-container");

        form.reset();

        const priorities = document.querySelectorAll(".priority-radio");
        
        // Priority automatically set to its pre-set state
        priorities.forEach((priority) => {
            priority.classList.remove('selected');
        });
        document.getElementById(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getPriority()).classList.add('selected');

        // Project - name
        const intro = document.querySelector('.intro');
        intro.style['font-weight'] = "300";
        intro.style['font-style'] = "italic";

        const sharp = document.querySelector('.sharp-name');
        sharp.innerHTML = `#&nbsp${todoProject}`;
        sharp.style.color = `#${Storage.getProjectList().getProject(todoProject).getColor()}`;
        sharp.style['font-weight'] = "600";

        // Set title to current
        const titleinput = document.querySelector("#todo-title");
        titleinput.value = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getTitle();

        // Set desc to current
        const descinput = document.querySelector("#todo-desc");
        descinput.value = Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDesc();

        // Set due date and time to current
        const dateinput = document.querySelector("#todo-date");
        const timeinput = document.querySelector("#todo-time");

        dateinput.value = format(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDate(), "yyyy-MM-dd");
        timeinput.value = format(Storage.getProjectList().getProject(todoProject).getTodo(todoTitle).getDate(), "HH:mm");

        dialog.showModal();

        // Priority choose
        priorities.forEach((priority) => {
            priority.addEventListener('click', (e) => {
                priorities.forEach((priority)=> {
                    priority.classList.remove('selected');
                })
                priority.classList.add('selected');
            })
        });

        // Edit submit/cancel
        const edit = document.querySelector("#new-todo-submit");
        edit.textContent = "Edit";

        const cancel = document.querySelector("#new-todo-cancel");

        edit.addEventListener('click', function editing(e) {
            e.preventDefault();
            if (titleinput.value != "") {
                // If unique edited title - able to add
                // convert date, time inputs into Date object
                let dateString =  `${dateinput.value}T${timeinput.value}`;
                            
                // Find current selected priority
                let priorityinput;
                priorities.forEach((priority) => {
                    if (priority.classList.contains('selected')) {
                        priorityinput = priority.id;
                    }
                })

                // Edit storage - change name last (as name functions as index)
                Storage.changeDescTodo(todoProject, todoTitle, descinput.value);
                Storage.changeDateTodo(todoProject, todoTitle, new Date(dateString));
                Storage.changePriorityTodo(todoProject, todoTitle, priorityinput);

                Storage.renameTodo(todoProject, todoTitle, titleinput.value); 

                dialog.close();
                edit.removeEventListener('click', editing);
                // refresh current page's todos
                refreshTodosFor(todoProject);
            }
            else {
                console.log("Invalid name / Already exists");
            }
        });

        cancel.addEventListener('click', function cancelling(e) {
            e.preventDefault();
            dialog.close();

            cancel.removeEventListener('click', cancelling);
        });
    };

    // Toggle task as done - visual check + move to "Done" project
    function toggleDone() {
        
    }


        
    return {
        refreshCurrentProjects,
        refreshCurrentTodos,
        refreshTodosFor,
        initDisplay,

        displayProjects,
        createProject,


        displayTodos,
        createTodo,

        clearTodos,
        resetActive,
        displaySelectedProjectContent,

        newProject,
        newTodo,
        editTodo
    }
})();

export default UI;