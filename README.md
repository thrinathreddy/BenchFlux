🚀 BenchFlux

BenchFlux is a lightweight developer tool for performance benchmarking and response comparison across API versions or environments.
It helps developers quickly test API endpoints, measure response times, and identify data differences — all from a clean, web-based interface.

🌟 Features

⚡ API Performance Testing — Benchmark single or multiple REST endpoints.

🔍 Response Comparison — Compare JSON or text responses to detect differences.

📊 Metrics Dashboard — View latency, response times, and success/failure counts.

🧩 Customizable Requests — Supports GET, POST, PUT, DELETE with headers and payloads.

💻 Interactive Web UI — Built with React for an intuitive experience.

🛠️ Spring Boot Backend — Robust backend powered by Java and Maven.

⚙️ Configurable Ports — Easily change ports or settings via application.properties.

🧰 Tech Stack
Layer	Technology
Backend	Java 8+, Spring Boot, Maven
Frontend	React, Node.js, npm
Build Tool	Maven
API Type	REST APIs
UI Styling	HTML, CSS, JavaScript
⚙️ Setup & Run Instructions

Follow these steps to run BenchFlux locally.

🖥️ 1. Clone the Repository
git clone https://github.com/thrinathreddy/BenchFlux.git
cd BenchFlux

🔧 2. Build and Run the Backend

The backend is a Spring Boot application located at the project root.

Using Maven
mvn clean install

Start the application
# Option 1: From your IDE
Run BenchFluxApplication.java as a Spring Boot application.

# Option 2: From command line
mvn spring-boot:run


Once it’s up, the backend will start on port 8090 (default).

You can change the port in src/main/resources/application.properties
Example:
server.port=9090

💻 3. Setup and Run the Frontend (React)

The frontend code is located under the frontend/
 folder.

Navigate to frontend directory
cd frontend

Install dependencies
npm install

Run the React app
npm start


The frontend will start on http://localhost:3000
 by default.

If needed, you can configure the backend API URL in your frontend environment file or constants.

🌐 4. Access the Application

Once both backend and frontend are running:

Frontend UI → http://localhost:3000

Backend API → http://localhost:8090

📘 Example Usage

Try a sample test using:

https://postman-echo.com/post


With sample payload:

{
  "message": "BenchFlux Test"
}


You’ll see request metrics and response comparison directly in the UI.

🧭 Roadmap / Future Enhancements

🧵 Support for concurrent/multi-threaded API tests

📊 Enhanced charts and visual metrics

🧮 Configurable diff tolerance (ignore specific JSON fields)

🧱 Result export (CSV/JSON)

⚙️ CI/CD integration for automated regression benchmarks

👨‍💻 Author

Thrinath Reddy
GitHub: @thrinathreddy
