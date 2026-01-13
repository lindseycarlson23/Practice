// Task Manager JavaScript

// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// Dark mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
let darkMode = localStorage.getItem('darkMode') === 'true';

function applyDarkMode() {
    document.body.classList.toggle('dark-mode', darkMode);
    darkModeToggle.textContent = darkMode ? '☀️' : '🌙';
}

applyDarkMode();

darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
});

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, originalIndex) => {
        if (currentFilter === 'all' ||
            (currentFilter === 'completed' && task.completed) ||
            (currentFilter === 'pending' && !task.completed)) {
            const li = document.createElement('li');
            li.innerHTML = `
                <label class="task-item">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${originalIndex}">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </label>
                <button class="delete-btn" data-index="${originalIndex}">Delete</button>
            `;
            taskList.appendChild(li);
        }
    });
}

// Add task
function addTask(text) {
    tasks.push({ text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
    }
});

darkModeToggle.addEventListener('click', () => {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    applyDarkMode();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

taskList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
        const index = deleteBtn.dataset.index;
        deleteTask(index);
        return;
    }

    const checkbox = e.target.closest('input[type="checkbox"]');
    if (checkbox) {
        const index = checkbox.dataset.index;
        toggleTask(index);
    }
});

// Initial render
renderTasks();