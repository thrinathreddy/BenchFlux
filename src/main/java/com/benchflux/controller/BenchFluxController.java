package com.benchflux.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.benchflux.model.TestRequest;
import com.benchflux.model.TestResult;
import com.benchflux.model.TpsRequest;
import com.benchflux.service.BenchFluxService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api")
public class BenchFluxController {

    private static final Logger logger = LoggerFactory.getLogger(BenchFluxController.class);

    @Autowired
    private BenchFluxService testService;

    // Endpoint to start a test with the provided configuration
    @PostMapping("/runTest")
    public ResponseEntity<String> runTest(@RequestBody TestRequest testRequest) {
        try {
            logger.info("Starting test with authMode: {}", testRequest.getAuthMode());
        	// Set default TPS if not provided
            if (testRequest.getTargetTPS() <= 0) {
                testRequest.setTargetTPS(5); // default TPS
            }

            // Set default iterations if needed
            if (testRequest.getIterations() <= 0) {
                testRequest.setIterations(100); // default iteration count
            }
            logger.info("Starting test2");
            ObjectMapper objectMapper = new ObjectMapper();
            // Parse authTokenHeaders (if present)
            Map<String, String> authHeaders = null;
            if ("AUTO".equalsIgnoreCase(testRequest.getAuthMode())) {
                if (testRequest.getAuthTokenHeaders() != null && !testRequest.getAuthTokenHeaders().isEmpty()) {
                    try {
                        authHeaders = objectMapper.readValue(testRequest.getAuthTokenHeaders(), Map.class);
                    } catch (IOException e) {
                        return ResponseEntity.badRequest().body("Invalid JSON for authTokenHeaders.");
                    }
                }

                // Generate token initially
                String token = fetchAuthToken(testRequest);
                if (token == null) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to fetch auth token.");
                }

                testRequest.setResolvedAuthToken(token);

                // 🔁 Schedule token refresh (optional but powerful)
                scheduleTokenRefresh(testRequest, authHeaders);
            }else {
            	logger.info("Starting test3");
                if (testRequest.getRawHeaders() != null && !testRequest.getRawHeaders().isEmpty()) {
                    try {
                        // Convert the JSON string into a Map<String, String>
                        testRequest.setHeaders(objectMapper.readValue(testRequest.getRawHeaders(), Map.class));
                    } catch (IOException e) {
                       
                }
                logger.info("**************Raw Header222: *********"+ testRequest.getRawRequestBodies());
                // Handle requestBodies field (convert it to List<Map<String, Object>>)
                if (testRequest.getRawRequestBodies() != null && !testRequest.getRawRequestBodies().isEmpty()) {
                    try {
                        // Assuming requestBodies is a JSON string
                        testRequest.setRequestBodies(objectMapper.readValue(testRequest.getRawRequestBodies(), List.class));
                    } catch (IOException e) {
                        
                    }
                }

            }else {
            	if (testRequest.getRawRequestBodies() != null && !testRequest.getRawRequestBodies().isEmpty()) {
                    try {
                        // Assuming requestBodies is a JSON string
                        testRequest.setRequestBodies(objectMapper.readValue(testRequest.getRawRequestBodies(), List.class));
                    } catch (IOException e) {
                        
                    }
                }
            }
            }
            logger.info("Starting test4");
            testService.executeTest(testRequest);
            logger.info("Starting test5");
            return ResponseEntity.ok("Test started successfully.");

        } catch (Exception e) {
        	logger.info("Starting test6");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }


    // Endpoint to upload a JSON request file
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            List<Map<String, Object>> requestBodies = parseRequestFile(file);
            testService.saveUploadedRequests(requestBodies);  // Save the parsed request bodies to the service layer
            return ResponseEntity.ok("File uploaded and parsed successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading file: " + e.getMessage());
        }
    }

    // Utility method to parse the uploaded JSON file
    private List<Map<String, Object>> parseRequestFile(MultipartFile file) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(file.getInputStream(), new TypeReference<List<Map<String, Object>>>() {});
    }

    // Endpoint to get the test results (returns JSON)
    @GetMapping("/results")
    public ResponseEntity<Map<String, Object>> viewResults() {
        Map<String, Object> response = new HashMap<>();
        response.put("results", testService.getResults());       // your current results
        response.put("running", testService.isRunning());       // include running status
        return ResponseEntity.ok(response);
    }

    // Endpoint to stop the ongoing test
    @PostMapping("/stopTest")
    public ResponseEntity<String> stopTest() {
        testService.stopTest();
        return ResponseEntity.ok("Test stopped successfully.");
    }

    // Endpoint to update the Target TPS
    @PostMapping("/updateTps")
    public ResponseEntity<String> updateTPS(@RequestBody TpsRequest tpsRequest) {
        Integer tps = tpsRequest.getTps();
        // You may want to adjust the way TPS is set in the service
        testService.updateTPS(tps);
        return ResponseEntity.ok("TPS updated to: " + tps);
    }
    
    private String fetchAuthToken(TestRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            if (request.getAuthTokenHeaders() != null) {
                Map<String, String> headerMap = new ObjectMapper().readValue(request.getAuthTokenHeaders(), Map.class);
                headerMap.forEach(headers::add);
            }

            HttpEntity<?> httpEntity = (request.getAuthTokenBody() != null && !request.getAuthTokenBody().isEmpty())
                ? new HttpEntity<>(request.getAuthTokenBody(), headers)
                : new HttpEntity<>(headers);

            HttpMethod method = request.getAuthTokenMethod() != null && request.getAuthTokenMethod().equalsIgnoreCase("POST")
                ? HttpMethod.POST
                : HttpMethod.GET;

            ResponseEntity<String> response = restTemplate.exchange(request.getAuthTokenUrl(), method, httpEntity, String.class);

            String responseBody = response.getBody();

            // If a specific field is configured, extract from JSON
            if (request.getAuthTokenField() != null && !request.getAuthTokenField().isEmpty()) {
                JsonNode jsonNode = new ObjectMapper().readTree(responseBody);
                return jsonNode.path(request.getAuthTokenField()).asText(null);
            }

            // Otherwise assume raw token string
            return responseBody;

        } catch (Exception e) {
            logger.error("Token fetch failed: {}", e.getMessage());
            return null;
        }
    }
    
    private void scheduleTokenRefresh(TestRequest request, Map<String, String> headers) {
        int intervalSeconds = request.getAuthTokenRefreshInterval();
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

        scheduler.scheduleAtFixedRate(() -> {
            try {
                String newToken = fetchAuthToken(request);
                if (newToken != null) {
                    request.setResolvedAuthToken(newToken);
                    logger.info("Token refreshed successfully.");
                }
            } catch (Exception e) {
                logger.error("Failed to refresh token: {}", e.getMessage());
            }
        }, intervalSeconds, intervalSeconds, TimeUnit.SECONDS);
    }


}
