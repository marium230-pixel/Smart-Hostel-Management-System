#include "HostelSystem.h"

#include <set>
#include <cctype>
#include <sstream>

namespace {
    const int MAX_RULES = 12;

    const HostelRule hostelRules[MAX_RULES] = {
        {1, "Lights off after 11 PM", 500},
        {2, "No outsiders after 8 PM", 1000},
        {3, "Mess timing 7-9 AM, 12-2 PM, 7-9 PM", 300},
        {4, "Keep room clean, weekly inspection", 400},
        {5, "No loud music / speakers", 500},
        {6, "Gate closes at 10:30 PM", 1000},
        {7, "No smoking / prohibited items", 2000},
        {8, "Attendance mandatory after 10 PM", 700},
        {9, "No unauthorized room sharing", 1000},
        {10, "No damage to hostel property", 1500},
        {11, "No bullying or harassment", 2000},
        {12, "No littering in common areas", 300}
    };

    string trimText(const string& value) {
        const auto first = value.find_first_not_of(" \t\r\n");
        if (first == string::npos) return "";
        const auto last = value.find_last_not_of(" \t\r\n");
        return value.substr(first, last - first + 1);
    }

    string priorityName(int priority) {
        if (priority == 3) return "HIGH";
        if (priority == 2) return "MEDIUM";
        return "LOW";
    }
}

// ===================== BST IMPLEMENTATION =====================

StudentBST::StudentBST() : root(nullptr) {}

StudentBST::~StudentBST() {
    clearRec(root);
}

void StudentBST::insertRec(BSTNode*& node, Student s) {
    if (!node) {
        node = new BSTNode(s);
        return;
    }

    if (s.id < node->data.id) insertRec(node->left, s);
    else if (s.id > node->data.id) insertRec(node->right, s);
}

bool StudentBST::updateRec(BSTNode* node, int id, int roomNo) {
    if (!node) return false;

    if (id == node->data.id) {
        node->data.roomNumber = roomNo;
        return true;
    }

    if (id < node->data.id) return updateRec(node->left, id, roomNo);
    return updateRec(node->right, id, roomNo);
}

void StudentBST::inorderRec(BSTNode* node, vector<Student>& result) const {
    if (!node) return;
    inorderRec(node->left, result);
    result.push_back(node->data);
    inorderRec(node->right, result);
}

void StudentBST::clearRec(BSTNode* node) {
    if (!node) return;
    clearRec(node->left);
    clearRec(node->right);
    delete node;
}

void StudentBST::insert(Student s) {
    insertRec(root, s);
}

void StudentBST::updateRoom(int id, int roomNo) {
    updateRec(root, id, roomNo);
}

vector<Student> StudentBST::displaySorted() const {
    vector<Student> result;
    inorderRec(root, result);
    return result;
}
json StudentBST::getTreeStructure() const {
    auto buildTree = [](auto&& self, const BSTNode* node) -> json {
        if (node == nullptr) {
            return nullptr;
        }

        return {
            {"id", node->data.id},
            {"left", self(self, node->left)},
            {"right", self(self, node->right)}
        };
    };

    return buildTree(buildTree, root);
}

// ===================== LINKED LIST IMPLEMENTATION =====================

StudentLinkedList::StudentLinkedList() : head(nullptr), count(0) {}

StudentLinkedList::~StudentLinkedList() {
    clear();
}

void StudentLinkedList::clear() {
    while (head) {
        Node* temp = head;
        head = head->next;
        delete temp;
    }
    count = 0;
}

void StudentLinkedList::append(const Student& s) {
    Node* newNode = new Node(s);

    if (!head) {
        head = newNode;
    } else {
        Node* temp = head;
        while (temp->next) temp = temp->next;
        temp->next = newNode;
    }
    ++count;
}

void StudentLinkedList::update(const Student& s) {
    Node* temp = head;
    while (temp) {
        if (temp->data.id == s.id) {
            temp->data = s;
            return;
        }
        temp = temp->next;
    }
}

vector<Student> StudentLinkedList::getAll() const {
    vector<Student> result;
    Node* temp = head;
    while (temp) {
        result.push_back(temp->data);
        temp = temp->next;
    }
    return result;
}

int StudentLinkedList::size() const {
    return count;
}

// ===================== HOSTEL SYSTEM =====================

