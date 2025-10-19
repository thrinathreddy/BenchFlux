package com.benchflux.service;

import com.benchflux.controller.BenchFluxController;
import com.benchflux.model.AuthConfig;
import com.benchflux.model.TestRequest;
import com.benchflux.model.TestResponse;
import com.benchflux.model.TestResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.Disposable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Service
public class BenchFluxService {
	private static final Logger logger = LoggerFactory.getLogger(BenchFluxService.class);
    private final WebClient.Builder webClientBuilder;

    private List<Map<String, Object>> uploadedRequests;
    private Disposable runningTest;
    private final AtomicInteger currentTPS = new AtomicInteger(5); // default TPS
    private volatile boolean stopRequested = false;
    
    private final List<TestResult> resultsStore = new CopyOnWriteArrayList<>();

    public List<TestResult> getResults() {
        return resultsStore;
    }
    
    @Autowired
    public BenchFluxService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public void saveUploadedRequests(List<Map<String, Object>> requestBodies) {
        // Save the list of requests to be used for testing
        this.uploadedRequests = requestBodies;
    }

    public List<TestResult> executeTest(TestRequest request) {
        logger.info("type: {} with {} request bodies", request.getTestType(), request.getRequestBodies().size());
        resultsStore.clear(); // Always clear before a new test
        stopRequested = false;

        // Set TPS globally so dynamic updates can work
        currentTPS.set(request.getTargetTPS());

        if ("COMPARISON".equalsIgnoreCase(request.getTestType())) {
            runningTest = executeComparison(request)
                .doOnNext(resultsStore::add)
                .doOnComplete(() -> {
                    logger.info("✅ Comparison complete. Exporting {} results to CSV.", resultsStore.size());
                    exportResultsToCSV("results.csv", resultsStore);
                })
                .subscribe();
        } else {
            logger.info("▶️ Starting performance test with dynamic TPS");

            runningTest = executePerformanceTestWithTPS(request)
                .doOnNext(resultsStore::add)
                .doOnComplete(() -> {
                    logger.info("✅ Performance test complete. Exporting {} results to CSV.", resultsStore.size());
                    exportResultsToCSV("results.csv", resultsStore);
                })
                .subscribe();
        }

        return resultsStore;
    }

    private Flux<TestResult> executePerformanceTestWithTPS(TestRequest request) {
        int totalIterations = request.getIterations();
        int totalBatches = 999999; // simulate near-infinite batch loop, exit when counter hits total

        logger.info("🎯 Starting dynamic TPS test for {} iterations", totalIterations);

        AtomicInteger counter = new AtomicInteger(0);

        return Flux.range(0, totalBatches)
                .delayElements(Duration.ofSeconds(1))
                .takeUntil(i -> stopRequested || counter.get() >= totalIterations)
                .flatMap(batch -> {
                    if (stopRequested || counter.get() >= totalIterations) {
                        logger.info("🛑 Test stopped or limit reached.");
                        return Flux.empty();
                    }

                    int tpsNow = currentTPS.get();
                    logger.info("🚀 Batch #{} — Firing {} requests (Current TPS)", batch + 1, tpsNow);

                    int remaining = totalIterations - counter.get();
                    int batchSize = Math.min(tpsNow, remaining);

                    return Flux.range(0, batchSize)
                            .flatMap(i -> {
                                int currentCount = counter.incrementAndGet();
                                logger.info("📨 Sending request #{}", currentCount);
                                Map<String, Object> requestBody = getRequestBody(request);
                                return executeSingleCall(request, requestBody);
                            });
                })
                .doOnComplete(() -> logger.info("✅ Completed performance test"))
                .doOnError(e -> logger.error("❌ Error in performance test", e));
    }
    
