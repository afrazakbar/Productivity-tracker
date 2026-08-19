/* =========================================
   FOCUSFORGE
   Productivity Tracker
========================================= */


/* ---------- STORAGE ---------- */

let tasks =
    JSON.parse(
        localStorage.getItem("focusforge_tasks")
    ) || [];

let focusMinutes =
    Number(
        localStorage.getItem(
            "focusforge_focus_minutes"
        )
    ) || 0;

let sessions =
    Number(
        localStorage.getItem(
            "focusforge_sessions"
        )
    ) || 0;


/* ---------- ELEMENTS ---------- */

const modal =
    document.getElementById("modal");

const taskForm =
    document.getElementById("taskForm");

const taskDate =
    document.getElementById("taskDate");

const taskName =
    document.getElementById("taskName");

const taskPriority =
    document.getElementById("taskPriority");

const taskCategory =
    document.getElementById("taskCategory");

const today =
    new Date()
        .toISOString()
        .split("T")[0];


/* ---------- INITIAL SETUP ---------- */

taskDate.value = today;

document.getElementById(
    "currentDate"
).textContent =
    new Date().toLocaleDateString(
        undefined,
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );


/* ---------- SAVE ---------- */

function saveData() {

    localStorage.setItem(
        "focusforge_tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "focusforge_focus_minutes",
        focusMinutes
    );

    localStorage.setItem(
        "focusforge_sessions",
        sessions
    );

}


/* =========================================
   NAVIGATION
========================================= */

const navItems =
    document.querySelectorAll(".nav-item[data-page]");

const pages = {
    dashboard:
        document.getElementById(
            "dashboardPage"
        ),

    tasks:
        document.getElementById(
            "tasksPage"
        ),

    focus:
        document.getElementById(
            "focusPage"
        ),

    analytics:
        document.getElementById(
            "analyticsPage"
        )
};


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const page =
                button.dataset.page;

            showPage(page);

        }
    );

});


document
    .querySelectorAll("[data-page-link]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                showPage(
                    button.dataset.pageLink
                );

            }
        );

    });


function showPage(page) {

    Object.values(pages).forEach(
        p => p.classList.remove(
            "active-page"
        )
    );


    pages[page].classList.add(
        "active-page"
    );


    navItems.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.page === page
            );

        }
    );


    const titles = {

        dashboard: "Dashboard",

        tasks: "Tasks",

        focus: "Focus",

        analytics: "Analytics"

    };


    document.getElementById(
        "pageTitle"
    ).textContent = titles[page];

}


/* =========================================
   MODAL
========================================= */

document
    .getElementById("quickAddButton")
    .addEventListener(
        "click",
        openModal
    );


document
    .getElementById("closeModal")
    .addEventListener(
        "click",
        closeModal
    );


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            closeModal();
        }

    }
);


function openModal() {

    modal.classList.add("show");

    setTimeout(
        () => taskName.focus(),
        100
    );

}


function closeModal() {

    modal.classList.remove("show");

}


/* =========================================
   TASK CREATION
========================================= */

taskForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const task = {

            id:
                Date.now(),

            name:
                taskName.value.trim(),

            priority:
                taskPriority.value,

            category:
                taskCategory.value,

            date:
                taskDate.value,

            status:
                "todo",

            completed:
                false,

            created:
                new Date().toISOString()

        };


        tasks.push(task);

        saveData();

        taskForm.reset();

        taskDate.value = today;

        closeModal();

        renderAll();

    }
);


/* =========================================
   TASK ACTIONS
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            t => t.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    task.status =
        task.completed
            ? "done"
            : "todo";


    saveData();

    renderAll();

}


function deleteTask(id) {

    tasks =
        tasks.filter(
            t => t.id !== id
        );


    saveData();

    renderAll();

}


function moveTask(id, status) {

    const task =
        tasks.find(
            t => t.id === id
        );


    if (!task) return;


    task.status = status;

    task.completed =
        status === "done";


    saveData();

    renderAll();

}


/* =========================================
   TASK HTML
========================================= */

