FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    nlohmann-json3-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/ /app/backend/

RUN g++ -std=c++17 -O2 -pthread -I/app/backend \
    /app/backend/main.cpp /app/backend/HostelSystem.cpp \
    -o /app/hostel_server

EXPOSE 8080
CMD ["/app/hostel_server"]
