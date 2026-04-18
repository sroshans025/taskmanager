const API_URL = '/api';

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const logoutBtn = document.getElementById('logout-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let token = localStorage.getItem('token');
let currentFilter = 'all';

// Initialization
function init() {
    if (token) {
        showDashboard();
        fetchTasks();
    } else {
        showAuth();
    }
}

// UI Toggles
function showAuth() {
    authSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
}

function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
        loginForm.classList.add('active');
    } else {
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
        registerForm.classList.add('active');
    }
}

// API Calls
async function apiCall(endpoint, method = 'GET', body = null, isAuthForm = false) {
    const headers = {};
    if (!isAuthForm && token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let options = { method, headers };

    if (body) {
        if (isAuthForm && method === 'POST' && endpoint === '/auth/login') {
            options.body = new URLSearchParams(body);
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            options.body = JSON.stringify(body);
            headers['Content-Type'] = 'application/json';
        }
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (response.status === 401 && !isAuthForm) {
            handleLogout();
            throw new Error('Unauthorized');
        }
        
        const data = response.status === 204 ? null : await response.json();
        
        if (!response.ok) {
            throw new Error(data?.detail || 'An error occurred');
        }
        return data;
    } catch (error) {
        throw error;
    }
}

// Auth Logic
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');

    try {
        const data = await apiCall('/auth/login', 'POST', { username, password }, true);
        token = data.access_token;
        localStorage.setItem('token', token);
        errorDiv.textContent = '';
        loginForm.reset();
        showDashboard();
        fetchTasks();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const errorDiv = document.getElementById('reg-error');

    try {
        await apiCall('/auth/register', 'POST', { username, email, password });
        errorDiv.textContent = '';
        registerForm.reset();
        switchTab('login');
        // Pre-fill login
        document.getElementById('login-username').value = username;
        document.getElementById('login-password').focus();
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});

function handleLogout() {
    token = null;
    localStorage.removeItem('token');
    showAuth();
}

logoutBtn.addEventListener('click', handleLogout);

// Task Logic
async function fetchTasks() {
    try {
        let endpoint = '/tasks/';
        if (currentFilter === 'active') endpoint += '?completed=false';
        if (currentFilter === 'completed') endpoint += '?completed=true';
        
        const tasks = await apiCall(endpoint);
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = `<li class="task-item" style="justify-content: center; color: var(--text-secondary);">No tasks found.</li>`;
        return;
    }

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="task-content">
                <div class="task-title">${escapeHTML(task.title)}</div>
                ${task.description ? `<div class="task-desc">${escapeHTML(task.description)}</div>` : ''}
            </div>
            <div class="task-actions">
                <button class="icon-btn complete-btn" onclick="toggleTaskStatus(${task.id}, ${task.completed})" title="Toggle Status">
                    <span class="check-icon"></span>
                </button>
                <button class="icon-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete Task">
                    <span class="trash-icon"></span>
                </button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;

    try {
        await apiCall('/tasks/', 'POST', { title, description });
        taskForm.reset();
        fetchTasks();
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

window.toggleTaskStatus = async (id, currentStatus) => {
    try {
        await apiCall(`/tasks/${id}`, 'PUT', { completed: !currentStatus });
        fetchTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

window.deleteTask = async (id) => {
    if(!confirm("Are you sure you want to delete this task?")) return;
    try {
        await apiCall(`/tasks/${id}`, 'DELETE');
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

// Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        fetchTasks();
    });
});

// Utility
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Start
init();
