# Focus Focus

**Focus Focus** is a productivity suite designed to help users organize their work, manage tasks, stay focused, and get a better overview of how they spend their time.

The goal is to keep everything important in one place instead of having tasks, timers, and productivity statistics scattered across different apps.

## Features

### 📝 To-Do Lists

Create and manage tasks directly inside Focus Focus.

Tasks can include information such as:

- Task name
- Due date
- Category
- Importance and urgency
- Completion status

Tasks can also be moved between different stages as you work on them, making it easy to see what still needs to be done, what is currently being worked on, and what has already been completed.

### 🧠 Eisenhower Method

Instead of using a simple **High / Medium / Low** priority system, Focus Focus uses the **Eisenhower Method** to organize tasks based on their importance and urgency.

Tasks are divided into four areas:

1. **Urgent & Important**  
   Tasks that need to be handled as soon as possible.

2. **Not Urgent & Important**  
   Tasks that are important but can be planned for later.

3. **Urgent & Not Important**  
   Tasks that need attention but may not contribute significantly to long-term goals.

4. **Not Urgent & Not Important**  
   Tasks that can usually be postponed or removed if necessary.

This provides more useful context than simply labeling something as "High Priority" and helps users decide what they should actually work on first.

### 🗂️ Task Categories & Sorting

Focus Focus allows tasks to be organized into different categories, such as:

- 🏫 School
- 💼 Work
- 👤 Personal
- 🔧 Projects
- And other custom categories

Tasks can also be sorted and filtered so users can quickly find what they need.

Rather than having one huge list of tasks, Focus Focus visually separates different types of work into their own sections. This makes it much easier to understand where your workload is coming from at a glance.

### ⏱️ Pomodoro Timer

Focus Focus includes a Pomodoro-style timer for focused work sessions.

The timer is designed around working for a set amount of time followed by a break. This gives users a simple way to structure their work instead of trying to focus indefinitely.

Focus sessions are tracked so they can also contribute to the productivity statistics shown in the analytics section.

### 📊 Analytics

The Analytics page provides an overview of the user's productivity and activity.

Depending on the data available, Focus Focus can track information such as:

- Completed tasks
- Total tasks
- Focus time
- Completed focus sessions
- Task categories
- Task priorities
- Recent productivity activity

The purpose of the analytics page is to give users a quick overview of their progress without having to manually count everything themselves.

### 🌙 Light & Dark Mode

Focus Focus supports both **light mode** and **dark mode**.

The selected theme is saved locally so that the user's preference can remain after refreshing or reopening the application.

---

## 💾 Data Storage

Currently, Focus Focus uses **LocalStorage**, a storage system built directly into modern web browsers.

This means the application's data is stored locally in the browser rather than being sent to a remote server.

The current system stores information such as:

- Tasks
- Task completion status
- Focus time
- Completed Pomodoro sessions
- Theme preferences
- Other application settings

Because the current version uses LocalStorage, Focus Focus does not require an account or database for its basic functionality.

The data remains on the device and browser where the application is being used.

> **Note:** Clearing the browser's site data or LocalStorage can remove the stored Focus Focus data.

---

## 🚧 Planned Storage Improvements

A future version of Focus Focus will move toward a **JSON-based local storage system**.

The goal is to store tasks and other application data in a more structured format while keeping the data stored locally on the user's device.

This would make the storage system easier to manage as Focus Focus grows and additional features are added.

A JSON-based system could eventually be used to organize information such as:

```text
Tasks
├── School
├── Work
├── Personal
└── Projects

Productivity
├── Focus Sessions
├── Focus Time
└── Completed Tasks

Settings
├── Theme
└── Preferences
