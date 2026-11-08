#include "httplib.h"
#include <nlohmann/json.hpp>

int main() {
    nlohmann::json data;
    data["status"] = "working";

    return 0;
}