HostelSystem::HostelSystem() {
    addEdge("Gate", "Reception", 2);
    addEdge("Reception", "BlockA", 3);
    addEdge("Reception", "BlockB", 4);
    addEdge("BlockA", "Mess", 5);
    addEdge("BlockB", "Mess", 2);
    addEdge("BlockA", "Library", 4);
    addEdge("Mess", "Library", 3);
    addEdge("BlockB", "MedicalRoom", 6);
    addEdge("Library", "MedicalRoom", 2);
}

void HostelSystem::addEdge(string a, string b, int distance) {
    graph[a].push_back({b, distance});
    graph[b].push_back({a, distance});
}

pair<int, string> HostelSystem::classifyComplaint(string desc) {
    string lower = desc;
    transform(lower.begin(), lower.end(), lower.begin(),
        [](unsigned char c) { return static_cast<char>(tolower(c)); });

    // Keep the original project's HIGH and MEDIUM keyword rules.
    const vector<string> highKeywords = {
        "fire", "hazard", "smoke", "gas", "short circuit", "shock",
        "emergency", "medical", "accident", "injury", "fight", "theft",
        "flood", "leakage", "leak", "burst", "no water", "water shortage",
        "electric", "power failure", "danger", "harassment", "bullying",
        "broken wire", "sparking", "unconscious", "security threat", "violence",
        "severe bleeding", "ambulance"
    };

    const vector<string> medKeywords = {
        "water", "clean", "bathroom", "toilet", "mess", "food",
        "fan", "light", "ac", "cooler", "gutter", "drainage",
        "wifi", "internet", "plumbing", "washing machine", "door lock",
        "window", "bed", "mattress", "pest", "mosquito", "garbage",
        "electricity", "power cut", "broken tap", "water filter", "laundry",
        "smell", "sewage", "lift", "elevator", "room repair"
    };

    for (const string& keyword : highKeywords) {
        if (lower.find(keyword) != string::npos)
            return {3, "HIGH - Extreme/Emergency"};
    }

    for (const string& keyword : medKeywords) {
        if (lower.find(keyword) != string::npos)
            return {2, "MEDIUM - Daily Issue"};
    }

    return {1, "LOW - General"};
}

int HostelSystem::findFreeRoom() const {
    for (const auto& room : rooms) {
        if (!room.isFull()) return room.roomNumber;
    }
    return -1;
}

bool HostelSystem::assignRoom(int studentId, int roomNo) {
    auto it = studentMap.find(studentId);

    if (it == studentMap.end() || !it->second.active ||
        it->second.roomNumber != -1) {
        return false;
    }

    for (auto& room : rooms) {
        if (room.roomNumber == roomNo && !room.isFull()) {
            if (room.students[0] == -1) room.students[0] = studentId;
            else room.students[1] = studentId;

            ++room.count;
            it->second.roomNumber = roomNo;
            studentList.update(it->second);
            studentBST.updateRoom(studentId, roomNo);
            return true;
        }
    }

    return false;
}

void HostelSystem::allocateFromWaiting() {
    while (!waitingList.empty()) {
        const int id = waitingList.front();
        auto it = studentMap.find(id);

        if (it == studentMap.end() || !it->second.active ||
            it->second.roomNumber != -1) {
            waitingList.pop();
            continue;
        }

        const int freeRoom = findFreeRoom();
        if (freeRoom == -1) return;

        waitingList.pop();
        if (assignRoom(id, freeRoom)) {
            actionHistory.push("Auto-allocated Room " + to_string(freeRoom) +
                               " to ID " + to_string(id));
        }
        return;
    }
}

json HostelSystem::studentToJson(const Student& s) const {
    return {
        {"id", s.id},
        {"name", s.name},
        {"department", s.department},
        {"roomNumber", s.roomNumber},
        {"active", s.active},
        {"status", s.active ? "Active" : "Checked Out"}
    };
}

json HostelSystem::complaintToJson(const Complaint& c) const {
    return {
        {"id", c.id},
        {"studentId", c.studentId},
        {"description", c.description},
        {"priority", c.priority},
        {"priorityName", priorityName(c.priority)},
        {"category", c.category},
        {"sequence", c.sequence}
    };
}

// ===================== DASHBOARD =====================

