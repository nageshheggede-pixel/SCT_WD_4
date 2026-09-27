const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";
let editingTaskId = null;


/* Save Tasks */

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


/* Add or Edit Task */

function addTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        taskInput.focus();
        return;
    }

    if (editingTaskId !== null) {

        const task = tasks.find((item) => item.id === editingTaskId);

        if (task) {
            task.title = title;
            task.date = taskDate.value;
            task.time = taskTime.value;
        }

        editingTaskId = null;
        addTaskBtn.textContent = "+ Add Task";

    } else {

        const newTask = {
            id: Date.now(),
            title: title,
            date: taskDate.value,
            time: taskTime.value,
            completed: false
        };

        tasks.push(newTask);
    }

    saveTasks();

    clearInputs();
    renderTasks();
}


/* Clear Input Fields */

function clearInputs() {
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    taskInput.focus();
}


/* Display Tasks */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter((task) => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter((task) => task.completed);
    }

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";

        if (tasks.length === 0) {
            emptyState.querySelector("h2").textContent = "No tasks yet";
            emptyState.querySelector("p").textContent =
                "Add your first task and start organizing your day.";
        } else {
            emptyState.querySelector("h2").textContent = "Nothing here";
            emptyState.querySelector("p").textContent =
                "There are no tasks in this category.";
        }

    } else {
        emptyState.style.display = "none";
    }


    filteredTasks.forEach((task) => {

        const taskItem = document.createElement("article");

        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }


        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className = "task-check";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });


        const content = document.createElement("div");

        content.className = "task-content";


        const title = document.createElement("div");

        title.className = "task-title";
        title.textContent = task.title;


        const details = document.createElement("div");

        details.className = "task-details";


        if (task.date) {
            const dateElement = document.createElement("span");

            dateElement.textContent = `📅 ${formatDate(task.date)}`;

            details.appendChild(dateElement);
        }


        if (task.time) {
            const timeElement = document.createElement("span");

            timeElement.textContent = `⏰ ${task.time}`;

            details.appendChild(timeElement);
        }


        if (!task.date && !task.time) {
            const noDate = document.createElement("span");

            noDate.textContent = "No date or time set";

            details.appendChild(noDate);
        }


        content.appendChild(title);
        content.appendChild(details);


        const actions = document.createElement("div");

        actions.className = "task-actions";


        const editButton = document.createElement("button");

        editButton.className = "edit-btn";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editTask(task.id);
        });


        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });


        actions.appendChild(editButton);
        actions.appendChild(deleteButton);


        taskItem.appendChild(checkbox);
        taskItem.appendChild(content);
        taskItem.appendChild(actions);


        taskList.appendChild(taskItem);
    });


    updateTaskCount();
}


/* Format Date */

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}


/* Complete / Uncomplete Task */

function toggleTask(id) {

    const task = tasks.find((item) => item.id === id);

    if (task) {
        task.completed = !task.completed;
    }

    saveTasks();
    renderTasks();
}


/* Edit Task */

function editTask(id) {

    const task = tasks.find((item) => item.id === id);

    if (!task) {
        return;
    }

    taskInput.value = task.title;
    taskDate.value = task.date;
    taskTime.value = task.time;

    editingTaskId = id;

    addTaskBtn.textContent = "Update Task";

    taskInput.focus();
}


/* Delete Task */

function deleteTask(id) {

    const shouldDelete = confirm("Are you sure you want to delete this task?");

    if (!shouldDelete) {
        return;
    }

    tasks = tasks.filter((task) => task.id !== id);

    saveTasks();
    renderTasks();
}


/* Clear Completed Tasks */

function clearCompletedTasks() {

    tasks = tasks.filter((task) => !task.completed);

    saveTasks();
    renderTasks();
}


/* Update Task Counter */

function updateTaskCount() {

    const activeTasks = tasks.filter((task) => !task.completed);

    taskCount.textContent = activeTasks.length;
}


/* Filter Tasks */

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


/* Button Events */

addTaskBtn.addEventListener("click", addTask);

clearCompletedBtn.addEventListener("click", clearCompletedTasks);


/* Press Enter to Add Task */

taskInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        addTask();
    }
});


/* Initial Display */

renderTasks();