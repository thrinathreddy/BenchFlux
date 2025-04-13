package com.benchflux.model;

import lombok.Data;

@Data
public class TestResult {
    private TestResponse primaryResponse;  // Response from primary URL
    private TestResponse comparisonResponse;  // Response from comparison URL (for comparison tests)
    private long responseTime;  // Total response time in milliseconds
    private boolean status;  // Status of the request (true if successful, false otherwise)
    private long executionTimestamp; // When the request was made (epoch time)
    private String requestBody;
    // Getters and setters

    public TestResponse getPrimaryResponse() {
        return primaryResponse;
    }

    public void setPrimaryResponse(TestResponse primaryResponse) {
        this.primaryResponse = primaryResponse;
    }

    public TestResponse getComparisonResponse() {
        return comparisonResponse;
    }

    public void setComparisonResponse(TestResponse comparisonResponse) {
        this.comparisonResponse = comparisonResponse;
    }

    public long getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }

    public boolean getStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

	public long getExecutionTimestamp() {
		return executionTimestamp;
	}

	public void setExecutionTimestamp(long executionTimestamp) {
		this.executionTimestamp = executionTimestamp;
	}

	public String getRequestBody() {
		return requestBody;
	}

	public void setRequestBody(String requestBody) {
		this.requestBody = requestBody;
	}
}
