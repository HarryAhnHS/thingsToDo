import './style/style.css';
import Git from './images/github.png';

import Storage from './storage';

import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';
import UI from './UI.js';
import { add } from 'date-fns';

document.querySelector("#github").src = Git;

function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    const projects = document.querySelectorAll(".project");
    const projectTitle = document.querySelector(".my-projects-title");
    const body = document.querySelector("body");

    const header = document.querySelector(".header");
    const main = document.querySelector(".main");
    // Closing
    if (sidebar.classList.contains('opened')) {
        body.style['grid-template-columns'] = "50px auto";

        header.style['grid-area'] = "1/1/2/3";
        main.style['grid-area'] = "2/1/3/3";
        
        sidebar.style['width'] = "50px";
        sidebar.style['background-color'] = 'transparent';


        projects.forEach(project => {
            project.classList.add('hidden');
        })
        projectTitle.classList.add('hidden');

        sidebar.classList.remove('opened');
    }
    // Opening
    else {
        body.style['grid-template-columns'] = "1fr 4fr";

        header.style['grid-area'] = "1/2/2/3";
        main.style['grid-area'] = "2/2/3/3";

        sidebar.style['width'] = "100%";
        sidebar.style['background-color'] = '#e9ecef';

        projects.forEach(project => {
            project.classList.remove('hidden');
        })
        projectTitle.classList.remove('hidden');

        sidebar.classList.add('opened');
    }
}

document.querySelector(".open-close").onclick = toggleSidebar;

// Storage.addProject(new Project('Dog'));
// Storage.addProject(new Project('Cat'));

// let newTodo = new Todo("Maru","Maru is a dog",new Date(2024,3,16),'High');

// Storage.addTodo('Dog', newTodo);

// console.log("Deleting cat");
// Storage.deleteProject('Cat');

// Storage.renameProject('Dog', 'Maru');

// Storage.renameTodo('Maru','Maru','Feed Maru');

// Storage.addProject(new Project('Meow', 'Red'));

// Storage.addTodo('Meow', new Todo("Clean Catnip","", new Date(2024,3,21),'Low'))

// Storage.changeDoneTodo('Meow','Clean Catnip',true);

// Storage.addTodo('Meow', new Todo("Buy Tuna","Need Fish", new Date(2024,1,21),'Low'))

// Storage.addTodo('Maru', new Todo("Buy Cheese","His favorite treat", new Date(2024,3,19),'Low'))

// Storage.addTodo('Maru', new Todo("Clean Poo","", new Date(2024,3,19,13,30),'Low'))
// Storage.addTodo('Maru', new Todo("Clean Piss","", new Date(2024,3,19,11,30),'Low'))

// Storage.changeDateTodo('Meow','Buy Tuna', new Date(2024,4,8,12,30))
// Storage.changeDateTodo('Maru','Buy Cheese', new Date(2024,4,13,23,30))

// localStorage.clear();
UI.resetDisplay();
UI.newProject();

