🚀 BenchFlux

BenchFlux is a lightweight developer tool for performance benchmarking and response comparison across API versions or environments.
It helps developers quickly test API endpoints, measure response times, and identify data differences with ease.

🌟 Features

⚡ API Performance Testing — Benchmark single or multiple endpoints with configurable payloads.

🔍 Response Comparison — Compare JSON or text responses side by side to detect differences.

📊 Detailed Metrics — View latency, success/failure counts, and response details.

🧩 Configurable Endpoints — Supports GET, POST, PUT, DELETE with custom headers and body.

💻 Web UI — Simple and interactive user interface to trigger benchmarks and view results.

🛠️ Built with Java & Spring Boot — Reliable, production-grade backend.

🎨 Frontend in JavaScript — Responsive, modern interface for quick testing.

🧰 Tech Stack
Layer	Technology
Backend	Java 8+, Spring Boot, Maven
Frontend	JavaScript, HTML, CSS
Build Tool	Maven
API Testing	RESTful APIs
⚙️ Setup & Run Instructions

Follow these simple steps to get BenchFlux running locally:

1. Clone or Download the Repository
git clone https://github.com/thrinathreddy/BenchFlux.git
cd BenchFlux

2. Build the Project

Use Maven to compile and install dependencies:

mvn clean install

3. Run the Application

Run the main Spring Boot class:

# Option 1: Using your IDE
Run BenchFluxApplication.java as a Java/Spring Boot application.

# Option 2: Using Maven
mvn spring-boot:run

4. Access the Web UI

Once the application starts successfully, open your browser and visit:

http://localhost:8090


The default port is 8090.
You can change the port by updating the server.port property in application.properties.

📘 Example Usage

You can test API endpoints such as:

https://postman-echo.com/post


with a JSON payload:

{
  "message": "BenchFlux Test"
}


BenchFlux will record the response time and display comparison results.

🧩 Roadmap / Ideas

Add concurrency & parallel request testing

Add JSON diff tolerance (ignore specific fields)

Export test results as CSV/JSON

CI/CD integration for automated regression checks

🧑‍💻 Author

Thrinath Reddy
GitHub: @thrinathreddy  
  
