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
                const todoInput = document.getElementById('todoInput');
                const addBtn = document.getElementById('addBtn');
                const filterBtns = document.querySelectorAll('.filter-btn');

                addBtn.addEventListener('click', () => this.addTodo());
                todoInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTodo();
                });

                filterBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.setFilter(e.target.dataset.filter);
                    });
                });
            }

            addTodo() {
                const input = document.getElementById('todoInput');
                const text = input.value.trim();

                if (text === '') {
                    input.focus();
                    return;
                }

                const todo = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                this.todos.unshift(todo);
                input.value = '';
                this.saveTodos();
                this.render();
            }

            toggleTodo(id) {
                const todo = this.todos.find(t => t.id === id);
                if (todo) {
                    todo.completed = !todo.completed;
                    this.saveTodos();
                    this.render();
                }
            }

            deleteTodo(id) {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
            }

            setFilter(filter) {
                this.currentFilter = filter;
                
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
                this.render();
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

            render() {
                const todoList = document.getElementById('todoList');
                const filteredTodos = this.getFilteredTodos();

                if (filteredTodos.length === 0) {
                    todoList.innerHTML = `
                        <div class="empty-state">
                            <h3>${this.getEmptyMessage()}</h3>
                            <p>${this.getEmptySubMessage()}</p>
                        </div>
                    `;
                } else {
                    todoList.innerHTML = filteredTodos.map(todo => `
                        <div class="todo-item ${todo.completed ? 'completed' : ''}">
                            <input type="checkbox" class="todo-checkbox" 
                                   ${todo.completed ? 'checked' : ''} 
                                   onchange="app.toggleTodo(${todo.id})">
                            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                            <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                        </div>
                    `).join('');
                }

                this.updateStats();
            }

            getEmptyMessage() {
                switch (this.currentFilter) {
                    case 'active':
                        return 'No active tasks';
                    case 'completed':
                        return 'No completed tasks';
                    default:
                        return 'No tasks yet';
                }
            }

            getEmptySubMessage() {
                switch (this.currentFilter) {
                    case 'active':
                        return 'All tasks are completed! 🎉';
                    case 'completed':
                        return 'Complete some tasks to see them here';
                    default:
                        return 'Add your first task above to get started!';
                }
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
                    // Using in-memory storage instead of localStorage for Claude.ai compatibility
                    this.savedTodos = JSON.stringify(this.todos);
                } catch (e) {
                    console.warn('Could not save todos');
                }
            }

            loadTodos() {
                try {
                    // Using in-memory storage instead of localStorage for Claude.ai compatibility
                    if (this.savedTodos) {
                        this.todos = JSON.parse(this.savedTodos);
                    }
                } catch (e) {
                    console.warn('Could not load todos');
                    this.todos = [];
                }
            }
        }

        // Initialize the app
        const app = new TodoApp();
    </script>