# Realtime Streaming Dashboard 🚀

A real-time data streaming application built with **Spring Boot**, **Apache Kafka**, and **MySQL** (running in Docker).

---

## 📌 Features
- Spring Boot backend for consuming/producing Kafka messages
- Kafka integration for real-time event streaming
- MySQL persistence layer for storing messages
- Dockerized infrastructure (Kafka + MySQL)
- REST APIs to fetch and display messages

---

## 🛠️ Tech Stack
- **Java 17** + **Spring Boot**
- **Apache Kafka**
- **MySQL (Docker)**
- **Docker Compose**
- **Maven**

---

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/realtime-streaming-dashboard.git
cd realtime-streaming-dashboard
```

### 2. Start Infrastructure (Kafka + MySQL)
```bash
cd infrastructure
docker-compose up -d
```

### 3. Run Spring Boot Backend
```bash
git clone https://github.com/<your-username>/realtime-streaming-dashboard.git
cd realtime-streaming-dashboard
```

### 🔍 Verify Data in MySQL
```bash
docker exec -it mysql mysql -u linu -p
# Enter password: password
USE kafka_db;
SELECT * FROM messages;
```

---

## 🧰 Development

### Build the project
```bash
mvn clean install

```

## 🗂️ Project Structure

realtime-streaming-dashboard/
│── backend/ # Spring Boot application (REST API + Kafka + MySQL)
│ ├── src/main/java # Application source code
│ ├── src/main/resources # application.yml and static resources
│ └── pom.xml # Maven dependencies
│
│── infrastructure/ # Docker Compose setup
│ ├── docker-compose.yml # Kafka + Zookeeper + MySQL
│ └── README.md # Infra notes (optional)
│
│── README.md # Project documentation
│── .gitignore # Git ignore rules


---

## 🚀 Future Improvements
- Add a **frontend dashboard** (React/Angular/Vue) to visualize messages in real time
- Implement **message filtering & analytics** (e.g., keyword search, aggregations)
- Add **unit & integration tests** with Testcontainers for Kafka + MySQL
- Introduce **monitoring & observability** with Prometheus + Grafana
- Support for **multiple message streams** (partitioned topics)
- Deploy using **Docker Swarm / Kubernetes** for scalability  