    private Mono<TestResult> executeSingleCall(TestRequest request, Map<String, Object> requestBody) {
        logger.info("🌐 executeSingleCall -> Method: {}, URL: {}", request.getMethod(), request.getPrimaryUrl());
        logger.info("Headers: {}", request.getHeaders());
        logger.info("Body: {}", requestBody);
        if ("AUTO".equalsIgnoreCase(request.getAuthMode())) {
            if (request.getHeaders() == null) request.setHeaders(new HashMap<>());
            String tokenHeaderKey = request.getAuthTokenHeaderKey() != null
            	    ? request.getAuthTokenHeaderKey()
            	    : "Authorization";

            	String tokenValue = "Bearer " + request.getResolvedAuthToken();

            	request.getHeaders().put(tokenHeaderKey, tokenValue);

        }

        long start = System.currentTimeMillis();

        return webClientBuilder.baseUrl(request.getPrimaryUrl())
                .build()
                .method(HttpMethod.valueOf(request.getMethod()))
                .headers(headers -> headers.setAll(request.getHeaders()))
                .bodyValue(requestBody)
                .retrieve()
                .toEntity(String.class)
                .map(responseEntity -> {
                    long duration = System.currentTimeMillis() - start;

                    TestResponse response = new TestResponse(responseEntity.getBody(), responseEntity.getStatusCode().value());

                    TestResult result = new TestResult();
                    result.setPrimaryResponse(response);
                    result.setResponseTime(duration);
                    result.setStatus(responseEntity.getStatusCode().is2xxSuccessful());
                    result.setExecutionTimestamp(start);
                    result.setRequestBody(requestBody.toString());

                    return result;
                });
    }

    
    private Map<String, Object> getRequestBody(TestRequest request) {
        if (request.getRequestBodies() != null && !request.getRequestBodies().isEmpty()) {
            return request.getRequestBodies().get(0);
        }
        return uploadedRequests.get(new Random().nextInt(uploadedRequests.size()));
    }

    private Flux<TestResult> executeComparison(TestRequest request) {
        // For comparison, we need to execute the same requests on both the primary and comparison URLs
        List<Mono<TestResult>> comparisons = new ArrayList<>();

        for (Map<String, Object> requestBody : uploadedRequests) {
            Mono<TestResult> primaryCall = executeSingleCall(request, requestBody);
            Mono<TestResult> comparisonCall = executeSingleCall(new TestRequest(request.getComparisonUrl(), request.getMethod(), requestBody), requestBody);

            comparisons.add(Mono.zip(primaryCall, comparisonCall, (primaryResult, comparisonResult) -> {
                // Compare the results here
                TestResult comparisonResultFinal = new TestResult();
                comparisonResultFinal.setPrimaryResponse(primaryResult.getPrimaryResponse());
                comparisonResultFinal.setComparisonResponse(comparisonResult.getPrimaryResponse());
                comparisonResultFinal.setStatus(primaryResult.getStatus() && comparisonResult.getStatus());
                comparisonResultFinal.setResponseTime(primaryResult.getResponseTime() + comparisonResult.getResponseTime());
                return comparisonResultFinal;
            }));
        }

        return Flux.merge(comparisons);  // Merge all comparison results
    }
    
    public void updateTPS(int newTPS) {
        currentTPS.set(newTPS);
        logger.info("🔁 TPS updated dynamically to {}", newTPS);
    }

    public void stopTest() {
        stopRequested = true;
        if (runningTest != null && !runningTest.isDisposed()) {
            runningTest.dispose();
            logger.info("🛑 Test stopped by user.");
        }
    }
    
    public String isRunning() {
        return (runningTest != null && !runningTest.isDisposed()) ? "YES" : "NO";
    }
    
    public void exportResultsToCSV(String filePath, List<TestResult> results) {
        try (PrintWriter writer = new PrintWriter(new FileWriter(filePath))) {
            writer.println("Timestamp,Response Time (ms),Status,HTTP Code,Request Body,Response Body");

            for (TestResult result : results) {
                TestResponse response = result.getPrimaryResponse();
                writer.printf("%s,%d,%s,%d,\"%s\",\"%s\"%n",
                        new Date(result.getExecutionTimestamp()),
                        result.getResponseTime(),
                        result.getStatus(),
                        response.getStatusCode(),
                        result.getRequestBody() != null ? result.getRequestBody().replace("\"", "'"): "",
                        response.getBody()!= null ?response.getBody().replace("\"", "'"): "");
            }

            logger.info("📁 CSV export done at: {}", filePath);
        } catch (Exception e) {
            logger.error("❌ Failed to export CSV", e);
        }
    }

}
