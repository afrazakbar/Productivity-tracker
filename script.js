/* =========================================
   FOCUS FOCUS
   Productivity Suite
   JavaScript
========================================= */


/* =========================================
   STORAGE
========================================= */

let tasks =
    JSON.parse(
        localStorage.getItem("focusfocus_tasks")
    ) || [];

let focusMinutes =
    Number(
        localStorage.getItem(
            "focusfocus_focus_minutes"
        )
    ) || 0;

let sessions =
    Number(
        localStorage.getItem(
            "focusfocus_sessions"
        )
    ) || 0;


/* =========================================
   ELEMENTS
========================================= */

const modal =
    document.getElementById("modal");

const taskForm =
    document.getElementById("taskForm");

const taskName =
    document.getElementById("taskName");

const taskCategory =
    document.getElementById("taskCategory");

const taskDate =
    document.getElementById("taskDate");

const taskImportance =
    document.getElementById("taskImportance");

const taskUrgency =
    document.getElementById("taskUrgency");

const today =
    new Date()
        .toISOString()
        .split("T")[0];


/* =========================================
   INITIAL SETUP
========================================= */

if (taskDate) {
    taskDate.value = today;
}


const currentDate =
    document.getElementById("currentDate");

if (currentDate) {

    currentDate.textContent =
        new Date().toLocaleDateString(
            undefined,
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        "focusfocus_tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "focusfocus_focus_minutes",
        focusMinutes
    );

    localStorage.setItem(
        "focusfocus_sessions",
        sessions
    );

}


/* =========================================
   NAVIGATION
========================================= */

const navItems =
    document.querySelectorAll(
        ".nav-item[data-page]"
    );


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


function showPage(page) {

    Object.values(pages).forEach(
        element => {

            if (element) {
                element.classList.remove(
                    "active-page"
                );
            }

        }
    );


    if (pages[page]) {

        pages[page].classList.add(
            "active-page"
        );

    }


    navItems.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === page
        );

    });


    const titles = {

        dashboard: "Dashboard",
        tasks: "Tasks",
        focus: "Focus",
        analytics: "Analytics"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );


    if (pageTitle) {

        pageTitle.textContent =
            titles[page] || "Dashboard";

    }

}


navItems.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            showPage(
                button.dataset.page
            );

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


/* =========================================
   MODAL
========================================= */

const quickAddButton =
    document.getElementById(
        "quickAddButton"
    );

const closeModalButton =
    document.getElementById(
        "closeModal"
    );


if (quickAddButton) {

    quickAddButton.addEventListener(
        "click",
        openModal
    );

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );

}


function openModal() {

    if (!modal) return;

    modal.classList.add("show");


    setTimeout(
        () => {

            if (taskName) {
                taskName.focus();
            }

        },
        100
    );

}


function closeModal() {

    if (!modal) return;

    modal.classList.remove("show");

}


/* =========================================
   EISENHOWER METHOD
========================================= */

/*
    Eisenhower Matrix:

    Important + Urgent
        = DO

    Important + Not Urgent
        = SCHEDULE

    Not Important + Urgent
        = DELEGATE

    Not Important + Not Urgent
        = ELIMINATE
*/


function getEisenhowerQuadrant(task) {

    const important =
        task.important === true;

    const urgent =
        task.urgent === true;


    if (
        important &&
        urgent
    ) {

        return "do";

    }


    if (
        important &&
        !urgent
    ) {

        return "schedule";

    }


    if (
        !important &&
        urgent
    ) {

        return "delegate";

    }


    return "eliminate";

}


/* =========================================
   TASK CREATION
========================================= */

if (taskForm) {

    taskForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const task = {

                id:
                    Date.now(),

                name:
                    taskName.value.trim(),

                category:
                    taskCategory.value,

                date:
                    taskDate.value,

                important:
                    taskImportance
                        ? taskImportance.checked
                        : false,

                urgent:
                    taskUrgency
                        ? taskUrgency.checked
                        : false,

                status:
                    "todo",

                completed:
                    false,

                created:
                    new Date().toISOString()

            };


            if (!task.name) {
                return;
            }


            tasks.push(task);


            saveData();


            taskForm.reset();


            if (taskDate) {
                taskDate.value = today;
            }


            closeModal();


            renderAll();

        }
    );

}


/* =========================================
   TASK ACTIONS
========================================= */

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
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
            task => task.id !== id
        );


    saveData();

    renderAll();

}


