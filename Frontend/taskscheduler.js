const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const submitBtn = document.getElementById('submitBtn');
const API_BASE = 'http://localhost:8081/api';

// Detect if an ID is present in URL
const params = new URLSearchParams(window. location.search);
const taskId = params.get('id');

// 🆕 TRACK ALL TASKS IN MEMORY
let allTasks = [];
let tasksToDelete = []; // Track tasks marked for deletion

if (taskId) {
  fetch(`${API_BASE}/tasks/${taskId}`)
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch task');
      return res.json();
    })
    .then(task => populateFormForEditing(task))
    .catch(err => alert('Error loading task: ' + err.message));
}

let currentTask = null;

// Add task or subtask
addBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) return alert('Please enter a task name! ');

  if (currentTask) {
    if (currentTask.editingTask) {
      currentTask.task. taskName = text;
      currentTask.task.dueDate = dateInput.value;

      currentTask.taskCheckbox.nextElementSibling.textContent = text;
      currentTask.taskCheckbox
        .closest('.task-info')
        .querySelector('small').textContent = 'Due: ' + dateInput.value;

      taskInput.value = '';
      dateInput.value = '';
      currentTask.taskItem.style.borderLeft = '5px solid #2575fc';
      currentTask = null;
      return;
    }

    // ---- ADD SUBTASK ----
    const task = currentTask.task;
    const subtask = { subTask: text, status: false };
    task.subTasks. push(subtask);

    const subtaskItem = document.createElement('li');
    subtaskItem.classList.add('subtask-item');
    subtaskItem.innerHTML = `
      <label>
        <input type="checkbox">
        <span class="subtask-text">${subtask.subTask}</span>
      </label>
      <button class="delete-subtask-btn">❌</button>
    `;

    const checkbox = subtaskItem.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
      subtask.status = checkbox.checked;
      updateProgress(task, currentTask. progressEl, currentTask.statusEl, currentTask.taskCheckbox);
    });

    subtaskItem.querySelector('.delete-subtask-btn').addEventListener('click', () => {
      subtaskItem.remove();
      task.subTasks = task.subTasks.filter(st => st !== subtask);
      updateProgress(task, currentTask.progressEl, currentTask.statusEl, currentTask.taskCheckbox);
    });

    currentTask.subtaskList.appendChild(subtaskItem);
    taskInput.value = '';
    dateInput.style.display = 'inline';
    currentTask = null;
  } else {
    // ---- ADD NEW TASK ----
    const dueDate = dateInput.value;
    if (!dueDate) return alert('Please select a due date!');

    const task = { taskName: text, dueDate: dueDate, status: false, subTasks: [] };
    allTasks.push(task);
    addTaskToDOM(task);
    taskInput.value = '';
    dateInput.value = '';
  }
});

