#include "httplib.h"
#include "HostelSystem.h"

#include <cstdlib>
#include <exception>
#include <iostream>
#include <string>

#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

int main() {
    httplib::Server server;
    HostelSystem hostel;

    // Render provides the port through the PORT environment variable.
    // Locally, the backend continues to use port 8080.
    int port = 8080;
    if (const char* renderPort = std::getenv("PORT")) {
        try {
            port = std::stoi(renderPort);
        } catch (const exception& e) {
            cerr << "Invalid PORT environment variable: " << e.what() << endl;
            return 1;
        }
    }

    auto cors = [](const httplib::Request&, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type");
    };

    server.set_pre_routing_handler(
        [&](const httplib::Request& req, httplib::Response& res) {
            cors(req, res);

            if (req.method == "OPTIONS") {
                res.status = 200;
                return httplib::Server::HandlerResponse::Handled;
            }

            return httplib::Server::HandlerResponse::Unhandled;
        }
    );

    auto sendJSON = [](httplib::Response& res, const json& data) {
        res.set_content(data.dump(4), "application/json");
    };

    server.Get("/api/health", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, {
            {"status", "working"},
            {"message", "Smart Hostel Backend is connected!"}
        });
    });

    server.Get("/api/dashboard", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getDashboard());
    });

    server.Get("/api/students", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getStudents());
    });

    server.Post("/api/students", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            sendJSON(res, hostel.registerStudent(
                body.at("id").get<int>(),
                body.at("name").get<string>(),
                body.at("department").get<string>()
            ));
        } catch (const exception& e) {
            res.status = 400;
            sendJSON(res, {{"error", e.what()}});
        }
    });

    server.Post("/api/students/checkout", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            sendJSON(res, hostel.checkoutStudent(
                body.at("id").get<int>()
            ));
        } catch (const exception& e) {
            res.status = 400;
            sendJSON(res, {{"error", e.what()}});
        }
    });

    server.Get("/api/rooms", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getRooms());
    });

    server.Get("/api/waiting-list", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getWaitingList());
    });

    server.Get("/api/rules", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getRules());
    });

    server.Get("/api/fines", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getFines());
    });

    server.Post("/api/fines", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            sendJSON(res, hostel.addRuleViolation(
                body.at("studentId").get<int>(),
                body.at("ruleId").get<int>()
            ));
        } catch (const exception& e) {
            res.status = 400;
            sendJSON(res, {{"error", e.what()}});
        }
    });

    server.Get("/api/activities", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getActivities());
    });

    server.Get("/api/complaints", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getComplaints());
    });

    server.Post("/api/complaints", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            json body = json::parse(req.body);
            sendJSON(res, hostel.addComplaint(
                body.at("studentId").get<int>(),
                body.at("description").get<string>()
            ));
        } catch (const exception& e) {
            res.status = 400;
            sendJSON(res, {{"error", e.what()}});
        }
    });

    server.Post("/api/complaints/resolve", [&](const httplib::Request& req, httplib::Response& res) {
        try {
            (void)json::parse(req.body);
            sendJSON(res, hostel.resolveComplaint());
        } catch (const exception& e) {
            res.status = 400;
            sendJSON(res, {{"error", e.what()}});
        }
    });

    server.Get("/api/complaints/resolved", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getResolvedComplaints());
    });

    server.Get("/api/dsa-stats", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getDSAStats());
    });

    server.Get("/api/bst-tree", [&](const httplib::Request&, httplib::Response& res) {
        sendJSON(res, hostel.getBSTTree());
    });

    server.Get("/api/path", [&](const httplib::Request& req, httplib::Response& res) {
        string source = req.get_param_value("source");
        string destination = req.get_param_value("destination");
        sendJSON(res, hostel.shortestPath(source, destination));
    });

    cout << "========================================" << endl;
    cout << "  SMART HOSTEL BACKEND SERVER" << endl;
    cout << "========================================" << endl;
    cout << "Server listening on 0.0.0.0:" << port << endl;

    // Render requires the service to listen on 0.0.0.0 and its assigned PORT.
    // This also works locally on port 8080 when PORT is not set.
    if (!server.listen("0.0.0.0", port)) {
        cerr << "Server failed to start!" << endl;
        return 1;
    }

    return 0;
}
