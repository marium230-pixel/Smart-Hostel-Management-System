#ifndef HOSTEL_SYSTEM_H
#define HOSTEL_SYSTEM_H

#include <iostream>
#include <string>
#include <vector>
#include <queue>
#include <stack>
#include <unordered_map>
#include <algorithm>
#include <limits>
#include <climits>
#include <functional>
#include <utility>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

// ===================== DATA MODELS =====================

struct Student {
    int id;
    string name;
    string department;
    int roomNumber = -1;
    bool active = true;
};

struct HostelRule {
    int ruleId;
    string ruleText;
    int fine;
};

struct FineRecord {
    int studentId;
    int ruleId;
    string ruleBroken;
    int amount;
    string date;
};

struct Room {
    int roomNumber;
    int students[2];
    int count;

    Room(int rNo = 0) {
        roomNumber = rNo;
        students[0] = -1;
        students[1] = -1;
        count = 0;
    }

    bool isFull() const { return count >= 2; }
    bool isEmpty() const { return count == 0; }
};

struct Complaint {
    int id;
    int studentId;
    string description;
    int priority;
    int sequence;
    string category;
};

struct ComplaintCompare {
    bool operator()(const Complaint& a, const Complaint& b) const {
        if (a.priority != b.priority)
            return a.priority < b.priority;

        return a.sequence > b.sequence;
    }
};

// ===================== BINARY SEARCH TREE =====================

struct BSTNode {
    Student data;
    BSTNode* left;
    BSTNode* right;

    BSTNode(Student s) : data(s), left(nullptr), right(nullptr) {}
};

class StudentBST {
private:
    BSTNode* root;

    void insertRec(BSTNode*& node, Student s);
    bool updateRec(BSTNode* node, int id, int roomNo);
    void inorderRec(BSTNode* node, vector<Student>& result) const;
    void clearRec(BSTNode* node);

public:
    StudentBST();
    ~StudentBST();

    StudentBST(const StudentBST&) = delete;
    StudentBST& operator=(const StudentBST&) = delete;

    void insert(Student s);
    void updateRoom(int id, int roomNo);
    vector<Student> displaySorted() const;
    json getTreeStructure() const;
};

// ===================== LINKED LIST =====================

class StudentLinkedList {
private:
    struct Node {
        Student data;
        Node* next;

        Node(Student s) : data(s), next(nullptr) {}
    };

    Node* head;
    int count;

public:
    StudentLinkedList();
    ~StudentLinkedList();

    StudentLinkedList(const StudentLinkedList&) = delete;
    StudentLinkedList& operator=(const StudentLinkedList&) = delete;

    void clear();
    void append(const Student& s);
    void update(const Student& s);
    vector<Student> getAll() const;
    int size() const;
};

// ===================== HOSTEL SYSTEM =====================

class HostelSystem {
private:
    // HASH TABLE
    unordered_map<int, Student> studentMap;

    // LINKED LIST
    StudentLinkedList studentList;

    // BINARY SEARCH TREE
    StudentBST studentBST;

    // STATIC ROOM ARRAY
    static constexpr int TOTAL_ROOMS = 5;
    Room rooms[TOTAL_ROOMS] = {
        Room(101), Room(102), Room(103),
        Room(104), Room(105)
    };

    // FIFO QUEUE
    queue<int> waitingList;

    // LIFO STACK
    stack<string> actionHistory;

    // FINE MANAGEMENT
    vector<FineRecord> fineRecords;
    unordered_map<int, int> violationCounts;

    // THREE PRIORITY QUEUES
    priority_queue<Complaint, vector<Complaint>, ComplaintCompare> highComplaints;
    priority_queue<Complaint, vector<Complaint>, ComplaintCompare> medComplaints;
    priority_queue<Complaint, vector<Complaint>, ComplaintCompare> lowComplaints;

    // RESOLVED COMPLAINTS
    vector<Complaint> resolvedComplaints;

    // GRAPH
    unordered_map<string, vector<pair<string, int>>> graph;

    int nextComplaintId = 1;
    int nextSeq = 0;

    // ORIGINAL DSA HELPER FUNCTIONS
    pair<int, string> classifyComplaint(string desc);
    int findFreeRoom() const;
    bool assignRoom(int studentId, int roomNo);
    void allocateFromWaiting();
    void addEdge(string a, string b, int distance);

    // JSON CONVERSION HELPERS
    json studentToJson(const Student& s) const;
    json complaintToJson(const Complaint& c) const;

public:
    HostelSystem();

    // DASHBOARD
    json getDashboard() const;

    // STUDENTS
    json getStudents() const;
    json registerStudent(int id, string name, string department);
    json checkoutStudent(int id);
    json searchStudent(int id) const;
    json getSortedStudents() const;

    // ROOMS AND WAITING LIST
    json getRooms() const;
    json getWaitingList() const;

    // RULES AND FINES
    json getRules() const;
    json addRuleViolation(int studentId, int ruleId);
    json getFines() const;

    // RECENT ACTIVITIES
    json getActivities() const;

    // COMPLAINTS
    json addComplaint(int studentId, string description);
    json getComplaints() const;
    json resolveComplaint();
    json getResolvedComplaints() const;

    // GRAPH AND DIJKSTRA
    json shortestPath(string source, string destination) const;

    // DSA INFORMATION
    // DSA INFORMATION
json getDSAStats() const;
json getBSTTree() const;
};

#endif