// Add task to DOM
function addTaskToDOM(task) {
  const taskItem = document.createElement('li');
  taskItem.classList. add('task-item');
  taskItem.dataset.taskIndex = allTasks.indexOf(task);

  taskItem.innerHTML = `
    <div class="task-header">
      <div class="task-info">
        <label>
          <input type="checkbox">
          <span>${task.taskName}</span>
        </label>
        <small>Due: ${task. dueDate}</small>
        <div class="task-status status-pending">Pending</div>
      </div>
      <div class="task-actions">
        <button class="delete-btn">🗑</button>
      </div>
    </div>
    <div class="progress-bar">
      <div class="progress" style="width: 0%;"></div>
    </div>
    <div class="subtask-section">
      <ul class="subtask-list"></ul>
      <button class="add-subtask-btn">+ Add Subtask</button>
    </div>
  `;

  const taskCheckbox = taskItem.querySelector('.task-info input[type="checkbox"]');
  const deleteBtn = taskItem.querySelector('.delete-btn');
  const addSubtaskBtn = taskItem. querySelector('.add-subtask-btn');
  const subtaskList = taskItem.querySelector('.subtask-list');
  const progressEl = taskItem.querySelector('.progress');
  const statusEl = taskItem.querySelector('.task-status');

  // Add existing subtasks (if any)
  if (task.subTasks && task.subTasks.length > 0) {
    task.subTasks.forEach(st => {
      const subtaskItem = document.createElement('li');
      subtaskItem.classList.add('subtask-item');
      subtaskItem.innerHTML = `
        <label>
          <input type="checkbox" ${st.status ? 'checked' : ''}>
          <span class="subtask-text">${st.subTask}</span>
        </label>
        <button class="delete-subtask-btn">❌</button>
      `;

      const subtaskCheckbox = subtaskItem. querySelector('input[type="checkbox"]');
      subtaskCheckbox. addEventListener('change', () => {
        st.status = subtaskCheckbox.checked;
        updateProgress(task, progressEl, statusEl, taskCheckbox);
      });

      subtaskItem.querySelector('.delete-subtask-btn').addEventListener('click', () => {
        subtaskItem.remove();
        task.subTasks = task.subTasks.filter(s => s !== st);
        updateProgress(task, progressEl, statusEl, taskCheckbox);
      });

      subtaskList.appendChild(subtaskItem);
    });
  }

  // Task checkbox:  toggle all subtasks
  taskCheckbox. addEventListener('change', e => {
    task.status = e.target.checked;
    task.subTasks.forEach((st, idx) => {
      st.status = task.status;
      const subtaskCheckbox = subtaskList.querySelectorAll('input[type="checkbox"]')[idx];
      if (subtaskCheckbox) subtaskCheckbox.checked = task. status;
    });
    updateProgress(task, progressEl, statusEl, taskCheckbox);
  });

  // 🆕 IMPROVED DELETE BUTTON - Blur and mark for deletion
  deleteBtn.addEventListener('click', () => {
    taskItem.style.opacity = '0.5';
    taskItem.style.textDecoration = 'line-through';
    taskItem.style. pointerEvents = 'none';
    
    // Mark task for deletion
    tasksToDelete.push(task);
  });

  // Add subtask button
  addSubtaskBtn.addEventListener('click', () => {
    currentTask = { task, subtaskList, progressEl, statusEl, taskCheckbox };
    dateInput.style.display = 'none';
    taskInput.focus();
  });

  // Edit main task
  taskItem.querySelector('.task-info span').addEventListener('click', () => {
    taskInput.value = task.taskName;
    dateInput.value = task.dueDate;
    dateInput.style. display = 'inline';
    currentTask = { task, subtaskList, progressEl, statusEl, taskCheckbox, taskItem, editingTask: true };
    taskItem.style.borderLeft = '5px solid #4caf50';
  });

  taskList.appendChild(taskItem);
  updateProgress(task, progressEl, statusEl, taskCheckbox);
}

// Update progress and status display
function updateProgress(task, progressEl, statusEl, taskCheckbox) {
  const total = task.subTasks.length;
  const completed = task.subTasks.filter(st => st. status).length;

  if (total === 0) {
    progressEl.style.width = task.status ? '100%' :  '0%';
    taskCheckbox.checked = task.status;
    statusEl.textContent = task.status ? 'Completed' : 'Pending';
    statusEl.className = task.status
      ? 'task-status status-completed'
      : 'task-status status-pending';
    return;
  }

  const progress = (completed / total) * 100;
  progressEl.style.width = progress + '%';
  taskCheckbox.checked = completed === total;

  if (completed === total) {
    statusEl.textContent = 'Completed';
    statusEl.className = 'task-status status-completed';
  } else if (completed > 0) {
    statusEl.textContent = 'In Progress';
    statusEl.className = 'task-status status-in-progress';
  } else {
    statusEl.textContent = 'Pending';
    statusEl.className = 'task-status status-pending';
  }
}

submitBtn.addEventListener('click', () => {
  // Filter out deleted tasks
  const tasksToSave = allTasks.filter(task => ! tasksToDelete.includes(task));

  const tasks = tasksToSave.map(task => ({
    task: task.taskName,
    dueDate: task.dueDate,
    status: task.status,
    st: task.subTasks
  }));

  console.log("Submitting tasks:", tasks);
  console.log("Tasks to delete:", tasksToDelete);

  // If editing a single task and deleting it
  if (taskId && tasksToDelete.length > 0) {
    fetch(`${API_BASE}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete task');
        alert('Task deleted successfully!');
        window.location.href = '/schedulerdashboard.html';
      })
      .catch(err => alert('Error deleting task: ' + err.message));
  } else {
    // Create or update multiple tasks
    const url = taskId ? `${API_BASE}/tasks/${taskId}` : `${API_BASE}/tasks`;
    const method = taskId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: taskId ? JSON.stringify(tasks[0]) : JSON.stringify(tasks)
    })
      .then(res => {
        if (! res.ok) throw new Error('Failed to save tasks');
        return res.json();
      })
      .then(data => {
        alert('Tasks saved successfully!');
        window.location.href = '/schedulerdashboard.html';
      })
      .catch(err => alert('Error saving tasks: ' + err.message));
  }
});

// Populate existing task for editing
function populateFormForEditing(task) {
  taskList.innerHTML = '';
  allTasks = [];
  tasksToDelete = [];

  taskInput.value = task.task;
  dateInput.value = task.dueDate;

  const taskObj = {
    taskName: task.task,
    dueDate: task.dueDate,
    status: task. status,
    subTasks:  task.st || []
  };

  allTasks.push(taskObj);
  addTaskToDOM(taskObj);
}