function createTaskHTML(task) {

    return `

        <div class="task-item">

            <div class="task-left">

                <button
                    class="task-check ${
                        task.completed
                            ? "done"
                            : ""
                    }"
                    onclick="
                        toggleTask(${task.id})
                    "
                >
                    ${
                        task.completed
                            ? "✓"
                            : ""
                    }
                </button>


                <div>

                    <div
                        class="task-name ${
                            task.completed
                                ? "task-done"
                                : ""
                        }"
                    >
                        ${escapeHTML(task.name)}
                    </div>


                    <div class="task-meta">

                        ${task.category}
                        •
                        ${task.date}

                    </div>

                </div>

            </div>


            <div>

                <span
                    class="priority ${task.priority}"
                >
                    ${task.priority}
                </span>

            </div>

        </div>

    `;

}


/* =========================================
   DASHBOARD
========================================= */

function renderDashboard() {

    const todayTasks =
        tasks.filter(
            task =>
                task.date === today
        );


    const completed =
        todayTasks.filter(
            task =>
                task.completed
        ).length;


    const total =
        todayTasks.length;


    const percent =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "completedCount"
    ).textContent = completed;


    document.getElementById(
        "totalCount"
    ).textContent = tasks.length;


    document.getElementById(
        "focusMinutes"
    ).textContent = focusMinutes;


    document.getElementById(
        "progressPercent"
    ).textContent =
        percent + "%";


    document.getElementById(
        "progressText"
    ).textContent =
        `${completed} / ${total}`;


    document.getElementById(
        "progressBar"
    ).style.width =
        percent + "%";


    document.getElementById(
        "streakCount"
    ).textContent =
        calculateStreak();


    const container =
        document.getElementById(
            "todayTasks"
        );


    container.innerHTML = "";


    if (todayTasks.length === 0) {

        container.innerHTML = `
            <p class="task-meta">
                No tasks for today. Enjoy the
                empty schedule. 
            </p>
        `;

        return;

    }


    todayTasks
        .slice(0, 6)
        .forEach(
            task => {

                container.insertAdjacentHTML(
                    "beforeend",
                    createTaskHTML(task)
                );

            }
        );

}


/* =========================================
   KANBAN
========================================= */

function renderKanban() {

    const containers = {

        todo:
            document.getElementById(
                "todoTasks"
            ),

        progress:
            document.getElementById(
                "progressTasks"
            ),

        done:
            document.getElementById(
                "doneTasks"
            )

    };


    Object.values(containers).forEach(
        container =>
            container.innerHTML = ""
    );


    let filtered =
        [...tasks];


    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();


    const priority =
        document.getElementById(
            "filterPriority"
        ).value;


    const category =
        document.getElementById(
            "filterCategory"
        ).value;


    filtered =
        filtered.filter(task => {

            const matchesSearch =
                task.name
                    .toLowerCase()
                    .includes(search);


            const matchesPriority =
                priority === "all" ||
                task.priority === priority;


            const matchesCategory =
                category === "all" ||
                task.category === category;


            return (
                matchesSearch &&
                matchesPriority &&
                matchesCategory
            );

        });


    filtered.forEach(task => {

        containers[task.status]
            .insertAdjacentHTML(
                "beforeend",
                createTaskHTML(task)
            );

    });


    document.getElementById(
        "todoCount"
    ).textContent =
        filtered.filter(
            t => t.status === "todo"
        ).length;


    document.getElementById(
        "progressCount"
    ).textContent =
        filtered.filter(
            t => t.status === "progress"
        ).length;


    document.getElementById(
        "doneCount"
    ).textContent =
        filtered.filter(
            t => t.status === "done"
        ).length;

}


/* =========================================
   SEARCH
========================================= */

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        renderKanban
    );


document
    .getElementById("filterPriority")
    .addEventListener(
        "change",
        renderKanban
    );


document
    .getElementById("filterCategory")
    .addEventListener(
        "change",
        renderKanban
    );


/* =========================================
   FOCUS TIMER
========================================= */

let timerSeconds = 25 * 60;

let timerRunning = false;

let timerInterval = null;


const timerElement =
    document.getElementById("timer");


