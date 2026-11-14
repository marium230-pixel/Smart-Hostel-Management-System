<div align="center">

# 🏨 Smart Hostel Management & Complaint System

### A Smart, Data-Structure-Powered Hostel Management Solution

**A university project developed for CT-159 — Data Structures and Algorithms**

<p>
  <img src="https://img.shields.io/badge/C++-17-00599C?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++17">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
</p>

<p>
  <img src="https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
  <img src="https://img.shields.io/badge/Database-D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare D1">
  <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Status-Functional-success?style=for-the-badge" alt="Project Status">
</p>

### 🌐 [LIVE DEMO](https://smart-hostel-management-system-livid.vercel.app) · [SOURCE CODE](https://github.com/marium230-pixel/Smart-Hostel-Management-System)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Project Information](#-project-information)
- [Why This Project?](#-why-this-project)
- [Features](#-features)
- [DSA Concepts Used](#-data-structures--algorithms)
- [How the System Works](#-how-the-system-works)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Testing](#-testing)
- [Installation](#-installation-and-local-setup)
- [Future Improvements](#-future-improvements)
- [Project Team](#-project-team)

---

## 💡 About the Project

**Smart Hostel Management & Complaint System** is a web-based application designed to simplify and organize everyday hostel operations.

Traditional hostel management involves several tasks, including student registration, room allocation, waiting lists, complaint handling, fine management, and activity tracking.

Managing these operations manually can be time-consuming and inefficient.

Our solution brings these operations together in one centralized platform while demonstrating how fundamental **Data Structures and Algorithms** can be applied to solve practical, real-world problems.

The system combines a modern interactive interface with data-management functionality and visual representations of different data structures.

> **Our goal:** Transform theoretical DSA concepts into a practical hostel management solution.

---

## 🎓 Project Information

| Detail | Information |
|---|---|
| University | NED University of Engineering & Technology |
| Location | Karachi, Pakistan |
| Course Code | CT-159 |
| Course Title | Data Structures and Algorithms |
| Project Title | Smart Hostel Management & Complaint System |
| Programming Language | C++ |
| Frontend | React + TypeScript |
| Project Category | Academic / DSA Project |

---

## 🎯 Why This Project?

The project focuses on applying DSA concepts to real hostel-management scenarios.

Instead of using data structures only in isolated programming examples, this system demonstrates their practical applications:

- Arrays for room management.
- Linked lists for student records.
- Hash tables for student lookup.
- Queues for waiting-list management.
- Stacks for activity tracking.
- Binary Search Trees for organized student records.
- Priority Queues for complaint resolution.
- Graphs for hostel navigation.

Each structure has a specific responsibility within the system.

---

# ✨ Features

The application includes the following major modules:

<details>
<summary><strong>📊 1. Interactive Dashboard</strong></summary>

The dashboard provides an overview of hostel operations.

It displays:

- Total registered students.
- Occupied beds.
- Available beds.
- Hostel occupancy percentage.
- Pending complaints.
- Resolved complaints.
- Total fines.
- Students on the waiting list.

The statistics update as hostel records change.

</details>

<details>
<summary><strong>👨‍🎓 2. Student Management</strong></summary>

The student management module handles student records.

Features include:

- Registering new students.
- Storing student information.
- Viewing registered students.
- Assigning students to rooms.
- Checking out students.
- Updating active student records.

Student records are also used by other modules, including room allocation, fines, and complaints.

</details>

<details>
<summary><strong>🛏️ 3. Room Management</strong></summary>

The system manages hostel rooms using an array-based structure.

Features include:

- Displaying available rooms.
- Showing occupied beds.
- Tracking room capacity.
- Direct room assignment.
- Updating room availability after checkout.

The current configuration contains five rooms with two beds each, giving a total capacity of ten beds.

</details>

<details>
<summary><strong>⏳ 4. Waiting List Management</strong></summary>

The waiting list handles students when all hostel beds are occupied.

It follows the **FIFO (First In, First Out)** principle.

How it works:

1. A student requests accommodation.
2. If no bed is available, the student enters the waiting queue.
3. When an existing student checks out, a bed becomes available.
4. The next eligible student in the queue is automatically assigned the available room.

This ensures fair and organized room allocation.

</details>

<details>
<summary><strong>📜 5. Hostel Rules & Regulations</strong></summary>

This module displays hostel rules and their associated penalties.

It helps students understand hostel policies and allows the administration to manage rule violations.

</details>

<details>
<summary><strong>💰 6. Fine Management</strong></summary>

The fine management module maintains records of student penalties.

Features include:

- Creating fine records.
- Associating fines with students.
- Recording rule violations.
- Displaying fine amounts.
- Maintaining fine history.

</details>

<details>
<summary><strong>📢 7. Complaint Management</strong></summary>

Students can submit complaints about hostel facilities and everyday problems.

Complaints are automatically categorized into three priority levels:

| Priority | Category | Meaning |
|---|---|---|
| 🔴 High | Emergency | Urgent situations requiring immediate attention |
| 🟡 Medium | Daily Use / Daily Issues | Everyday hostel maintenance problems |
| 🟢 Low | General | General requests and non-urgent issues |

The complaint system uses a **Priority Queue** to ensure that emergency complaints are handled before less urgent complaints.

Features include:

- Complaint submission.
- Automatic priority classification.
- Priority-based organization.
- Resolving the next eligible complaint.
- Viewing resolved complaints.

</details>

<details>
<summary><strong>📋 8. Resolved Complaints</strong></summary>

This section maintains a record of completed complaints.

It allows the administration to review previously resolved issues and distinguish them from pending complaints.

</details>

<details>
<summary><strong>🕒 9. Activity Tracking</strong></summary>

The activity module displays recent system operations.

It helps administrators monitor actions performed within the hostel management system.

The activity information is also used to demonstrate stack-related functionality.

</details>

<details>
<summary><strong>🧭 10. Hostel Path Finder</strong></summary>

The Path Finder represents hostel locations as a graph.

It helps find routes between different locations, such as:

- Gate
- Reception
- Block A
- Library
- Medical Room

The system uses **Dijkstra's Shortest Path Algorithm** to calculate a shortest route based on the graph's weighted connections.

</details>

<details>
<summary><strong>🧠 11. Interactive DSA Visualizer</strong></summary>

One of the most important educational features of the project is its DSA Visualizer.

It demonstrates how different data structures organize and manage system information.

The visualizer includes eight sections:

| Visualizer | What It Demonstrates |
|---|---|
| Array | Room occupancy and room organization |
| Linked List | Student records connected through nodes |
| Hash Table | Student records organized for lookup |
| FIFO Queue | Waiting-list arrangement |
| Stack | Recent activity and LIFO behavior |
| Binary Search Tree | Student records organized by ID |
| Priority Queue | Complaints organized by priority |
| Graph | Hostel locations and connections |

Unlike isolated textbook examples, these visualizations are connected to the system's actual application data.

</details>

---

# 🧠 Data Structures & Algorithms

This project demonstrates the practical use of the following DSA concepts.

| Concept | Application | Purpose |
|---|---|---|
| Array | Room Management | Organizing fixed room records |
| Linked List | Student Management | Maintaining connected student records |
| Hash Table | Student Lookup | Efficient record access |
| Queue | Waiting List | FIFO-based student allocation |
| Stack | Activity Tracking | LIFO-based action management |
| Binary Search Tree | Student Records | Organizing records by student ID |
| Priority Queue | Complaints | Processing complaints by urgency |
| Graph | Hostel Navigation | Representing connected locations |
| Dijkstra's Algorithm | Path Finder | Finding shortest paths |

### 🔍 Why These Data Structures?

Each data structure is selected according to the problem it solves.

For example:

- A Queue is suitable for waiting students because the first student to enter should be considered first.
- A Stack is suitable for tracking recent actions because the latest action can be accessed first.
- A Priority Queue is useful for complaints because emergency situations must be handled before general requests.
- A Graph is suitable for representing hostel locations because different places are connected through routes.

This demonstrates how choosing the correct data structure can improve the organization and management of information.

---

## ⚙️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- CSS
- Lucide Icons
- Recharts

### Backend & Data Management
- C++17
- cpp-httplib
- nlohmann/json
- Cloudflare Workers
- Cloudflare D1 Database

### Deployment
- Vercel
- Cloudflare

---

## 🏗️ System Architecture

The project uses a frontend and backend architecture.

```text
             USER
               |
               ▼
      REACT + TYPESCRIPT
          FRONTEND
               |
               ▼
          REST API
               |
               ▼
       CLOUDFLARE WORKER
               |
               ▼
       CLOUDFLARE D1
           DATABASE
```

### Local C++ Implementation

The original C++ backend is maintained separately for local execution and demonstration of the DSA implementation.

It uses:

- C++17
- cpp-httplib for HTTP communication
- nlohmann/json for JSON handling

**Deployment note:** The currently deployed website uses a Cloudflare Worker and D1 database for its online API. The original C++ backend is not running inside Cloudflare Workers.

---

## 🧪 Testing & Verification

The system has been tested through its deployed application.

| Test | Result |
|---|---|
| Student Registration | ✅ Passed |
| Data Persistence After Refresh | ✅ Passed |
| Room Allocation | ✅ Passed |
| Room Occupancy Updates | ✅ Passed |
| Waiting List Management | ✅ Passed |
| Automatic Room Assignment | ✅ Passed |
| Complaint Submission | ✅ Passed |
| Priority-Based Resolution | ✅ Passed |
| Fine Creation | ✅ Passed |
| Student Checkout | ✅ Passed |
| Activity Tracking | ✅ Passed |
| DSA Visualizer Sections | ✅ Verified |
| Graph Pathfinding | ✅ Passed |

The project was tested using multiple records to verify that its major features work together.

---

## 🚀 Live Application

Try the deployed application:

<div align="center">

### [🌐 OPEN SMART HOSTEL MANAGEMENT SYSTEM](https://smart-hostel-management-system-livid.vercel.app)

**Explore the dashboard, manage hostel records, submit complaints, and interact with the DSA visualizers.**

</div>

> **Testing note:** The live application uses a shared database. Please use test records and avoid modifying or checking out records created by other testers.

---

## 💻 Installation and Local Setup

### Requirements

- Windows, Linux, or macOS
- Node.js and npm
- C++ compiler supporting C++17
- nlohmann/json
- cpp-httplib

### 1. Clone the Repository

```bash
git clone https://github.com/marium230-pixel/Smart-Hostel-Management-System.git
```

### 2. Open the Project

```bash
cd Smart-Hostel-Management-System
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Start the Frontend

```bash
npm run dev
```

### 5. Compile the Local C++ Backend

From the project root:

```bash
g++ -std=c++17 -I.\backend .\backend\main.cpp .\backend\HostelSystem.cpp -o .\backend\hostel_server.exe -lws2_32
```

### 6. Run the Backend

```bash
.\backend\hostel_server.exe
```

The local backend API runs at:

```text
http://localhost:8080/api
```

**Note:** The frontend API configuration must point to the local backend when running the original local C++ setup.

---

## 🔮 Future Improvements

Possible future enhancements include:

- Student login and authentication.
- Separate administrator and student accounts.
- Online fee payment integration.
- Email and notification alerts.
- Advanced complaint analytics.
- More detailed hostel reports.
- Improved room allocation strategies.

---

## 👥 Project Team

**Academic Project — CT-159**

NED University of Engineering & Technology  
Karachi, Pakistan

**Project:** Smart Hostel Management & Complaint System

*Developed as an academic project to demonstrate the practical application of Data Structures and Algorithms.*

---

<div align="center">

### ⭐ Smart Management. Smarter Data Structures.

**Built with C++, React, TypeScript, and DSA concepts.**

[Live Demo](https://smart-hostel-management-system-livid.vercel.app) · [GitHub Repository](https://github.com/marium230-pixel/Smart-Hostel-Management-System)

</div>
