// Estructura de datos
let boards = JSON.parse(localStorage.getItem('proBoards')) || [
    {
        id: 'default-1',
        name: 'General',
        color: '#667eea',
        createdAt: new Date().toISOString(),
        tasks: {
            todo: [],
            doing: [],
            done: []
        }
    }
];

let currentBoardId = boards[0].id;
let draggedTask = null;
let editingTaskInfo = null;
let darkMode = localStorage.getItem('darkMode') === 'true';

// Tags globales para filtros
let allTags = new Set();

// Inicializar
function init() {
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeIcon').textContent = '☀️';
    }
    collectAllTags();
    renderBoardsTabs();
    renderCurrentBoard();
    renderTasks();
    updateBoardStats();
}

// Modo oscuro
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    document.getElementById('themeIcon').textContent = darkMode ? '☀️' : '🌙';
    localStorage.setItem('darkMode', darkMode);
}

// Guardar en localStorage
function saveToLocalStorage() {
    localStorage.setItem('proBoards', JSON.stringify(boards));
}

// Renderizar tabs de tableros
function renderBoardsTabs() {
    const tabsContainer = document.getElementById('boardsTabs');
    tabsContainer.innerHTML = '';
    
    boards.forEach(board => {
        const tab = document.createElement('button');
        tab.className = `board-tab ${board.id === currentBoardId ? 'active' : ''}`;
        tab.onclick = () => switchBoard(board.id);
        
        const colorSpan = document.createElement('span');
        colorSpan.className = 'board-color';
        colorSpan.style.backgroundColor = board.color;
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = board.name;
        
        tab.appendChild(colorSpan);
        tab.appendChild(nameSpan);
        
        if (boards.length > 1) {
            const deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-board';
            deleteBtn.innerHTML = '✖';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteBoard(board.id);
            };
            tab.appendChild(deleteBtn);
        }
        
        tabsContainer.appendChild(tab);
    });
}

// Renderizar tablero actual
function renderCurrentBoard() {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        document.getElementById('currentBoardTitle').textContent = board.name;
        document.getElementById('boardColorIndicator').style.backgroundColor = board.color;
    }
}

// Cambiar de tablero
function switchBoard(boardId) {
    currentBoardId = boardId;
    renderBoardsTabs();
    renderCurrentBoard();
    renderTasks();
    document.getElementById('searchInput').value = '';
    document.getElementById('priorityFilter').value = 'all';
}

// Crear nuevo tablero
function createNewBoard() {
    const input = document.getElementById('newBoardName');
    const color = document.getElementById('boardColor').value;
    const boardName = input.value.trim();
    
    if (boardName === '') {
        alert('Por favor, escribe un nombre para el tablero');
        return;
    }

    const newBoard = {
        id: 'board-' + Date.now(),
        name: boardName,
        color: color,
        createdAt: new Date().toISOString(),
        tasks: {
            todo: [],
            doing: [],
            done: []
        }
    };

    boards.push(newBoard);
    saveToLocalStorage();
    
    currentBoardId = newBoard.id;
    renderBoardsTabs();
    renderCurrentBoard();
    renderTasks();
    
    input.value = '';
}

// Eliminar tablero
function deleteBoard(boardId) {
    if (boards.length <= 1) {
        alert('No puedes eliminar el único tablero');
        return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este tablero y todas sus tareas?')) {
        boards = boards.filter(b => b.id !== boardId);
        
        if (currentBoardId === boardId) {
            currentBoardId = boards[0].id;
        }
        
        saveToLocalStorage();
        renderBoardsTabs();
        renderCurrentBoard();
        renderTasks();
    }
}

// Manejar tecla Enter para nuevo tablero
function handleBoardKeyPress(event) {
    if (event.key === 'Enter') {
        createNewBoard();
    }
}

// Editar tablero
function showEditBoardModal() {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        document.getElementById('editBoardName').value = board.name;
        document.getElementById('editBoardColor').value = board.color;
        document.getElementById('editBoardModal').classList.add('active');
    }
}

function saveBoardEdit() {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        board.name = document.getElementById('editBoardName').value.trim() || board.name;
        board.color = document.getElementById('editBoardColor').value;
        saveToLocalStorage();
        renderBoardsTabs();
        renderCurrentBoard();
        closeEditBoardModal();
    }
}

function closeEditBoardModal() {
    document.getElementById('editBoardModal').classList.remove('active');
}

