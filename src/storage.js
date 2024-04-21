import Todo from './todo.js';
import Project from './project.js';
import ProjectList from './projectList.js';

// Storage module 
// (add/edit/delete task and projects - need to save/extract List object in local storage for each change - create storage module)

const Storage = (() => {
    // Save, extract project list from local storage
    function saveProjectList(currentList) {
        // Update All, Today, This Week, Done
        currentList.updateAll();
        currentList.updateToday();
        currentList.updateThisWeek();
        currentList.updateDone();

        // Sort all projects todos by ascending date
        currentList.projects.forEach((project) => project.sortTodos());
        
        console.log("saving", currentList);
        localStorage.setItem('data', JSON.stringify(currentList));
    }

    // When extracting projectList data from local Storage, need to dynamically re-allocate Projects and Todo objects
    function getProjectList() {

        let projectList = Object.assign(new ProjectList, JSON.parse(localStorage.getItem('data')));

        let projectsBuffer = [];
        projectList.getProjects().forEach((project) => {
            projectsBuffer.push(Object.assign(new Project, project));
        });
        projectList.setProjects(projectsBuffer);

        projectList.getProjects().forEach((project) => {
            let tasksBuffer = [];
            project.getTodos().forEach((todo) => {
                tasksBuffer.push(Object.assign(new Todo, todo));
            })
            project.setTodos(tasksBuffer);
        })
        
        console.log("current projectList", projectList);
        return projectList;
    }


    // Add/edit/delete projects
    function addProject(newProject) {
        let projectList = getProjectList();
        
        projectList.addProject(newProject);

        saveProjectList(projectList);
    }

    function deleteProject(name) {
        let projectList = getProjectList();
        
        projectList.deleteProject(name);

        saveProjectList(projectList);
    }

    function renameProject(name, newName) {
        let projectList = getProjectList();
        
        projectList.renameProject(name, newName);

        saveProjectList(projectList);
    }

    // Add/edit/delete/finish todos within projects
    function addTodo(projectName, newTodo) {
        let projectList = getProjectList();    
        
        projectList.getProject(projectName).addTodo(newTodo);

        saveProjectList(projectList);
    }

    function deleteTodo(projectName, todoName) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).deleteTodo(todoName);

        saveProjectList(projectList);
    }

    function renameTodo(projectName, todoTitle, newTitle) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setTitle(newTitle);

        saveProjectList(projectList);
    }

    function changeDescTodo(projectName, todoTitle, newDesc) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setDesc(newDesc);

        saveProjectList(projectList);
    }

    function changeDateTodo(projectName, todoTitle, newDate) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setDate(newDate);

        saveProjectList(projectList);
    }

    function changePriorityTodo(projectName, todoTitle, newPriority) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setPriority(newPriority);

        saveProjectList(projectList);
    }

    function changeDoneTodo(projectName, todoTitle, isDone) {
        let projectList = getProjectList();
        
        projectList.getProject(projectName).getTodo(todoTitle).setDone(isDone);

        saveProjectList(projectList);
    }






    return {
        saveProjectList,
        getProjectList,

        addProject,
        deleteProject,
        renameProject,

        addTodo,
        deleteTodo,
        renameTodo,
        changeDescTodo,
        changeDateTodo,
        changePriorityTodo,
        changeDoneTodo
    }
})();

export default Storage;