function moveTask(
    id,
    status
) {

    const task =
        tasks.find(
            task => task.id === id
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

    const quadrant =
        getEisenhowerQuadrant(task);


    const quadrantNames = {

        do:
            "DO",

        schedule:
            "SCHEDULE",

        delegate:
            "DELEGATE",

        eliminate:
            "ELIMINATE"

    };


    return `

        <div
            class="task-item"
            data-id="${task.id}"
        >

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

                        ${escapeHTML(
                            task.category
                        )}

                        •

                        ${task.date}

                    </div>


                    <span
                        class="eisenhower-tag ${quadrant}"
                    >
                        ${quadrantNames[quadrant]}
                    </span>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="delete-task"
                    onclick="
                        deleteTask(${task.id})
                    "
                    title="Delete task"
                >
                    🗑️
                </button>

            </div>

        </div>

    `;

}


/* =========================================
   CATEGORY GROUPS
========================================= */

const categoryNames = {

    school:
        "🎓 School",

    work:
        "💼 Work",

    personal:
        "👤 Personal",

    project:
        "🛠️ Projects",

    other:
        "📦 Other"

};


function renderCategoryBoxes() {

    const container =
        document.getElementById(
            "categoryBoxes"
        );


    if (!container) return;


    container.innerHTML = "";


    const categories = [

        "school",
        "work",
        "personal",
        "project",
        "other"

    ];


    categories.forEach(
        category => {

            const categoryTasks =
                tasks.filter(
                    task =>
                        task.category === category
                );


            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "category-box";


            box.innerHTML = `

                <div class="category-header">

                    <h3>
                        ${categoryNames[category]}
                    </h3>

                    <span>
                        ${categoryTasks.length}
                    </span>

                </div>


                <div class="category-task-list">

                    ${
                        categoryTasks.length
                            ? categoryTasks
                                .map(
                                    createTaskHTML
                                )
                                .join("")
                            : `
                                <p class="task-meta">
                                    No tasks here yet.
                                </p>
                            `
                    }

                </div>

            `;


            container.appendChild(box);

        }
    );

}


/* =========================================
   EISENHOWER MATRIX
========================================= */

function renderEisenhower() {

    const quadrants = {

        do:
            document.getElementById(
                "doTasks"
            ),

        schedule:
            document.getElementById(
                "scheduleTasks"
            ),

        delegate:
            document.getElementById(
                "delegateTasks"
            ),

        eliminate:
            document.getElementById(
                "eliminateTasks"
            )

    };


    Object.values(quadrants).forEach(
        container => {

            if (container) {
                container.innerHTML = "";
            }

        }
    );


    tasks.forEach(task => {

        const quadrant =
            getEisenhowerQuadrant(task);


        const container =
            quadrants[quadrant];


        if (
            container
        ) {

            container.insertAdjacentHTML(
                "beforeend",
                createTaskHTML(task)
            );

        }

    });


    updateQuadrantCount(
        "doTasks",
        "doCount"
    );

    updateQuadrantCount(
        "scheduleTasks",
        "scheduleCount"
    );

    updateQuadrantCount(
        "delegateTasks",
        "delegateCount"
    );

    updateQuadrantCount(
        "eliminateTasks",
        "eliminateCount"
    );

}


function updateQuadrantCount(
    containerId,
    countId
) {

    const container =
        document.getElementById(
            containerId
        );


    const count =
        document.getElementById(
            countId
        );


    if (
        container &&
        count
    ) {

        count.textContent =
            container.querySelectorAll(
                ".task-item"
            ).length;

    }

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
                completed /
                total *
                100
            );


    setText(
        "completedCount",
        completed
    );


    setText(
        "totalCount",
        tasks.length
    );


    setText(
        "focusMinutes",
        focusMinutes
    );


    setText(
        "progressPercent",
        percent + "%"
    );


    setText(
        "progressText",
        `${completed} / ${total}`
    );


    const progressBar =
        document.getElementById(
            "progressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            percent + "%";

    }


    setText(
        "streakCount",
        calculateStreak()
    );


    const todayContainer =
        document.getElementById(
            "todayTasks"
        );


    if (!todayContainer) return;


    todayContainer.innerHTML = "";


    if (
        todayTasks.length === 0
    ) {

        todayContainer.innerHTML = `

            <p class="task-meta">
                No tasks for today.
                Enjoy the suspiciously
                peaceful schedule. 💀
            </p>

        `;

        return;

    }


    todayTasks
        .slice(0, 6)
        .forEach(task => {

            todayContainer.insertAdjacentHTML(
                "beforeend",
                createTaskHTML(task)
            );

        });

}


/* =========================================
   TASK PAGE
========================================= */