// Exportar tablero
function exportBoard() {
    const board = boards.find(b => b.id === currentBoardId);
    const dataStr = JSON.stringify(board, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${board.name}-backup.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Recolectar todos los tags
function collectAllTags() {
    allTags.clear();
    boards.forEach(board => {
        Object.values(board.tasks).forEach(column => {
            column.forEach(task => {
                if (task.tags) {
                    task.tags.forEach(tag => allTags.add(tag));
                }
            });
        });
    });
    
    const tagFilter = document.getElementById('tagFilter');
    tagFilter.innerHTML = '<option value="all">Todos los tags</option>';
    Array.from(allTags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Filtrar tareas
function filterTasks() {
    renderTasks();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('priorityFilter').value = 'all';
    document.getElementById('tagFilter').value = 'all';
    renderTasks();
}

// Renderizar tareas con filtros
function renderTasks() {
    const board = boards.find(b => b.id === currentBoardId);
    if (!board) return;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priorityFilter = document.getElementById('priorityFilter').value;
    const tagFilter = document.getElementById('tagFilter').value;
    
    renderBoard('todo', board.tasks.todo, searchTerm, priorityFilter, tagFilter);
    renderBoard('doing', board.tasks.doing, searchTerm, priorityFilter, tagFilter);
    renderBoard('done', board.tasks.done, searchTerm, priorityFilter, tagFilter);
    
    updateColumnCounts();
    updateBoardStats();
}

// Renderizar columna específica
function renderBoard(boardId, tasks, searchTerm, priorityFilter, tagFilter) {
    const boardElement = document.getElementById(`${boardId}-list`);
    boardElement.innerHTML = '';
    
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        const matchesTag = tagFilter === 'all' || (task.tags && task.tags.includes(tagFilter));
        return matchesSearch && matchesPriority && matchesTag;
    });
    
    if (filteredTasks.length === 0) {
        boardElement.innerHTML = '<div class="empty-message">No hay tareas que coincidan</div>';
        return;
    }

    filteredTasks.forEach((task) => {
        const taskElement = createTaskElement(task, boardId);
        boardElement.appendChild(taskElement);
    });
}

// Crear elemento de tarea
function createTaskElement(task, boardId) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task priority-${task.priority || 'media'}`;
    taskDiv.draggable = true;
    taskDiv.setAttribute('data-board', boardId);
    taskDiv.setAttribute('data-task-id', task.id);
    
    taskDiv.addEventListener('dragstart', dragStart);
    taskDiv.addEventListener('dragend', dragEnd);
    taskDiv.addEventListener('dblclick', () => showEditTaskModal(boardId, task.id));
    
    // Header de la tarea
    const header = document.createElement('div');
    header.className = 'task-header';
    
    const contentSpan = document.createElement('span');
    contentSpan.className = 'task-content';
    contentSpan.textContent = task.text;
    
    const priorityBadge = document.createElement('span');
    priorityBadge.className = 'priority-badge';
    priorityBadge.textContent = task.priority ? task.priority.toUpperCase() : 'MEDIA';
    
    header.appendChild(contentSpan);
    header.appendChild(priorityBadge);
    
    // Tags
    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'task-tags';
    if (task.tags) {
        task.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag';
            tagSpan.textContent = tag;
            tagSpan.onclick = (e) => {
                e.stopPropagation();
                document.getElementById('tagFilter').value = tag;
                filterTasks();
            };
            tagsDiv.appendChild(tagSpan);
        });
    }
    
    // Footer
    const footer = document.createElement('div');
    footer.className = 'task-footer';
    
    if (task.dueDate) {
        const dateSpan = document.createElement('span');
        dateSpan.className = `task-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`;
        dateSpan.innerHTML = `📅 ${formatDate(task.dueDate)}`;
        footer.appendChild(dateSpan);
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(boardId, task.id);
    };
    
    taskDiv.appendChild(header);
    taskDiv.appendChild(tagsDiv);
    taskDiv.appendChild(footer);
    taskDiv.appendChild(deleteBtn);
    
    return taskDiv;
}

// Verificar si una fecha está vencida
function isOverdue(dateString) {
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
}

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Agregar nueva tarea
function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const tagsInput = document.getElementById('taskTags').value;
    
    const taskText = input.value.trim();
    
    if (taskText === '') {
        alert('Por favor, escribe una tarea');
        return;
    }

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    const newTask = {
        id: 'task-' + Date.now() + '-' + Math.random(),
        text: taskText,
        priority: priority,
        dueDate: dueDate || null,
        tags: tags,
        createdAt: new Date().toISOString()
    };

    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        board.tasks.todo.push(newTask);
        saveToLocalStorage();
        collectAllTags();
        renderTasks();
    }
    
    input.value = '';
    document.getElementById('taskTags').value = '';
    document.getElementById('taskDueDate').value = '';
}

// Manejar tecla Enter para nueva tarea
function handleTaskKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Editar tarea
function showEditTaskModal(boardId, taskId) {
    const board = boards.find(b => b.id === currentBoardId);
    const task = board.tasks[boardId].find(t => t.id === taskId);
    
    editingTaskInfo = { boardId, taskId };
    
    document.getElementById('editTaskText').value = task.text;
    document.getElementById('editTaskPriority').value = task.priority || 'media';
    document.getElementById('editTaskDueDate').value = task.dueDate || '';
    document.getElementById('editTaskTags').value = task.tags ? task.tags.join(', ') : '';
    
    document.getElementById('editTaskModal').classList.add('active');
}

function saveTaskEdit() {
    if (editingTaskInfo) {
        const board = boards.find(b => b.id === currentBoardId);
        const task = board.tasks[editingTaskInfo.boardId].find(t => t.id === editingTaskInfo.taskId);
        
        task.text = document.getElementById('editTaskText').value.trim() || task.text;
        task.priority = document.getElementById('editTaskPriority').value;
        task.dueDate = document.getElementById('editTaskDueDate').value || null;
        
        const tagsInput = document.getElementById('editTaskTags').value;
        task.tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
        
        saveToLocalStorage();
        collectAllTags();
        renderTasks();
        closeEditTaskModal();
    }
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.remove('active');
    editingTaskInfo = null;
}

// Eliminar tarea
function deleteTask(boardId, taskId) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        const board = boards.find(b => b.id === currentBoardId);
        const taskIndex = board.tasks[boardId].findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            board.tasks[boardId].splice(taskIndex, 1);
            saveToLocalStorage();
            collectAllTags();
            renderTasks();
        }
    }
}

// Actualizar contadores de columnas
function updateColumnCounts() {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        document.getElementById('todo-count').textContent = board.tasks.todo.length;
        document.getElementById('doing-count').textContent = board.tasks.doing.length;
        document.getElementById('done-count').textContent = board.tasks.done.length;
    }
}

// Actualizar estadísticas globales
function updateBoardStats() {
    const board = boards.find(b => b.id === currentBoardId);
    if (board) {
        const todoCount = board.tasks.todo.length;
        const doingCount = board.tasks.doing.length;
        const doneCount = board.tasks.done.length;
        const totalCount = todoCount + doingCount + doneCount;
        
        document.getElementById('todoStats').textContent = todoCount;
        document.getElementById('doingStats').textContent = doingCount;
        document.getElementById('doneStats').textContent = doneCount;
        document.getElementById('totalBoardTasks').textContent = totalCount;
    }
}

// Funciones de Drag & Drop
function allowDrop(event) {
    event.preventDefault();
}

function dragStart(event) {
    const task = event.target;
    const boardId = task.getAttribute('data-board');
    const taskId = task.getAttribute('data-task-id');
    
    draggedTask = {
        board: boardId,
        taskId: taskId
    };
    
    task.classList.add('dragging');
    event.dataTransfer.setData('text/plain', '');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
    draggedTask = null;
}

function drop(event) {
    event.preventDefault();
    
    if (!draggedTask) return;
    
    const targetBoard = event.currentTarget.id;
    const sourceBoard = boards.find(b => b.id === currentBoardId);
    
    if (sourceBoard) {
        // Encontrar la tarea en el tablero de origen
        let taskToMove = null;
        let sourceColumn = null;
        
        for (const column of ['todo', 'doing', 'done']) {
            const task = sourceBoard.tasks[column].find(t => t.id === draggedTask.taskId);
            if (task) {
                taskToMove = task;
                sourceColumn = column;
                break;
            }
        }
        
        if (taskToMove && sourceColumn !== targetBoard) {
            // Eliminar la tarea de la columna original
            const taskIndex = sourceBoard.tasks[sourceColumn].findIndex(t => t.id === draggedTask.taskId);
            sourceBoard.tasks[sourceColumn].splice(taskIndex, 1);
            
            // Agregar la tarea a la nueva columna
            sourceBoard.tasks[targetBoard].push(taskToMove);
            
            saveToLocalStorage();
            renderTasks();
        }
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', init);