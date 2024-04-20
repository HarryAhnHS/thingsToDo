import './style/style.css';
import Git from './images/github.png';

import Storage from './storage';

import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';

document.querySelector("#github").src = Git;

localStorage.clear();

Storage.addProject(new Project('Dog'));
Storage.addProject(new Project('Cat'));

let newTodo = new Todo("Maru","Maru is a dog",new Date(2024,4,16),'High');

Storage.addTodo('Dog', newTodo);