json HostelSystem::getDashboard() const {
    int activeStudents = 0;
    int occupiedBeds = 0;
    int totalFines = 0;
    int pendingComplaints = static_cast<int>(
        highComplaints.size() + medComplaints.size() + lowComplaints.size());

    for (const auto& entry : studentMap) {
        if (entry.second.active) ++activeStudents;
    }

    for (const auto& room : rooms) occupiedBeds += room.count;
    for (const auto& fine : fineRecords) totalFines += fine.amount;

    return {
        {"totalStudents", activeStudents},
        {"occupiedBeds", occupiedBeds},
        {"totalBeds", TOTAL_ROOMS * 2},
        {"vacantBeds", TOTAL_ROOMS * 2 - occupiedBeds},
        {"occupancy", (TOTAL_ROOMS * 2 == 0 ? 0 :
            occupiedBeds * 100 / (TOTAL_ROOMS * 2))},
        {"pendingComplaints", pendingComplaints},
        {"resolvedComplaints", resolvedComplaints.size()},
        {"totalFines", totalFines},
        {"waitingStudents", waitingList.size()}
    };
}

// ===================== STUDENTS =====================

json HostelSystem::getStudents() const {
    json result = json::array();
    for (const auto& student : studentList.getAll()) {
        result.push_back(studentToJson(student));
    }
    return result;
}

json HostelSystem::registerStudent(int id, string name, string department) {
    name = trimText(name);
    department = trimText(department);

    if (id <= 0 || name.empty() || department.empty()) {
        return {{"success", false}, {"message", "Enter a valid ID, name and department."}};
    }

    if (studentMap.count(id)) {
        return {{"success", false}, {"message", "Student ID already exists."}};
    }

    Student student;
    student.id = id;
    student.name = name;
    student.department = department;
    student.roomNumber = -1;
    student.active = true;

    studentMap.emplace(id, student);
    studentList.append(student);
    studentBST.insert(student);
    actionHistory.push("Registered Student ID " + to_string(id) + " - " + name);

    const int freeRoom = findFreeRoom();
    if (freeRoom != -1) {
        if (!assignRoom(id, freeRoom)) {
            return {{"success", false}, {"message", "Student registered but room allocation failed."}};
        }

        return {
            {"success", true},
            {"message", "Student registered and allocated Room " + to_string(freeRoom) + "."},
            {"student", studentToJson(studentMap.at(id))}
        };
    }

    waitingList.push(id);
    return {
        {"success", true},
        {"message", "All rooms are full. Student added to the FIFO waiting list."},
        {"student", studentToJson(studentMap.at(id))}
    };
}

json HostelSystem::checkoutStudent(int id) {
    auto it = studentMap.find(id);

    if (it == studentMap.end() || !it->second.active) {
        return {{"success", false}, {"message", "Active student not found."}};
    }

    const int oldRoom = it->second.roomNumber;

    if (oldRoom != -1) {
        for (auto& room : rooms) {
            if (room.roomNumber == oldRoom) {
                if (room.students[0] == id) room.students[0] = -1;
                else if (room.students[1] == id) room.students[1] = -1;

                if (room.count > 0) --room.count;

                if (room.students[0] == -1 && room.students[1] != -1) {
                    room.students[0] = room.students[1];
                    room.students[1] = -1;
                }
                break;
            }
        }
    }

    it->second.roomNumber = -1;
    it->second.active = false;
    studentList.update(it->second);
    studentBST.updateRoom(id, -1);
    actionHistory.push("Checkout Student ID " + to_string(id));

    if (oldRoom != -1) allocateFromWaiting();

    return {
        {"success", true},
        {"message", "Student checked out successfully."},
        {"student", studentToJson(it->second)}
    };
}

json HostelSystem::searchStudent(int id) const {
    auto it = studentMap.find(id);
    if (it == studentMap.end()) {
        return {{"success", false}, {"message", "Student not found."}};
    }

    return {{"success", true}, {"student", studentToJson(it->second)}};
}

json HostelSystem::getSortedStudents() const {
    json result = json::array();

    for (Student student : studentBST.displaySorted()) {
        // The hash table is the authoritative source for active status.
        auto it = studentMap.find(student.id);
        if (it != studentMap.end()) student = it->second;
        result.push_back(studentToJson(student));
    }

    return result;
}

// ===================== ROOMS AND WAITING LIST =====================

json HostelSystem::getRooms() const {
    json result = json::array();

    for (const auto& room : rooms) {
        json occupants = json::array();

        for (int i = 0; i < 2; ++i) {
            if (room.students[i] != -1) {
                auto it = studentMap.find(room.students[i]);
                if (it != studentMap.end())
                    occupants.push_back(studentToJson(it->second));
            }
        }

        result.push_back({
            {"roomNumber", room.roomNumber},
            {"capacity", 2},
            {"occupied", room.count},
            {"vacant", 2 - room.count},
            {"isFull", room.isFull()},
            {"students", occupants}
        });
    }

    return result;
}

