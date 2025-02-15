let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let tasks = {};

// Function to populate the year and month dropdowns
function populateYearAndMonthSelect() {
    const yearSelect = document.getElementById('yearSelect');
    const monthSelect = document.getElementById('monthSelect');
    yearSelect.innerHTML = ''; // Clear previous options
    monthSelect.innerHTML = ''; // Clear previous options

    for (let year = currentYear - 10; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    for (let month = 0; month < 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = new Date(0, month).toLocaleString('default', { month: 'long' });
        monthSelect.appendChild(option);
    }

    yearSelect.value = currentYear; // Set the current year as selected
    monthSelect.value = currentMonth; // Set the current month as selected
}

// Function to update the calendar display
function updateCalendar() {
    const monthContainer = document.querySelector('.month-container');
    monthContainer.innerHTML = ''; // Clear previous months

    // Generate calendar for the selected year and month
    const month = currentMonth;
    const monthElement = document.createElement('div');
    monthElement.className = 'month';

    // Get the month name
    const monthName = document.createElement('div');
    monthName.className = 'month-name';
    monthName.innerText = new Date(currentYear, month).toLocaleString('default', { month: 'long' }) + ' ' + currentYear;
    monthElement.appendChild(monthName);

    // Create a grid for the days of the week
    const daysHeader = document.createElement('div');
    daysHeader.className = 'days';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.innerText = day;
        daysHeader.appendChild(dayHeader);
    });
    monthElement.appendChild(daysHeader);

    // Create a grid for the days of the month
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days';

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(currentYear, month, 1).getDay();
    const totalDays = new Date(currentYear, month + 1, 0).getDate();

    // Fill in the empty days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        daysContainer.appendChild(emptyDay);
    }

    // Create day elements for each day in the month
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.id = `day-${day}-${month}-${currentYear}`;
        dayElement.innerText = day;
        dayElement.onclick = () => addTask(day, month, currentYear);

        // If there are tasks for the day, display them
        const taskKey = `${day}-${month}-${currentYear}`;
        if (tasks[taskKey]) {
            const taskList = document.createElement('div');
            taskList.className = 'task-list';
            tasks[taskKey].forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.innerText = `${task.task} at ${task.time}`;
                taskList.appendChild(taskItem);
            });
            dayElement.appendChild(taskList);
        }

        daysContainer.appendChild(dayElement);
    }

    monthElement.appendChild(daysContainer);
    monthContainer.appendChild(monthElement );

    document.getElementById('monthYear').innerText = new Date(currentYear, month).toLocaleString('default', { month: 'long' }) + ' ' + currentYear; // Update the displayed month and year
}

// Function to handle year and month selection
document.getElementById('yearSelect').onchange = function() {
    currentYear = parseInt(this.value);
    updateCalendar();
};

document.getElementById('monthSelect').onchange = function() {
    currentMonth = parseInt(this.value);
    updateCalendar();
};

// Event listeners for navigating between years
document.getElementById('prev').onclick = function() {
    currentYear -= 1;
    document.getElementById('yearSelect').value = currentYear; // Update dropdown
    updateCalendar();
};

document.getElementById('next').onclick = function () {
    currentYear += 1;
    document.getElementById('yearSelect').value = currentYear; // Update dropdown
    updateCalendar();
};

// Initialize the calendar and year/month dropdowns on page load
window.onload = function() {
    populateYearAndMonthSelect();
    updateCalendar();
};

// Function to open the modal for adding a task
function addTask(day, month, year) {
    document.getElementById('taskModal').style.display = 'block';
    document.getElementById('taskInput').value = ''; // Clear previous input
    document.getElementById('timeInput').value = ''; // Clear previous time input
    document.getElementById('taskModal').dataset.selectedDate = `${day}-${month}-${year}`; // Store selected date
}

// Function to close the modal
function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
}

// Function to save the task
function saveTask() {
    const taskInput = document.getElementById('taskInput').value;
    const timeInput = document.getElementById('timeInput').value;
    const selectedDate = document.getElementById('taskModal').dataset.selectedDate;

    if (taskInput && timeInput) {
        if (!tasks[selectedDate]) {
            tasks[selectedDate] = [];
        }
        tasks[selectedDate].push({ task: taskInput, time: timeInput });
        closeModal();
        updateCalendar(); // Refresh the calendar to show the new task

        // Immediately display the new task on the corresponding day
        const [day, month, year] = selectedDate.split('-').map(Number);
        const dayElement = document.getElementById(`day-${day}-${month}-${year}`);
        const taskList = dayElement.querySelector('.task-list') || document.createElement('div');
        taskList.className = 'task-list';
        const taskItem = document.createElement('div');
        taskItem.innerText = `${taskInput} at ${timeInput}`;
        taskList.appendChild(taskItem);
        dayElement.appendChild(taskList);
    } else {
        alert('Please enter both task and time.'); // Alert if inputs are empty
    }
}