function renderTaskPage() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const categoryFilter =
        document.getElementById(
            "filterCategory"
        );


    const search =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const category =
        categoryFilter
            ? categoryFilter.value
            : "all";


    const filtered =
        tasks.filter(task => {

            const matchesSearch =
                task.name
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                category === "all" ||
                task.category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    const todo =
        document.getElementById(
            "todoTasks"
        );

    const progress =
        document.getElementById(
            "progressTasks"
        );

    const done =
        document.getElementById(
            "doneTasks"
        );


    [
        todo,
        progress,
        done
    ].forEach(container => {

        if (container) {
            container.innerHTML = "";
        }

    });


    filtered.forEach(task => {

        let container;


        if (
            task.status === "progress"
        ) {

            container = progress;

        } else if (
            task.status === "done"
        ) {

            container = done;

        } else {

            container = todo;

        }


        if (container) {

            container.insertAdjacentHTML(
                "beforeend",
                createTaskHTML(task)
            );

        }

    });


    setText(
        "todoCount",
        filtered.filter(
            task =>
                task.status === "todo"
        ).length
    );


    setText(
        "progressCount",
        filtered.filter(
            task =>
                task.status === "progress"
        ).length
    );


    setText(
        "doneCount",
        filtered.filter(
            task =>
                task.status === "done"
        ).length
    );

}


/* =========================================
   SEARCH + FILTER
========================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );


const filterCategory =
    document.getElementById(
        "filterCategory"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderTaskPage
    );

}


if (filterCategory) {

    filterCategory.addEventListener(
        "change",
        renderTaskPage
    );

}


/* =========================================
   POMODORO TIMER
========================================= */

let timerSeconds =
    25 * 60;

let timerRunning =
    false;

let timerInterval =
    null;

let currentMode =
    "focus";


const timerElement =
    document.getElementById(
        "timer"
    );


const startTimerButton =
    document.getElementById(
        "startTimer"
    );


const resetTimerButton =
    document.getElementById(
        "resetTimer"
    );


function updateTimerDisplay() {

    if (!timerElement) return;


    const minutes =
        Math.floor(
            timerSeconds / 60
        );


    const seconds =
        timerSeconds % 60;


    timerElement.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


function startTimer() {

    if (timerRunning) {

        pauseTimer();

        return;

    }


    timerRunning = true;


    if (startTimerButton) {

        startTimerButton.textContent =
            "Pause";

    }


    timerInterval =
        setInterval(
            () => {

                timerSeconds--;


                updateTimerDisplay();


                if (
                    timerSeconds <= 0
                ) {

                    finishPomodoro();

                }

            },
            1000
        );

}


function pauseTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    if (startTimerButton) {

        startTimerButton.textContent =
            "Resume";

    }

}


function resetTimer() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    const durations = {

        focus: 25,
        short: 5,
        long: 15

    };


    timerSeconds =
        durations[currentMode] *
        60;


    updateTimerDisplay();


    if (startTimerButton) {

        startTimerButton.textContent =
            "Start Focus";

    }

}


function finishPomodoro() {

    clearInterval(
        timerInterval
    );


    timerRunning = false;


    if (
        currentMode === "focus"
    ) {

        focusMinutes += 25;

        sessions++;


        saveData();


        setText(
            "sessionCount",
            sessions
        );


        alert(
            "Pomodoro complete! 🎯\nTime for a break."
        );

    }


    resetTimer();


    renderAll();

}


if (startTimerButton) {

    startTimerButton.addEventListener(
        "click",
        startTimer
    );

}


if (resetTimerButton) {

    resetTimerButton.addEventListener(
        "click",
        resetTimer
    );

}


/* =========================================
   POMODORO MODES
========================================= */

document
    .querySelectorAll(".mode")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".mode")
                    .forEach(
                        mode =>
                            mode.classList.remove(
                                "active"
                            )
                    );


                button.classList.add(
                    "active"
                );


                const minutes =
                    Number(
                        button.dataset.minutes
                    );


                timerSeconds =
                    minutes * 60;


                currentMode =
                    minutes === 25
                        ? "focus"
                        : minutes === 5
                            ? "short"
                            : "long";


                clearInterval(
                    timerInterval
                );


                timerRunning =
                    false;


                if (startTimerButton) {

                    startTimerButton.textContent =
                        "Start";

                }


                updateTimerDisplay();

            }
        );

    });


/* =========================================
   ANALYTICS
========================================= */

function renderAnalytics() {

    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const total =
        tasks.length;


    const completionRate =
        total === 0
            ? 0
            : Math.round(
                completed /
                total *
                100
            );


    setText(
        "analyticsCompleted",
        completed
    );


    setText(
        "analyticsTotal",
        total
    );


    setText(
        "analyticsCompletion",
        completionRate + "%"
    );


    renderChart();

}


function renderChart() {

    const chart =
        document.getElementById(
            "weeklyChart"
        );


    if (!chart) return;


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
                    task.date ===
                        dateString &&
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
                    task.date ===
                        dateString &&
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
        "focusfocus_theme"
    ) === "dark"
) {

    document.body.classList.add(
        "dark"
    );

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            localStorage.setItem(
                "focusfocus_theme",
                document.body.classList.contains(
                    "dark"
                )
                    ? "dark"
                    : "light"
            );

        }
    );

}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================
   UTILITY
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================
   RENDER EVERYTHING
========================================= */

function renderAll() {

    renderDashboard();

    renderTaskPage();

    renderCategoryBoxes();

    renderEisenhower();

    renderAnalytics();


    setText(
        "sessionCount",
        sessions
    );

}


renderAll();

updateTimerDisplay();