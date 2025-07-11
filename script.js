// Todo List Application JavaScript

class TodoApp {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        const todoForm = document.getElementById('todoForm');
        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const todoList = document.getElementById('todoList');

        // Form submission
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFilter(btn.dataset.filter);
                this.updateFilterButtons(btn);
            });
        });

        // Todo list delegation for checkboxes and delete buttons
        todoList.addEventListener('click', (e) => {
            if (e.target.matches('.todo-checkbox')) {
                const todoId = parseInt(e.target.dataset.id);
                this.toggleTodo(todoId);
            } else if (e.target.matches('.delete-btn')) {
                const todoId = parseInt(e.target.dataset.id);
                this.deleteTodo(todoId);
            }
        });

        // Input validation
        todoInput.addEventListener('input', () => {
            this.hideError();
        });
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();

        if (!text) {
            this.showError('Please enter a task');
            return;
        }

        if (text.length > 100) {
            this.showError('Task must be 100 characters or less');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date()
        };

        this.todos.push(todo);
        todoInput.value = '';
        this.render();
        this.hideError();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        this.render();
    }

    updateFilterButtons(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = this.getEmptyStateHTML();
        } else {
            todoList.innerHTML = filteredTodos.map(todo => this.getTodoHTML(todo)).join('');
        }

        this.updateStats();
    }

    getTodoHTML(todo) {
        return `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" role="listitem">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    data-id="${todo.id}"
                    ${todo.completed ? 'checked' : ''}
                    aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button 
                    class="delete-btn" 
                    data-id="${todo.id}"
                    aria-label="Delete task"
                >
                    Delete
                </button>
            </div>
        `;
    }

    getEmptyStateHTML() {
        const messages = {
            all: {
                title: 'No tasks yet',
                subtitle: 'Add your first task above to get started!'
            },
            active: {
                title: 'No active tasks',
                subtitle: 'All tasks are completed! 🎉'
            },
            completed: {
                title: 'No completed tasks',
                subtitle: 'Complete some tasks to see them here.'
            }
        };

        const message = messages[this.currentFilter] || messages.all;

        return `
            <div class="empty-state">
                <h3>${message.title}</h3>
                <p>${message.subtitle}</p>
            </div>
        `;
    }

    updateStats() {
        const totalTasks = document.getElementById('totalTasks');
        const completedTasks = document.getElementById('completedTasks');
        
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;

        totalTasks.textContent = `${total} task${total !== 1 ? 's' : ''}`;
        completedTasks.textContent = `${completed} completed`;
    }

    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            this.hideError();
        }, 3000);
    }

    hideError() {
        const errorElement = document.getElementById('errorMessage');
        errorElement.classList.remove('show');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input when pressing 'n' or '/'
    if ((e.key === 'n' || e.key === '/') && !e.target.matches('input, textarea')) {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
    
    // Clear completed tasks with Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        const app = window.todoApp;
        if (app) {
            app.todos = app.todos.filter(todo => !todo.completed);
            app.render();
        }
    }
});
