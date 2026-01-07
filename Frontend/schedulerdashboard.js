// Backend API URL
const API_URL = 'http://localhost:8081/api/tasks';

// Card containers
const dueTasksEl = document.getElementById('due-tasks');
const inProgressEl = document.getElementById('inprogress-tasks');
const completedEl = document.getElementById('completed-tasks');

// Fetch tasks from backend
async function fetchTasks() {
    try {
    const res = await fetch(`${API_URL}`);
if (!res.ok) throw new Error('Failed to fetch tasks');

    const tasks = await res.json();
    displayTasks(tasks);
    } catch (err) {
    console.error(err);
    alert('Error fetching tasks: ' + err.message);
    }
}

function displayTasks(tasks) {
    // Clear current lists
    dueTasksEl.innerHTML = '<h3>🕒 Due Tasks</h3>';
    inProgressEl.innerHTML = '<h3>⚙️ In Progress</h3>';
    completedEl.innerHTML = '<h3>✅ Completed Tasks</h3>';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.classList.add('task-item');
        taskEl.setAttribute('data-task-id', task.id);
        taskEl.style.cursor = 'pointer';

        // Calculate progress
        const totalSubtasks = task.st ? task.st.length : 0;
        const completedSubtasks = task.st ? task.st.filter(st => st.status).length : 0;
        const progress = totalSubtasks ? (completedSubtasks / totalSubtasks) * 100 : 0;

        // Subtask text
        let subtaskText = '';
        if (totalSubtasks > 0) {
            subtaskText = `<small>${completedSubtasks}/${totalSubtasks} Subtasks Completed</small>
                           <div class="progress-bar">
                               <div class="progress" style="width: ${progress}%;"></div>
                           </div>`;
        }

        taskEl.innerHTML = `
            <div class="task-info">
                <span>${task.task}</span>
                ${task.status ? `<small>Completed: ${task.dueDate}</small>` : `<small>Due: ${task.dueDate}</small>`}
                ${subtaskText}
            </div>
        `;

        const dueDateObj = new Date(task.dueDate);
        dueDateObj.setHours(0, 0, 0, 0);

        const isPastDue = dueDateObj < today && !task.status;
        const isTodayDue = dueDateObj.getTime() === today.getTime() && !task.status;

        // Append to proper card
        if (task.status) {
            completedEl.appendChild(taskEl);
        } else if (isPastDue) {
            dueTasksEl.appendChild(taskEl);
        } else if (progress > 0 || isTodayDue) {
            inProgressEl.appendChild(taskEl);
        } else {
            dueTasksEl.appendChild(taskEl);
        }

        // Navigate to edit page on click
        taskEl.addEventListener('click', () => {
            const taskId = taskEl.getAttribute('data-task-id');
            console.log('Navigating to task ID:', taskId);
            // if (taskId) {
            window.location.href = `/taskscheduler.html?id=${taskId}`;
            // } else {
            // console.error('No valid task ID for navigation!');
            // }
        });
    });
}
// Initial fetch
fetchTasks();