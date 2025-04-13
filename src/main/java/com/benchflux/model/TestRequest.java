package com.benchflux.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
public class TestRequest {
    private String primaryUrl;
    private String comparisonUrl;
    private String method;
    private Map<String, String> headers;
    private String testType;  // Either "PERFORMANCE" or "COMPARISON"
    private int targetTPS;  // Target TPS (transactions per second)
    private int iterations;  // Number of iterations for performance test
    private List<Map<String, Object>> requestBodies;  // A list of request bodies for testing
    private String rawHeaders; // JSON string from UI
    private String rawRequestBodies; // JSON array string from UI
   
	private String authMode; // MANUAL or AUTO

	// Auto token fields
	private String authTokenUrl;
	private String authTokenMethod; // GET or POST
	private String authTokenHeaders;
	private String authTokenBody;
	private String authTokenField; // e.g., "access_token"
	private int authTokenRefreshInterval;
	private String authTokenHeaderKey;

	private String resolvedAuthToken;
    
    // Constructor with comparisonUrl, method, and requestBody
    public TestRequest(String comparisonUrl, String method, Map<String, Object> requestBody) {
        this.comparisonUrl = comparisonUrl;
        this.method = method;
        this.requestBodies = new ArrayList<>();
        this.requestBodies.add(requestBody);  // Assuming one request body for now, add more logic if needed
    }
    
    public TestRequest() {}
    
    
    // Getters and setters

    public String getPrimaryUrl() {
        return primaryUrl;
    }

    public void setPrimaryUrl(String primaryUrl) {
        this.primaryUrl = primaryUrl;
    }

    public String getComparisonUrl() {
        return comparisonUrl;
    }

    public void setComparisonUrl(String comparisonUrl) {
        this.comparisonUrl = comparisonUrl;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public void setHeaders(Map<String, String> headers) {
        this.headers = headers;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public int getTargetTPS() {
        return targetTPS;
    }

    public void setTargetTPS(int targetTPS) {
        this.targetTPS = targetTPS;
    }

    public int getIterations() {
        return iterations;
    }

    public void setIterations(int iterations) {
        this.iterations = iterations;
    }

    public List<Map<String, Object>> getRequestBodies() {
        return requestBodies;
    }

    public void setRequestBodies(List<Map<String, Object>> requestBodies) {
        this.requestBodies = requestBodies;
    }

	public String getRawHeaders() {
		return rawHeaders;
	}

	public void setRawHeaders(String rawHeaders) {
		this.rawHeaders = rawHeaders;
	}

	public String getRawRequestBodies() {
		return rawRequestBodies;
	}

	public void setRawRequestBodies(String rawRequestBodies) {
		this.rawRequestBodies = rawRequestBodies;
	}

	public String getAuthMode() {
		return authMode;
	}

	public void setAuthMode(String authMode) {
		this.authMode = authMode;
	}

	public String getAuthTokenUrl() {
		return authTokenUrl;
	}

	public void setAuthTokenUrl(String authTokenUrl) {
		this.authTokenUrl = authTokenUrl;
	}

	public String getAuthTokenMethod() {
		return authTokenMethod;
	}

	public void setAuthTokenMethod(String authTokenMethod) {
		this.authTokenMethod = authTokenMethod;
	}

	public String getAuthTokenHeaders() {
		return authTokenHeaders;
	}

	public void setAuthTokenHeaders(String authTokenHeaders) {
		this.authTokenHeaders = authTokenHeaders;
	}

	public String getAuthTokenBody() {
		return authTokenBody;
	}

	public void setAuthTokenBody(String authTokenBody) {
		this.authTokenBody = authTokenBody;
	}

	public String getAuthTokenField() {
		return authTokenField;
	}

	public void setAuthTokenField(String authTokenField) {
		this.authTokenField = authTokenField;
	}

	public int getAuthTokenRefreshInterval() {
		return authTokenRefreshInterval;
	}

	public void setAuthTokenRefreshInterval(int authTokenRefreshInterval) {
		this.authTokenRefreshInterval = authTokenRefreshInterval;
	}

	public String getResolvedAuthToken() {
		return resolvedAuthToken;
	}

	public void setResolvedAuthToken(String resolvedAuthToken) {
		this.resolvedAuthToken = resolvedAuthToken;
	}

	public String getAuthTokenHeaderKey() {
		return authTokenHeaderKey;
	}

	public void setAuthTokenHeaderKey(String authTokenHeaderKey) {
		this.authTokenHeaderKey = authTokenHeaderKey;
	}
}
