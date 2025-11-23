const calendarData = {
    currentDate: new Date(),
    events: [
        { date: '2025-11-27', title: '1회차 소셜링 why me?', type: 'social' },
        { date: '2025-11-28', title: '2회차 소셜링 why not me?', type: 'social' }
    ]
};

function initCalendar() {
    renderCalendar(calendarData.currentDate);
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Update Header
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    document.getElementById('calendar-month').innerText = `${monthNames[month]} ${year}`;

    // Generate Grid
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday

    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    // Empty slots for previous month
    for (let i = 0; i < startingDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day';
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Date Number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.innerText = day;
        cell.appendChild(dayNumber);

        // Check for events
        const dayEvents = calendarData.events.filter(e => e.date === dateString);
        dayEvents.forEach(event => {
            const eventEl = document.createElement('div');
            eventEl.className = 'calendar-event';
            eventEl.innerText = event.title;
            eventEl.title = event.title; // Tooltip
            cell.appendChild(eventEl);
        });

        // Highlight today (if match)
        const today = new Date();
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            cell.classList.add('today');
        }

        grid.appendChild(cell);
    }
}

function prevMonth() {
    calendarData.currentDate.setMonth(calendarData.currentDate.getMonth() - 1);
    renderCalendar(calendarData.currentDate);
}

function nextMonth() {
    calendarData.currentDate.setMonth(calendarData.currentDate.getMonth() + 1);
    renderCalendar(calendarData.currentDate);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initCalendar);