json HostelSystem::getWaitingList() const {
    json result = json::array();
    queue<int> copy = waitingList;
    int position = 1;

    while (!copy.empty()) {
        const int id = copy.front();
        copy.pop();

        auto it = studentMap.find(id);
        if (it != studentMap.end() && it->second.active &&
            it->second.roomNumber == -1) {
            result.push_back({
                {"position", position++},
                {"student", studentToJson(it->second)}
            });
        }
    }

    return result;
}

// ===================== RULES AND FINES =====================

json HostelSystem::getRules() const {
    json result = json::array();

    for (int i = 0; i < MAX_RULES; ++i) {
        result.push_back({
            {"ruleId", hostelRules[i].ruleId},
            {"ruleText", hostelRules[i].ruleText},
            {"fine", hostelRules[i].fine}
        });
    }

    return result;
}

json HostelSystem::addRuleViolation(int studentId, int ruleId) {
    auto it = studentMap.find(studentId);

    if (it == studentMap.end() || !it->second.active) {
        return {{"success", false}, {"message", "An active student is required."}};
    }

    if (ruleId < 1 || ruleId > MAX_RULES) {
        return {{"success", false}, {"message", "Rule ID must be between 1 and 12."}};
    }

    const HostelRule& rule = hostelRules[ruleId - 1];
    fineRecords.push_back({studentId, ruleId, rule.ruleText, rule.fine, "Today"});

    const int totalViolations = ++violationCounts[studentId];

    actionHistory.push("Fine Rs." + to_string(rule.fine) + " to ID " +
                       to_string(studentId) + " for Rule " + to_string(ruleId));

    return {
        {"success", true},
        {"message", "Fine recorded successfully."},
        {"studentId", studentId},
        {"studentName", it->second.name},
        {"ruleId", ruleId},
        {"ruleBroken", rule.ruleText},
        {"amount", rule.fine},
        {"date", "Today"},
        {"violationCount", totalViolations},
        {"warning", totalViolations >= 3}
    };
}

json HostelSystem::getFines() const {
    json records = json::array();
    int total = 0;

    for (const auto& fine : fineRecords) {
        auto it = studentMap.find(fine.studentId);
        const string name = (it != studentMap.end())
            ? it->second.name : to_string(fine.studentId);

        records.push_back({
            {"studentId", fine.studentId},
            {"studentName", name},
            {"ruleId", fine.ruleId},
            {"ruleBroken", fine.ruleBroken},
            {"amount", fine.amount},
            {"date", fine.date}
        });

        total += fine.amount;
    }

    return {
        {"records", records},
        {"totalFines", total},
        {"recordCount", fineRecords.size()}
    };
}

// ===================== RECENT ACTIONS =====================

json HostelSystem::getActivities() const {
    json result = json::array();
    stack<string> copy = actionHistory;

    int count = 0;
    while (!copy.empty() && count < 10) {
        result.push_back({
            {"description", copy.top()},
            {"position", count + 1}
        });
        copy.pop();
        ++count;
    }

    return result;
}

// ===================== COMPLAINTS =====================

json HostelSystem::addComplaint(int studentId, string description) {
    auto it = studentMap.find(studentId);
    description = trimText(description);

    if (it == studentMap.end() || !it->second.active) {
        return {{"success", false}, {"message", "An active student is required."}};
    }

    if (description.empty()) {
        return {{"success", false}, {"message", "Complaint description cannot be empty."}};
    }

    const auto classified = classifyComplaint(description);
    const int priority = classified.first;

    Complaint complaint{
        nextComplaintId++,
        studentId,
        description,
        priority,
        nextSeq++,
        classified.second
    };

    if (priority == 3) highComplaints.push(complaint);
    else if (priority == 2) medComplaints.push(complaint);
    else lowComplaints.push(complaint);

    actionHistory.push("Complaint #" + to_string(complaint.id) +
                       " [" + complaint.category + "] by ID " + to_string(studentId));

    return {
        {"success", true},
        {"message", "Complaint submitted successfully."},
        {"complaint", complaintToJson(complaint)}
    };
}

