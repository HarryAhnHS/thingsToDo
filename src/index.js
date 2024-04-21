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

let newTodo = new Todo("Maru","Maru is a dog",new Date(2024,3,16),'High');

Storage.addTodo('Dog', newTodo);

console.log("Deleting cat");
Storage.deleteProject('Cat');

Storage.renameProject('Dog', 'Maru');

Storage.renameTodo('Maru','Maru','Feed Maru');

Storage.addProject(new Project('Meow'));

Storage.addTodo('Meow', new Todo("Clean Catnip","", new Date(2024,3,21),'Low'))

Storage.changeDoneTodo('Meow','Clean Catnip',true);



