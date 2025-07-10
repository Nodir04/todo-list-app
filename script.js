<script>
        class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadTodos();
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const todoForm = document.getElementById('todoForm');
        const todoList = document.getElementById('todoList');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Use form submit for better accessibility
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddTask();
        });

        // Event delegation for delete buttons
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const taskId = parseInt(e.target.dataset.taskId);
                this.deleteTask(taskId);
            }
        });

        // Event delegation for checkboxes
        todoList.addEventListener('change', (e) => {
            if (e.target.classList.contains('todo-checkbox')) {
                const taskId = parseInt(e.target.dataset.taskId);
                this.toggleTask(taskId);
            }
        });

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });
    }

    getTaskInput() {
        return document.getElementById('todoInput');
    }

    getInputValue() {
        return this.getTaskInput().value.trim();
    }

    validateTask(taskText) {
        if (!taskText) {
            this.showError('Please enter a task');
            return false;
        }
        
        if (taskText.length > 100) {
            this.showError('Task is too long (max 100 characters)');
            return false;
        }
        
        return true;
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 3000);
    }

    clearInput() {
        const input = this.getTaskInput();
        input.value = '';
        input.focus();
    }

    handleAddTask() {
        const taskText = this.getInputValue();
        
        if (!this.validateTask(taskText)) {
            return;
        }

        this.addTask(taskText);
        this.clearInput();
    }

    addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(task);
        this.saveTodos();
        this.render();
    }

    toggleTask(id) {
        const task = this.todos.find(t => t.id === id);
        if (!task) return;

        task.completed = !task.completed;
        this.saveTodos();
        this.render();
    }

    deleteTask(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.updateFilterButtons();
        this.render();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `todo-item ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('role', 'listitem');
        
        taskElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" 
                   ${task.completed ? 'checked' : ''} 
                   data-task-id="${task.id}"
                   aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
            <span class="todo-text">${this.escapeHtml(task.text)}</span>
            <button class="delete-btn" 
                    data-task-id="${task.id}"
                    aria-label="Delete task: ${this.escapeHtml(task.text)}">
                Delete
            </button>
        `;
        
        return taskElement;
    }

    renderEmptyState() {
        return `
            <div class="empty-state">
                <h3>${this.getEmptyMessage()}</h3>
                <p>${this.getEmptySubMessage()}</p>
            </div>
        `;
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = this.renderEmptyState();
        } else {
            todoList.innerHTML = '';
            filteredTodos.forEach(task => {
                todoList.appendChild(this.renderTask(task));
            });
        }

        this.updateStats();
    }

    getEmptyMessage() {
        const messages = {
            'active': 'No active tasks',
            'completed': 'No completed tasks',
            'all': 'No tasks yet'
        };
        return messages[this.currentFilter] || messages['all'];
    }

    getEmptySubMessage() {
        const messages = {
            'active': 'All tasks are completed! 🎉',
            'completed': 'Complete some tasks to see them here',
            'all': 'Add your first task above to get started!'
        };
        return messages[this.currentFilter] || messages['all'];
    }

    updateStats() {
        const totalTasks = this.todos.length;
        const completedTasks = this.todos.filter(t => t.completed).length;

        document.getElementById('totalTasks').textContent = 
            `${totalTasks} task${totalTasks !== 1 ? 's' : ''}`;
        document.getElementById('completedTasks').textContent = 
            `${completedTasks} completed`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        try {
            // For local development, uncomment the line below and comment the in-memory storage
            // localStorage.setItem('todos', JSON.stringify(this.todos));
            
            // Using in-memory storage for Claude.ai compatibility
            this.savedTodos = JSON.stringify(this.todos);
        } catch (e) {
            console.warn('Could not save todos:', e);
        }
    }

    loadTodos() {
        try {
            // For local development, uncomment the lines below and comment the in-memory storage
            // const saved = localStorage.getItem('todos');
            // if (saved) {
            //     this.todos = JSON.parse(saved);
            // }
            
            // Using in-memory storage for Claude.ai compatibility
            if (this.savedTodos) {
                this.todos = JSON.parse(this.savedTodos);
            }
        } catch (e) {
            console.warn('Could not load todos:', e);
            this.todos = [];
        }
    }
}

// Initialize the app
const app = new TodoApp();
    </script>