function updateTimerDisplay() {

    const minutes =
        Math.floor(
            timerSeconds / 60
        );

    const seconds =
        timerSeconds % 60;


    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


document
    .getElementById("startTimer")
    .addEventListener(
        "click",
        () => {

            if (timerRunning) {

                clearInterval(
                    timerInterval
                );

                timerRunning = false;

                document.getElementById(
                    "startTimer"
                ).textContent =
                    "Resume Focus";

                return;

            }


            timerRunning = true;


            document.getElementById(
                "startTimer"
            ).textContent =
                "Pause";


            timerInterval =
                setInterval(
                    () => {

                        timerSeconds--;


                        updateTimerDisplay();


                        if (
                            timerSeconds <= 0
                        ) {

                            finishSession();

                        }

                    },
                    1000
                );

        }
    );


document
    .getElementById("resetTimer")
    .addEventListener(
        "click",
        resetTimer
    );


function resetTimer() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();

    document.getElementById(
        "startTimer"
    ).textContent =
        "Start Focus";

}


function finishSession() {

    clearInterval(
        timerInterval
    );

    timerRunning = false;

    focusMinutes += 25;

    sessions++;


    saveData();

    document.getElementById(
        "sessionCount"
    ).textContent = sessions;


    alert(
        "Focus session complete! 🎯"
    );


    resetTimer();

    renderAll();

}


/* TIMER MODES */

document
    .querySelectorAll(".mode")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".mode")
                    .forEach(
                        b =>
                            b.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                timerSeconds =
                    Number(
                        button.dataset.minutes
                    ) * 60;


                updateTimerDisplay();

            }
        );

    });


/* =========================================
   ANALYTICS
========================================= */

function renderAnalytics() {

    const high =
        tasks.filter(
            t => t.priority === "high"
        ).length;


    const medium =
        tasks.filter(
            t => t.priority === "medium"
        ).length;


    const low =
        tasks.filter(
            t => t.priority === "low"
        ).length;


    document.getElementById(
        "highTasks"
    ).textContent = high;


    document.getElementById(
        "mediumTasks"
    ).textContent = medium;


    document.getElementById(
        "lowTasks"
    ).textContent = low;


    renderChart();

}


function renderChart() {

    const chart =
        document.getElementById(
            "weeklyChart"
        );


    chart.innerHTML = "";


    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const dateString =
            date
                .toISOString()
                .split("T")[0];


        const completed =
            tasks.filter(
                task =>
                    task.date === dateString &&
                    task.completed
            ).length;


        const height =
            Math.min(
                completed * 35 + 5,
                190
            );


        const bar =
            document.createElement(
                "div"
            );


        bar.className =
            "chart-bar";


        bar.style.height =
            height + "px";


        bar.innerHTML = `
            <span>
                ${date.toLocaleDateString(
                    undefined,
                    {
                        weekday: "short"
                    }
                )}
            </span>
        `;


        chart.appendChild(bar);

    }

}


/* =========================================
   STREAK
========================================= */

function calculateStreak() {

    let streak = 0;


    for (
        let i = 0;
        i < 365;
        i++
    ) {

        const date =
            new Date();


        date.setDate(
            date.getDate() - i
        );


        const dateString =
            date
                .toISOString()
                .split("T")[0];


        const completed =
            tasks.some(
                task =>
                    task.date === dateString &&
                    task.completed
            );


        if (completed) {

            streak++;

        } else {

            break;

        }

    }


    return streak;

}


/* =========================================
   DARK MODE
========================================= */

const themeButton =
    document.getElementById(
        "themeButton"
    );


if (
    localStorage.getItem(
        "focusforge_theme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

}


themeButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        localStorage.setItem(
            "focusforge_theme",
            document.body.classList.contains(
                "dark"
            )
                ? "dark"
                : "light"
        );

    }
);


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* =========================================
   RENDER EVERYTHING
========================================= */

function renderAll() {

    renderDashboard();

    renderKanban();

    renderAnalytics();

    document.getElementById(
        "sessionCount"
    ).textContent = sessions;

}


renderAll();

updateTimerDisplay();