json HostelSystem::getComplaints() const {
    json high = json::array();
    json medium = json::array();
    json low = json::array();

    auto highCopy = highComplaints;
    while (!highCopy.empty()) {
        high.push_back(complaintToJson(highCopy.top()));
        highCopy.pop();
    }

    auto mediumCopy = medComplaints;
    while (!mediumCopy.empty()) {
        medium.push_back(complaintToJson(mediumCopy.top()));
        mediumCopy.pop();
    }

    auto lowCopy = lowComplaints;
    while (!lowCopy.empty()) {
        low.push_back(complaintToJson(lowCopy.top()));
        lowCopy.pop();
    }

    return {
        {"high", high},
        {"medium", medium},
        {"low", low},
        {"total", high.size() + medium.size() + low.size()}
    };
}

json HostelSystem::resolveComplaint() {
    Complaint complaint;
    bool found = false;

    if (!highComplaints.empty()) {
        complaint = highComplaints.top();
        highComplaints.pop();
        found = true;
    } else if (!medComplaints.empty()) {
        complaint = medComplaints.top();
        medComplaints.pop();
        found = true;
    } else if (!lowComplaints.empty()) {
        complaint = lowComplaints.top();
        lowComplaints.pop();
        found = true;
    }

    if (!found) {
        return {{"success", false}, {"message", "There are no pending complaints."}};
    }

    resolvedComplaints.push_back(complaint);
    actionHistory.push("Resolved Complaint #" + to_string(complaint.id));

    return {
        {"success", true},
        {"message", "Complaint resolved successfully."},
        {"complaint", complaintToJson(complaint)}
    };
}

json HostelSystem::getResolvedComplaints() const {
    json result = json::array();

    for (const auto& complaint : resolvedComplaints) {
        result.push_back(complaintToJson(complaint));
    }

    return result;
}

// ===================== GRAPH AND DIJKSTRA =====================

json HostelSystem::shortestPath(string source, string destination) const {
    if (!graph.count(source) || !graph.count(destination)) {
        return {
            {"success", false},
            {"message", "Unknown location. Check the available location names."}
        };
    }

    unordered_map<string, long long> distance;
    unordered_map<string, string> parent;

    for (const auto& entry : graph) {
        distance[entry.first] = LLONG_MAX;
    }

    using QueueItem = pair<long long, string>;
    priority_queue<QueueItem, vector<QueueItem>, greater<QueueItem>> pq;

    distance[source] = 0;
    pq.push({0, source});

    while (!pq.empty()) {
        const auto current = pq.top();
        pq.pop();

        const long long currentDistance = current.first;
        const string currentNode = current.second;

        if (currentDistance != distance[currentNode]) continue;
        if (currentNode == destination) break;

        for (const auto& edge : graph.at(currentNode)) {
            const string& neighbor = edge.first;
            const long long weight = edge.second;

            if (currentDistance + weight < distance[neighbor]) {
                distance[neighbor] = currentDistance + weight;
                parent[neighbor] = currentNode;
                pq.push({distance[neighbor], neighbor});
            }
        }
    }

    if (distance[destination] == LLONG_MAX) {
        return {{"success", false}, {"message", "No route found."}};
    }

    vector<string> path;
    string current = destination;

    while (current != source) {
        path.push_back(current);

        auto it = parent.find(current);
        if (it == parent.end()) {
            return {{"success", false}, {"message", "Could not reconstruct route."}};
        }
        current = it->second;
    }

    path.push_back(source);
    reverse(path.begin(), path.end());

    return {
        {"success", true},
        {"source", source},
        {"destination", destination},
        {"path", path},
        {"distance", distance[destination]},
        {"unit", "units"}
    };
}

// ===================== DSA INFORMATION =====================

json HostelSystem::getDSAStats() const {
    int occupiedBeds = 0;
    for (const auto& room : rooms) occupiedBeds += room.count;

    return {
        {"hashTableStudents", studentMap.size()},
        {"linkedListStudents", studentList.size()},
        {"bstStudents", studentBST.displaySorted().size()},
        {"waitingQueueSize", waitingList.size()},
        {"actionStackSize", actionHistory.size()},
        {"highPriorityQueueSize", highComplaints.size()},
        {"mediumPriorityQueueSize", medComplaints.size()},
        {"lowPriorityQueueSize", lowComplaints.size()},
        {"resolvedComplaints", resolvedComplaints.size()},
        {"roomArraySize", TOTAL_ROOMS},
        {"occupiedBeds", occupiedBeds},
        {"graphVertices", graph.size()}
    };

}
json HostelSystem::getBSTTree() const {
    return studentBST.getTreeStructure();
}
